import path from "path";
import JSZip from "jszip";
import SomeZipper from "../models/models";
import FileSystemProvider from "./FileSystemProvider";

class CustomZipper implements SomeZipper {
	async zip(pathToDir: string, fp: FileSystemProvider): Promise<Buffer> {
		const zip = new JSZip();
		const rootPath = path.resolve(pathToDir);

		const addFiles = async (currentPath: string, zipPath: string) => {
			const items = await fp.getItems(currentPath);
			for (const item of items) {
				const currentZipPath = path.join(zipPath, item.path.substring(rootPath.length + 1));
				if (item.isFile) {
					const fileContent = await fp.readAsBinary(item.path);
					zip.file(currentZipPath, fileContent);
				} else {
					await addFiles(item.path, currentZipPath);
				}
			}
		};
		await addFiles(rootPath, "");
		return zip.generateAsync({ type: "nodebuffer" });
	}

	async unzip(zippedContent: Buffer, outputDirectory: string, fp: FileSystemProvider): Promise<void> {
		const zip = await JSZip.loadAsync(zippedContent);

		const extractFiles = async (folder: JSZip) => {
			await Promise.all(
				Object.keys(folder.files).map(async (fileName) => {
					const file = folder.files[fileName];
					if (file.dir) {
						await extractFiles(zip);
					} else {
						const fileContent = await file.async("nodebuffer");
						const filePath = path.join(outputDirectory, fileName);
						await fp.write(filePath, JSON.stringify(fileContent));
					}
				})
			);
		};

		await extractFiles(zip);
	}
}

export default CustomZipper;

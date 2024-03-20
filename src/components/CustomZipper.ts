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
				const relativeFilePath = path.relative(rootPath, item.path);
				const currentZipPath = path.join(zipPath, relativeFilePath);
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

		await Promise.all(
			Object.entries(zip.files).map(async ([fileName, file]) => {
				if (!file.dir) {
					const fileContent = await file.async("nodebuffer");
					const filePath = path.join(outputDirectory, fileName);
					const directoryPath = path.dirname(filePath);
					await fp.mkdir(directoryPath);
					await fp.write(filePath, fileContent);
				}
			})
		);
	}
}

export default CustomZipper;

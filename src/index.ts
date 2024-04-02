import FileSystemProvider from "./components/FileSystemProvider";
import CustomZipper from "./components/CustomZipper";
import fs from "fs";
import Git from "./components/Git";

const fileProvider = new FileSystemProvider();
const zipper = new CustomZipper();
const git = new Git();

const runZip = async (url: string, clonePath: string) => {
	git.clone({
		url,
		path: clonePath,
		branch: "master",
		singleBranch: true,
		depth: 1,
	});
	const pathToDirectory = clonePath;
	const pathToUnzip = await zipper.zip(pathToDirectory, fileProvider);
	await fs.promises.writeFile("E:/web/file gx process/arch rep/Zip.zip", pathToUnzip);
	await runUnzip(pathToUnzip);
	console.log("Архивация завершена, архив сохранён.");
};

const runUnzip = async (zippedContent: Buffer) => {
	const outputDirectory = "E:/web/file gx process/unzipped rep";
	await zipper.unzip(zippedContent, outputDirectory, fileProvider);
	console.log("Разархивация завершена.");
};

runZip("https://github.com/DanilKazanov/test-file-gx.git", "E:/web/file gx process/rep").catch(console.error);

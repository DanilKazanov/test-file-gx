import FileSystemProvider from "./components/FileSystemProvider";
import CustomZipper from "./components/CustomZipper";
import fs from "fs";

const fileProvider = new FileSystemProvider();
const zipper = new CustomZipper();

const runZip = async () => {
	const pathToDirectory = "C:/Users/User1/Desktop/New folder/forZip";
	const pathToUnzip = await zipper.zip(pathToDirectory, fileProvider);
	await fs.promises.writeFile("C:/Users/User1/Desktop/New folder/zipped/Zip.zip", pathToUnzip);
	await runUnzip(pathToUnzip);
	console.log("Архивация завершена, архив сохранён.");
};

const runUnzip = async (zippedContent: Buffer) => {
	const outputDirectory = "C:/Users/User1/Desktop/New folder/unzipped";
	await zipper.unzip(zippedContent, outputDirectory, fileProvider);
	console.log("Разархивация завершена.");
};

runZip().catch(console.error);

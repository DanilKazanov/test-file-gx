import FileSystemProvider from "./components/FileSystemProvider";
import CustomZipper from "./components/CustomZipper";
import fs from 'fs';

const fileProvider = new FileSystemProvider();
const zipper = new CustomZipper();

const runZip = async () => {
  const pathToDirectory = 'C:/Users/User1/Desktop/arch/toZipFolder';
  const zippedContent = await zipper.zip(pathToDirectory, fileProvider);
  await fs.promises.writeFile('C:/Users/User1/Desktop/arch/toZip/Zip.zip', zippedContent);
  console.log("Архивация завершена, архив сохранён.");
};

const runUnzip = async () => {
  const pathToUnzip = 'C:/Users/User1/Desktop/arch/toUnzipZip.zip';
  const contentToUnzip = 'C:/Users/User1/Desktop/arch/toUnzip';
  await zipper.unzip(pathToUnzip, contentToUnzip, fileProvider);
  console.log("Разархивация завершена.");
};

// runZip().catch(console.error);
runUnzip().catch(console.error)





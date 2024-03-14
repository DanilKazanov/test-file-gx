import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import unzipper from 'unzipper';


interface SomeZipper {
    zip(pathToDir: string, fp: FileSystemProvider): Promise<Buffer>;
    unzip(pathToUnzip: string, content: any, fp: FileSystemProvider): Promise<void>;
  }

class FileSystemProvider {
  async read(filePath: string) {
    return fs.promises.readFile(filePath, { encoding: 'utf-8' });
  }

  async write(filePath: string, content: string) {
    await fs.promises.writeFile(filePath, content, { encoding: 'utf-8' });
  }

  async delete(filePath: string) {
    await fs.promises.unlink(filePath);
  }

  async mkdir(dirPath: string) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }

  async getItems(dirPath: string) {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return dirents.map((dirent: any) => ({
      path: path.join(dirPath, dirent.name),
      isFile: dirent.isFile(),
    }));
  }

  async readAsBinary(filePath: string) {
    return fs.promises.readFile(filePath);
  }
}

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
  await addFiles(rootPath, '');
  return zip.generateAsync({ type: "nodebuffer" });
  }
  
  async unzip(pathToUnzip: string, content: any, fp: FileSystemProvider): Promise<void> {
  fs.createReadStream(pathToUnzip)
  .pipe(unzipper.Extract({ path: content }));
  }
}

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

export {};


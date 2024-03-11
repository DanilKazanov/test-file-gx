import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import unzipper from 'unzipper';


interface SomeZipper {
    zip(pathToDir: string, fp: any): Promise<Buffer>;
    unzip(pathToUnzip: string, content: any, fp: any): Promise<void>;
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

const zipFunc = async (pathToDir: string, fp: FileSystemProvider) => {
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
};

const unzipFunc = (pathToZip: string, outputPath: string) => {
  fs.createReadStream(pathToZip)
    .pipe(unzipper.Extract({ path: outputPath }));
}

unzipFunc('C:/Users/User1/Desktop/New folder/zipped/archive.zip', 'C:/Users/User1/Desktop/New folder/unzipped')

// C:/Users/User1/DesktopNew folder/zipped/archive.zip

const runZip = async () => {
    const pathToDirectory = 'C:/Users/User1/Desktop/New folder/bin';
    const fileProvider = new FileSystemProvider();
    const zippedContent = await zipFunc(pathToDirectory, fileProvider);
    await fs.promises.writeFile('C:/Users/User1/Desktop/New folder/zipped/archive.zip', zippedContent);
    console.log("Архивация завершена, архив сохранён.", zippedContent);
  };
  
  // runZip().catch(console.error);

export {};


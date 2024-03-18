import fs from 'fs';
import path from 'path';

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

export default FileSystemProvider;
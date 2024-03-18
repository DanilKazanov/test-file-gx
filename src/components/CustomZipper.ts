import path from 'path';
import JSZip from 'jszip';
import unzipper from 'unzipper';
import fs from 'fs';
import SomeZipper from '../models/models';
import FileSystemProvider from './FileSystemProvider';

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

export default CustomZipper;
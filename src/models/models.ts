import FileSystemProvider from "../components/FileSystemProvider";

interface SomeZipper {
    zip(pathToDir: string, fp: FileSystemProvider): Promise<Buffer>;
    unzip(pathToUnzip: string, content: any, fp: FileSystemProvider): Promise<void>;
  }

export default SomeZipper;
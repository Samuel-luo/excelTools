import { TaskList } from "@@/common/types/CopyByKeywords";

export interface IElectronAPI {
  executeCopyByKeywords: (taskList: TaskList) => void;
  executeCopyByKeywordsCallback: (
    cb: (event: Electron.IpcRendererEvent, res: boolean) => void
  ) => void;
}

declare global {
  // image file
  declare module "*.svg";
  declare module "*.png";
  declare module "*.jpg";
  declare module "*.jpeg";
  declare module "*.gif";
  declare module "*.bmp";
  declare module "*.tiff";

  // style file
  declare module "*.css";
  declare module "*.sass";
  declare module "*.scss";

  interface Window {
    electronAPI: IElectronAPI;
  }
}

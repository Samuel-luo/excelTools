import { contextBridge, ipcRenderer } from "electron";
import { TaskList } from "@@/common/types/CopyByKeywords";

contextBridge.exposeInMainWorld("electronAPI", {
  executeCopyByKeywords: (taskList: TaskList) =>
    ipcRenderer.invoke("executeCopyByKeywords", taskList),
  executeCopyByKeywordsCallback: (
    cb: (event: Electron.IpcRendererEvent, res: boolean) => void
  ) => ipcRenderer.on("executeCopyByKeywordsCallback", cb)
});

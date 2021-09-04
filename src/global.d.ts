import { IpcMain, IpcRenderer } from "electron";
import { type } from "os";
import { Services } from "./main/service";

export interface GlobalShare {
  ipcMain: IpcMain;
  services: Services;
}

declare global {
  var share: GlobalShare;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

export interface Host {
  ip: string;
  domain: string;
  id: number;
}

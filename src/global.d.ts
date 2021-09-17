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

export interface HostConfig {
  system: Array<Host>;
  user: Array<Host>;
}

export interface Host {
  ip: string;
  domain: string;
  id: number;
}

export interface PortMappingConfig {
  mappings: Array<PortMapping>;
}

export interface PortMapping {
  port: number;
  labels: Array<string>;
}

export interface SystemConfig {
  keys: Array<string>;
}

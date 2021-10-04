import { ChildProcessWithoutNullStreams } from "child_process";
import { IpcMain, IpcRenderer } from "electron";
import { type } from "os";
import { Services } from "./main/service";

export interface GlobalShare {
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

export interface TunnelConfig {
	tunnels: Array<Tunnel>;
}

export interface TunnelPortMapping extends PortMapping {
	running: boolean;
	selectedLabel: string;
}

export interface Tunnel {
	ports: Array<TunnelPortMapping>;
	enabled: boolean;
	title: string;
	defaultHost?: string;
	id: string;
}

export interface StartTunnelConfig {
	splitPorts: boolean;
	host: Host;
}

export interface SpawnedTunnel {
	tunnel: Tunnel;
	config: StartTunnelConfig;
	processes: ChildProcessWithoutNullStreams[];
	messages: TunnelMessageContents[];
}

export interface TunnelMessageContents {
	contents: string;
	isError: boolean;
}

export interface TunnelMessage {
	message: TunnelMessageContents;
	tunnelId: string;
}

// Type Guards

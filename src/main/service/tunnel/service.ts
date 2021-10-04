import { IpcMain, ipcMain, IpcMainEvent } from "electron";
import { readFileSync, existsSync, writeFileSync } from "fs";
import {
	PortMapping,
	SpawnedTunnel,
	StartTunnelConfig,
	Tunnel,
	TunnelConfig,
} from "../../../global";
import {
	ServiceFunctionDefinitions,
	ServiceFunctionEvents,
	ServiceFunctions,
} from "../../types/app-types";
import { dataUtils } from "../../utils";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { getSSHPortString } from "../../utils/tunnel";

export const PREFIX = "service-tunnel";

const tunnlrTunnelsFile = dataUtils.getTunnlrTunnelFile();

interface ActiveTunnels {
	[tunnelId: string]: SpawnedTunnel;
}

export const activeTunnels: ActiveTunnels = {};

const writeTunnelConfigToFile = (system: TunnelConfig) => {
	writeFileSync(tunnlrTunnelsFile, JSON.stringify(system), "utf-8");
};

const readTunnelConfigFromFile = (): TunnelConfig | null => {
	if (!existsSync(tunnlrTunnelsFile)) {
		const defaultSystem: TunnelConfig = { tunnels: [] };
		writeTunnelConfigToFile(defaultSystem);
		return defaultSystem;
	} else {
		try {
			const systemConfig = readFileSync(tunnlrTunnelsFile, {
				encoding: "utf-8",
			});
			return JSON.parse(systemConfig);
		} catch (err) {
			console.error(err);
			return null;
		}
	}
};

const getTunnelConfigEvents = {
	send: `${PREFIX}-getTunnelConfig`,
	response: `${PREFIX}-getTunnelConfig-response`,
};

const getTunnelConfig = async (evt: IpcMainEvent) => {
	const tunnelConfFromFile: TunnelConfig | null = readTunnelConfigFromFile();
	if (tunnelConfFromFile) {
		evt.reply(getTunnelConfigEvents.response, tunnelConfFromFile);
	} else {
		evt.reply(getTunnelConfigEvents.response, { error: true });
	}
};

const addTunnelEvents = {
	send: `${PREFIX}-addTunnel`,
	response: `${PREFIX}-addTunnel-response`,
};

const addTunnel = async (evt: IpcMainEvent, tunnel: Tunnel) => {
	const tunnelConfig: TunnelConfig | null = readTunnelConfigFromFile();
	try {
		if (tunnelConfig) {
			tunnelConfig.tunnels = tunnelConfig?.tunnels.concat(tunnel);
			writeTunnelConfigToFile(tunnelConfig);
			evt.reply(addTunnelEvents.response, tunnel);
		}
	} catch (err) {
		evt.reply(addTunnelEvents.response, { error: true, message: "An unexpected error occured." });
	}
};

const startTunnelEvents = {
	send: `${PREFIX}-startTunnel`,
	response: `${PREFIX}-startTunnel-response`,
};

// All std error and std out need to be sent out. Maybe we can use LazyLog for the terminal?
const startTunnel = async (
	evt: IpcMainEvent,
	tunnel: Tunnel,
	startTunnelConfig: StartTunnelConfig
) => {
	try {
		if (activeTunnels[tunnel.id]) {
			evt.reply(startTunnelEvents.response, { error: true, message: "Tunnel is already running." });
		} else {
			const sshPortStrings = tunnel.ports.map((port) => ({
				str: getSSHPortString(port.port),
				port: port.selectedLabel,
			}));
			const processes: ChildProcessWithoutNullStreams[] = [];
			if (startTunnelConfig.splitPorts) {
				sshPortStrings.forEach((portStrings) => {
					const child = spawnProcess(startTunnelConfig.host.domain, [...portStrings.str]);
					registerChildEvents(child, portStrings.port);
					processes.push(child);
				});
			} else {
				const params = sshPortStrings
					.map((x) => x.str)
					.reduce((curr, next) => [...curr, ...next], []);

				const child = spawnProcess(startTunnelConfig.host.domain, [...params]);
				registerChildEvents(child, "process");
				processes.push(child);
			}

			const tunnelConfig = readTunnelConfigFromFile();

			if (tunnelConfig) {
				const storedTunnel = tunnelConfig.tunnels.find(
					(storedTunnel) => storedTunnel.id === tunnel.id
				);
				if (storedTunnel) {
					markTunnelStarted(storedTunnel);
					writeTunnelConfigToFile(tunnelConfig);
					activeTunnels[tunnel.id] = {
						tunnel: storedTunnel,
						processes,
						config: startTunnelConfig,
					};
					evt.reply(startTunnelEvents.response, {
						...activeTunnels[tunnel.id],
						processes: [],
					});
				} else {
					evt.reply(startTunnelEvents.response, {
						error: true,
						message: "An unexpected error occured.",
					});
				}
			} else {
				evt.reply(startTunnelEvents.response, {
					error: true,
					message: "An unexpected error occured.",
				});
			}
		}
	} catch (error) {
		console.error(error);
		// delete activeTunnels[tunnel.id];
		evt.reply(startTunnelEvents.response, {
			error: true,
			message: "An unexpected error occured.",
		});
	}
};

const markTunnelStarted = (tunnel: Tunnel) => {
	tunnel.enabled = true;
	tunnel.ports = tunnel.ports.map((port) => {
		port.running = true;
		return port;
	});
};

const markTunnelStopped = (tunnel: Tunnel) => {
	tunnel.enabled = false;
	tunnel.ports = tunnel.ports.map((port) => {
		port.running = false;
		return port;
	});
};

export const ensureTunnelsAreStopped = () => {
	const tunnelConfig = readTunnelConfigFromFile();

	if (tunnelConfig) {
		console.log("Ensuring they are stopped");
		tunnelConfig.tunnels.forEach((tunnel) => {
			markTunnelStopped(tunnel);
		});

		writeTunnelConfigToFile(tunnelConfig);
	}
};

const spawnProcess = (remoteHost: string, sshPortString: string[]) => {
	const child = spawn(`ssh`, [remoteHost, "-T", ...sshPortString]);
	return child;
};

const registerChildEvents = (process: ChildProcessWithoutNullStreams, owner?: string) => {
	process.stdout.on("data", (data) => {
		console.log(`[${owner}] [STDOUT] => ${data}`);
	});
	process.stderr.on("data", (data) => {
		console.log(`[${owner}] [ERROR]=> ${data}`);
	});
};

export interface TunnelService {
	definition: ServiceFunctionDefinitions<TunnelFunctionDefinitions>;
	functions: ServiceFunctions<TunnelFunctions>;
}

export interface TunnelFunctionDefinitions {
	getTunnelConfig: ServiceFunctionEvents;
	addTunnel: ServiceFunctionEvents;
	startTunnel: ServiceFunctionEvents;
}

export interface TunnelFunctions {
	getTunnelConfig: IpcMain;
	addTunnel: IpcMain;
}

const service = {
	definition: {
		getTunnelConfig: getTunnelConfigEvents,
		addTunnel: addTunnelEvents,
		startTunnel: startTunnelEvents,
	},
	functions: {
		getTunnelConfig: ipcMain.on(getTunnelConfigEvents.send, getTunnelConfig),
		addTunnel: ipcMain.on(addTunnelEvents.send, addTunnel),
		startTunnel: ipcMain.on(startTunnelEvents.send, startTunnel),
	},
};

export default service;

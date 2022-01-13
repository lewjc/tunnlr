import { IpcMain, ipcMain, IpcMainEvent } from "electron";
import { readFileSync, existsSync, writeFileSync } from "fs";
import {
  PortMapping,
  SpawnedProcess,
  SpawnedTunnel,
  StartTunnelConfig,
  Tunnel,
  TunnelConfig,
  TunnelPortMapping,
} from "../../../global";
import {
  ServiceFunctionDefinitions,
  ServiceFunctionEvents,
  ServiceFunctions,
} from "../../types/app-types";
import { dataUtils } from "../../utils";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { getSSHPortString } from "../../utils/tunnel";
import { getWindow } from "../../main";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

import readline from "readline";

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
    evt.reply(addTunnelEvents.response, {
      error: true,
      message: "An unexpected error occured.",
    });
  }
};

const startTunnelEvents = {
  send: `${PREFIX}-startTunnel`,
  response: `${PREFIX}-startTunnel-response`,
};

const startTunnel = async (
  evt: IpcMainEvent,
  tunnel: Tunnel,
  startTunnelConfig: StartTunnelConfig
) => {
  try {
    if (activeTunnels[tunnel.id]) {
      evt.reply(startTunnelEvents.response, {
        error: true,
        message: "Tunnel is already running.",
      });
    } else {
      const sshPortStrings = tunnel.ports.map((port) => ({
        str: getSSHPortString(port.port),
        port: port.selectedLabel,
      }));
      const processes: SpawnedProcess[] = [];
      if (startTunnelConfig.splitPorts) {
        sshPortStrings.map((portStrings) => {
          const child = spawnProcess(startTunnelConfig.host.domain, [
            ...portStrings.str,
          ]);
          const { readErr, readStdout } = registerChildEvents(
            child,
            tunnel.id,
            portStrings.port
          );
          processes.push({
            process: child,
            id: portStrings.port,
            readErr,
            readStdout,
          });
        });
      } else {
        const params = sshPortStrings
          .map((x) => x.str)
          .reduce((curr, next) => [...curr, ...next], []);

        const child = await spawnProcess(startTunnelConfig.host.domain, [
          ...params,
        ]);
        const { readErr, readStdout } = registerChildEvents(
          child,
          tunnel.id,
          "tunnel"
        );
        processes.push({ process: child, id: tunnel.id, readErr, readStdout });
      }

      const tunnelConfig = readTunnelConfigFromFile();

      if (tunnelConfig) {
        const storedTunnel = tunnelConfig.tunnels.find(
          (st) => st.id === tunnel.id
        );
        if (storedTunnel) {
          markTunnelStarted(storedTunnel);
          writeTunnelConfigToFile(tunnelConfig);
          activeTunnels[tunnel.id] = {
            tunnel: storedTunnel,
            processes,
            config: startTunnelConfig,
            messages: [],
          };
          evt.reply(startTunnelEvents.response, {
            ...activeTunnels[tunnel.id],
            processes: processes.map((x) => ({
              id: x.id,
            })),
          });
        } else {
          console.error("Unable to find tunnel in tunnel config");
          evt.reply(startTunnelEvents.response, {
            error: true,
            message: "An unexpected error occured.",
          });
        }
      } else {
        console.error("tunnel config not present");
        evt.reply(startTunnelEvents.response, {
          error: true,
          message: "An unexpected error occured.",
        });
      }
    }
  } catch (error) {
    console.error(error);
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

const stopTunnelEvents = {
  send: `${PREFIX}-stopTunnel`,
  response: `${PREFIX}-stopTunnel-response`,
};

const stopTunnel = async (evt: IpcMainEvent, tunnel: Tunnel) => {
  const activeTunnel = activeTunnels[tunnel.id];
  if (activeTunnel) {
    activeTunnel.processes.forEach(killProcess);
    markTunnelStopped(tunnel);
    const tunnelConfig = readTunnelConfigFromFile();
    if (tunnelConfig) {
      const storedTunnelIndex = tunnelConfig.tunnels.findIndex(
        (st) => st.id === tunnel.id
      );
      if (storedTunnelIndex !== -1) {
        tunnelConfig.tunnels[storedTunnelIndex] = tunnel;
        writeTunnelConfigToFile(tunnelConfig);
        delete activeTunnels[tunnel.id];
        evt.reply(stopTunnelEvents.response, { stopped: true, tunnel });
      } else {
        // Could not find stored tunnel index.
      }
    } else {
      // Could not find tunnel config
    }
  } else {
    // No tunnel available to be stopped.
  }
};

const stopPortEvents = {
  send: `${PREFIX}-stopPort`,
  response: `${PREFIX}-stopPort-response`,
};

const stopPort = async (
  evt: IpcMainEvent,
  tunnel: Tunnel,
  processId: string
) => {
  const activeTunnel = activeTunnels[tunnel.id];
  if (activeTunnel) {
    const portProcessToStopIndex = activeTunnel.processes.findIndex(
      (x) => x.id === processId
    );
    if (portProcessToStopIndex !== -1) {
      const process = activeTunnel.processes[portProcessToStopIndex];
      killProcess(process);
      activeTunnel.processes.splice(portProcessToStopIndex, 1);
      activeTunnel.tunnel.ports = activeTunnel.tunnel.ports.map((x) => {
        if (x.selectedLabel === processId) {
          x.running = false;
        }
        return x;
      });
      sendTunnelMessage(processId, "Stopping Port", tunnel.id, false);
      evt.reply(stopPortEvents.response, {
        ...activeTunnel,
        processes: activeTunnel.processes.map((x) => ({
          id: x.id,
        })),
      });
    } else {
      // could not find port process
    }
  } else {
    // could not find active tunnel
  }
};

const startPortEvents = {
  send: `${PREFIX}-startPort`,
  response: `${PREFIX}-startPort-response`,
};

const startPort = async (
  evt: IpcMainEvent,
  tunnel: Tunnel,
  domain: string,
  port: TunnelPortMapping
) => {
  // Here we need to spawn a new process and append to the active tunnels
  const activeTunnel = activeTunnels[tunnel.id];
  if (activeTunnel) {
    const sshPortStrings = [
      {
        str: getSSHPortString(port.port),
        port: port.selectedLabel,
      },
    ];

    const params = sshPortStrings
      .map((x) => x.str)
      .reduce((curr, next) => [...curr, ...next], []);

    const child = spawnProcess(domain, [...params]);
    const { readErr, readStdout } = registerChildEvents(
      child,
      tunnel.id,
      "tunnel"
    );
    activeTunnel.processes.push({
      process: child,
      id: tunnel.id,
      readErr,
      readStdout,
    });
    activeTunnel.tunnel.ports = activeTunnel.tunnel.ports.map((x) => {
      if (x.selectedLabel === port.selectedLabel) {
        x.running = true;
        sendTunnelMessage(
          port.selectedLabel,
          "Starting Port",
          tunnel.id,
          false
        );
      }
      return x;
    });

    evt.reply(startPortEvents.response, {
      ...activeTunnel,
      processes: activeTunnel.processes.map((x) => ({
        id: x.id,
      })),
    });
  } else {
    // Tunnel not active
  }
};

export const ensureTunnelsAreStopped = () => {
  const tunnelConfig = readTunnelConfigFromFile();

  if (tunnelConfig) {
    tunnelConfig.tunnels.forEach((tunnel) => {
      markTunnelStopped(tunnel);
    });

    writeTunnelConfigToFile(tunnelConfig);
  }

  Object.values(activeTunnels).forEach((x) => {
    x.processes.forEach(killProcess);
  });
};

const killProcess = (spawnedProcess: SpawnedProcess) => {
  spawnedProcess.readErr?.close();
  spawnedProcess.readStdout?.close();

  if (spawnedProcess.process?.pid) {
    try {
      process.kill(spawnedProcess.process.pid);
    } catch (error) {
      console.error(error);
      try {
        spawnedProcess.process.kill();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

const spawnProcess = async (remoteHost: string, sshPortString: string[]) => {
  return spawn(`ssh`, [remoteHost, "-t", "-t", ...sshPortString]);
};

const registerChildEvents = (
  process: ChildProcessWithoutNullStreams,
  tunnelId: string,
  owner: string
) => {
  const readStdout = readline.createInterface({ input: process.stdout });
  readStdout.on("line", (line: string) => {
    if (line) {
      sendTunnelMessage(owner, line, tunnelId, false);
    }
  });

  const readErr = readline.createInterface({ input: process.stderr });
  readErr.on("line", (line: string) => {
    if (line) {
      sendTunnelMessage(owner, line, tunnelId, true);
    }
  });
  return {
    readErr,
    readStdout,
  };
};

const sendTunnelMessage = (
  owner: string,
  content: string,
  tunnelId: string,
  isError: boolean
) => {
  const message = `[${owner}] ${content}`;
  const window = getWindow();
  try {
    if (
      window &&
      !window?.isDestroyed() &&
      !window?.webContents.isDestroyed()
    ) {
      window.webContents.send("active-tunnel-message", {
        message: {
          contents: message,
          isError,
        },
        tunnelId,
      });
    }
  } catch (err) {
    console.error("Error sending message");
  }
};

export interface TunnelService {
  definition: ServiceFunctionDefinitions<TunnelFunctionDefinitions>;
  functions: ServiceFunctions<TunnelFunctions>;
}

export interface TunnelFunctionDefinitions {
  getTunnelConfig: ServiceFunctionEvents;
  addTunnel: ServiceFunctionEvents;
  startTunnel: ServiceFunctionEvents;
  stopTunnel: ServiceFunctionEvents;
  stopPort: ServiceFunctionEvents;
  startPort: ServiceFunctionEvents;
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
    stopTunnel: stopTunnelEvents,
    stopPort: stopPortEvents,
    startPort: stopPortEvents,
  },
  functions: {
    getTunnelConfig: ipcMain.on(getTunnelConfigEvents.send, getTunnelConfig),
    addTunnel: ipcMain.on(addTunnelEvents.send, addTunnel),
    startTunnel: ipcMain.on(startTunnelEvents.send, startTunnel),
    stopTunnel: ipcMain.on(stopTunnelEvents.send, stopTunnel),
    stopPort: ipcMain.on(stopPortEvents.send, stopPort),
    startPort: ipcMain.on(startPortEvents.send, startPort),
  },
};

export default service;

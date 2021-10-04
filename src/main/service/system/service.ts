import { IpcMain, ipcMain, IpcMainEvent } from "electron";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { SystemConfig } from "../../../global";
import {
	ServiceFunctionDefinitions,
	ServiceFunctionEvents,
	ServiceFunctions,
} from "../../types/app-types";
import { dataUtils } from "../../utils";

export const PREFIX = "service-system";

const tunnlrSystemFile = dataUtils.getTunnlrSystemFile();

const writeSystemConfigToFile = (system: SystemConfig) => {
	writeFileSync(tunnlrSystemFile, JSON.stringify(system), "utf-8");
};

const readSystemConfigFromFile = () => {
	if (!existsSync(tunnlrSystemFile)) {
		const defaultSystem: SystemConfig = { keys: [] };
		writeSystemConfigToFile(defaultSystem);
		return defaultSystem;
	} else {
		try {
			const systemConfig = readFileSync(tunnlrSystemFile, {
				encoding: "utf-8",
			});
			return JSON.parse(systemConfig);
		} catch (err) {
			console.error(err);
			return null;
		}
	}
};

const getSystemConfigEvents = {
	send: `${PREFIX}-getSystemConfig`,
	response: `${PREFIX}-getSystemConfig-response`,
};

const getSystemConfig = async (evt: IpcMainEvent) => {
	const systemConfFromFile = readSystemConfigFromFile();
	if (systemConfFromFile) {
		evt.reply(getSystemConfigEvents.response, systemConfFromFile);
	} else {
		evt.reply(getSystemConfigEvents.response, { error: true });
	}
};

export interface SystemService {
	definition: ServiceFunctionDefinitions<SystemFunctionDefinitions>;
	functions: ServiceFunctions<SystemFunctions>;
}

export interface SystemFunctionDefinitions {
	getSystemConfig: ServiceFunctionEvents;
}

export interface SystemFunctions {
	getSystemConfig: IpcMain;
}

export default {
	definition: {
		getSystemConfig: getSystemConfigEvents,
	},
	functions: {
		getSystemConfig: ipcMain.on(getSystemConfigEvents.send, getSystemConfig),
	},
};

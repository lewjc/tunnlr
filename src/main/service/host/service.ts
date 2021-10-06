import { IpcMain, ipcMain, IpcMainEvent } from "electron";
import { readFileSync, mkdirSync, existsSync, writeFile } from "fs";
import { normalize, join } from "path";
import { getWindow } from "../../main";
import {
	ServiceFunctionDefinitions,
	ServiceFunctionEvents,
	ServiceFunctions,
} from "../../types/app-types";
import { dataUtils } from "../../utils";

export const PREFIX = "service-host";
const getHostsEvents = {
	send: `${PREFIX}-getHosts`,
	response: `${PREFIX}-getHosts-response`,
};

const getHosts = async (evt: IpcMainEvent, path: string) => {
	const tunnlrHostsFile = dataUtils.getTunnlrHostsFile();
	if (!existsSync(tunnlrHostsFile)) {
		if (!path) {
			path = (function () {
				switch (process.platform) {
					case "win32":
						return "C:/Windows/System32/drivers/etc/hosts";
					default:
						return "/etc/hosts";
				}
			})();
		}

		const buf = "" + readFileSync(normalize(path));
		const _ref = buf.replace(/#.*/g, "").split(/[\r\n]/);
		const systemHosts = [];
		let id = 0;
		for (let i = 0, _len = _ref.length; i < _len; i++) {
			const line = _ref[i];
			const md = /(\d+\.\d+\.\d+\.\d+)\s+(.+)/.exec(line);
			if (md) {
				const [, ip, host] = md;
				const splitHosts = host.split(" ");
				for (const splitHost of splitHosts) {
					systemHosts.push({
						ip,
						domain: splitHost,
						id: ++id,
					});
				}
			}
		}

		const hosts = {
			system: systemHosts,
			user: [],
		};

		writeFile(tunnlrHostsFile, JSON.stringify(hosts), "utf-8", function (err) {
			if (err) {
				console.error(err);
			}
			evt.reply(getHostsEvents.response, hosts);
		});
	} else {
		try {
			const hosts = readFileSync(tunnlrHostsFile, {
				encoding: "utf-8",
			});
			evt.reply(getHostsEvents.response, JSON.parse(hosts));
		} catch (err) {
			console.error(err);
		}
	}
};

export interface HostService {
	definition: ServiceFunctionDefinitions<HostFunctionDefinitions>;
	functions: ServiceFunctions<HostFunctions>;
}

export interface HostFunctionDefinitions {
	getHosts: ServiceFunctionEvents;
}

export interface HostFunctions {
	getHosts: IpcMain;
}

export default {
	definition: {
		getHosts: getHostsEvents,
	},
	functions: {
		getHosts: ipcMain.on(getHostsEvents.send, getHosts),
	},
};

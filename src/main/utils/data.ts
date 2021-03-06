import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const homedir = require("os").homedir();

const tunnlrDataPath = join(homedir, ".tunnlr");

if (!existsSync(tunnlrDataPath)) {
	mkdirSync(tunnlrDataPath);
}

export const getTunnlrDataPath = () => {
	return tunnlrDataPath;
};

export const getTunnlrHostsFile = () => {
	return join(tunnlrDataPath, "hosts.json");
};

export const getTunnlrPortMappingsFile = () => {
	return join(tunnlrDataPath, "portMappings.json");
};

export const getTunnlrSystemFile = () => {
	return join(tunnlrDataPath, "system.json");
};

export const getTunnlrTunnelFile = () => {
	return join(tunnlrDataPath, "tunnels.json");
};

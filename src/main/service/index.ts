import { HostService } from "./host/service";
import { PortMappingsService } from "./port/service";
import { TunnelService } from "./tunnel/service";
import { SystemService } from "./system/service";
import { ScriptService } from "./scripts/service";
import host from "./host";
import portMappings from "./port";
import system from "./system";
import tunnels from "./tunnel";
import scripts from "./scripts"

export interface Services {
	host: HostService;
	portMappings: PortMappingsService;
	system: SystemService;
	tunnels: TunnelService;
	scripts: ScriptService
}

const services: Services = {
	host,
	portMappings,
	system,
	tunnels,
	scripts
};

export default services;

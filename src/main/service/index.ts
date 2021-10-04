import { HostService } from "./host/service";
import { PortMappingsService } from "./port/service";
import { TunnelService } from "./tunnel/service";
import { SystemService } from "./system/service";
import host from "./host";
import portMappings from "./port";
import system from "./system";
import tunnels from "./tunnel";

export interface Services {
	host: HostService;
	portMappings: PortMappingsService;
	system: SystemService;
	tunnels: TunnelService;
}

const services: Services = {
	host,
	portMappings,
	system,
	tunnels,
};

export default services;

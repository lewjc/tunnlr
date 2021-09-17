import { HostService } from "./host";
import { PortMappingsService } from "./port";
import { SystemService } from "./system";

const host: HostService = require("./host");
const portMappings: PortMappingsService = require("./port");
const system: SystemService = require("./system");

export interface Services {
  host: HostService;
  portMappings: PortMappingsService;
  system: SystemService;
}

module.exports = {
  host,
  portMappings,
  system,
};

import {
  ServiceFunctionEvents,
  ServiceFunctionDefinitions,
  ServiceFunctions,
} from "../../types/app-types";

const service = require("./service");

export interface PortMappingsService {
  definition: ServiceFunctionDefinitions<PortMappingsFunctionDefinitions>;
  functions: ServiceFunctions<HostFunctions>;
}

export interface PortMappingsFunctionDefinitions {
  getPortMappings: ServiceFunctionEvents;
  addPortMapping: ServiceFunctionEvents;
  addPortMappingLabels: ServiceFunctionEvents;
}

export interface HostFunctions {
  getHosts(path: string): string;
}

module.exports = { ...service };

import { SystemConfig } from "../../../global";
import {
  ServiceFunctionEvents,
  ServiceFunctionDefinitions,
  ServiceFunctions,
} from "../../types/app-types";

const service = require("./service");

export interface SystemService {
  definition: ServiceFunctionDefinitions<SystemFunctionDefinitions>;
  functions: ServiceFunctions<SystemFunctions>;
}

export interface SystemFunctionDefinitions {
  getSystemConfig: ServiceFunctionEvents;
}

export interface SystemFunctions {
  getSystemConfig(): SystemConfig;
}

module.exports = { ...service };

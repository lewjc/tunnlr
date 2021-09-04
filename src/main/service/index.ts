import { HostService } from "./host";
const host: HostService = require("./host");

export interface Services {
  host: HostService;
}

module.exports = {
  host,
};

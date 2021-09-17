import { EEXIST } from "constants";
import { IpcMain, IpcMainEvent } from "electron";
import { existsSync, readFileSync, writeFile } from "fs";
import { writeFileSync } from "original-fs";
import { PortMapping, PortMappingConfig } from "../../../global";
import { dataUtils } from "../../utils";

export const PREFIX = "service-port";
const tunnlrPortMappings = dataUtils.getTunnlrPortMappingsFile();

// Data Read. TODO: Extract to a data layer.

const writePortMappingsToFile = (portMappings: PortMappingConfig) => {
  writeFileSync(tunnlrPortMappings, JSON.stringify(portMappings), "utf-8");
};

const readPortMappingsFromFile = () => {
  if (!existsSync(tunnlrPortMappings)) {
    const defaultPortMappings: PortMappingConfig = { mappings: [] };
    writePortMappingsToFile(defaultPortMappings);
    return defaultPortMappings;
  } else {
    try {
      const portMappings = readFileSync(tunnlrPortMappings, {
        encoding: "utf-8",
      });
      return JSON.parse(portMappings);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};

// Services

const getPortMappingsEvents = {
  send: `${PREFIX}-getPortMappings`,
  response: `${PREFIX}-getPortMappings-response`,
};

const getPortMappings = async (evt: IpcMainEvent) => {
  const portMappingsFromFile = readPortMappingsFromFile();
  if (portMappingsFromFile) {
    evt.reply(getPortMappingsEvents.response, portMappingsFromFile);
  } else {
    evt.reply(getPortMappingsEvents.response, { error: true });
  }
};

const addPortMappingEvents = {
  send: `${PREFIX}-addPortMapping`,
  response: `${PREFIX}-addPortMapping-response`,
};

const addPortMapping = async (evt: IpcMainEvent, portMapping: PortMapping) => {
  const portMappings: PortMappingConfig = readPortMappingsFromFile();
  portMappings.mappings = portMappings.mappings.concat(portMapping);
  try {
    writePortMappingsToFile(portMappings);
    evt.reply(addPortMappingEvents.response, portMapping);
  } catch (err) {
    evt.reply(addPortMappingEvents.response, { error: true });
  }
};

const addPortMappingLabelsEvents = {
  send: `${PREFIX}-addPortMappingLabels`,
  response: `${PREFIX}-addPortMappingLabels-response`,
};

const addPortMappingLabels = async (
  evt: IpcMainEvent,
  port: number,
  labels: Array<string>
) => {
  console.log(port);
  console.log(labels);
  const portMappings: PortMappingConfig = readPortMappingsFromFile();
  const modifiedIndex = portMappings.mappings.findIndex((x) => x.port === port);
  portMappings.mappings[modifiedIndex].labels.push(...labels);
  console.log(portMappings.mappings[modifiedIndex]);
  try {
    writePortMappingsToFile(portMappings);
    evt.reply(
      addPortMappingLabelsEvents.response,
      portMappings.mappings[modifiedIndex]
    );
  } catch (err) {
    evt.reply(addPortMappingLabelsEvents.response, { error: true });
  }
};

module.exports = {
  definition: {
    getPortMappings: getPortMappingsEvents,
    addPortMapping: addPortMappingEvents,
    addPortMappingLabels: addPortMappingLabelsEvents,
  },
  functions: {
    getPortMappings: global.share.ipcMain.on(
      getPortMappingsEvents.send,
      getPortMappings
    ),
    addPortMapping: global.share.ipcMain.on(
      addPortMappingEvents.send,
      addPortMapping
    ),
    addPortMappingLabels: global.share.ipcMain.on(
      addPortMappingLabelsEvents.send,
      addPortMappingLabels
    ),
  },
};

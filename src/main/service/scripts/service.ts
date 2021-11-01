import { ipcMain, IpcMain, IpcMainEvent } from "electron";
import { existsSync, readFileSync, writeFile } from "fs";
import { writeFileSync } from "original-fs";
import { Script, ScriptConfig } from "../../../global";
import {
  ServiceFunctionDefinitions,
  ServiceFunctionEvents,
  ServiceFunctions,
} from "../../types/app-types";
import { dataUtils } from "../../utils";

export const PREFIX = "service-script";
const tunnlrScriptFile = dataUtils.getTunnlrScriptsFile();


const writeScriptsToFile = (scriptConfig: ScriptConfig) => {
  writeFileSync(tunnlrScriptFile, JSON.stringify(scriptConfig), "utf-8");
};

const readScriptsFromFile = () => {
  if (!existsSync(tunnlrScriptFile)) {
    const defaultScripts: ScriptConfig = { scriptList: [] };
    writeScriptsToFile(defaultScripts);
    return defaultScripts;
  } else {
    try {
      const portMappings = readFileSync(tunnlrScriptFile, {
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

const getScriptEvents = {
  send: `${PREFIX}-getScripts`,
  response: `${PREFIX}-getScripts-response`,
};

const getScripts = async (evt: IpcMainEvent) => {
  const scriptsFromFile = readScriptsFromFile();
  if (scriptsFromFile) {
    evt.reply(getScriptEvents.response, scriptsFromFile);
  } else {
    evt.reply(getScriptEvents.response, { error: true });
  }
};

const addScriptEvents = {
  send: `${PREFIX}-addScript`,
  response: `${PREFIX}-addScript-response`,
};

const addScript = async (evt: IpcMainEvent, script: Script) => {
  const scriptConfig: ScriptConfig = readScriptsFromFile();
  scriptConfig.scriptList = scriptConfig.scriptList.concat(script);
  try {
    writeScriptsToFile(scriptConfig);
    evt.reply(addScriptEvents.response, script);
  } catch (err) {
    evt.reply(addScriptEvents.response, { error: true });
  }
};

export interface ScriptService {
  definition: ServiceFunctionDefinitions<ScriptFunctionDefinitions>;
  functions: ServiceFunctions<ScriptFunctions>;
}

export interface ScriptFunctionDefinitions {
  getScripts: ServiceFunctionEvents;
  addScript: ServiceFunctionEvents;
}

export interface ScriptFunctions {
  getScripts: IpcMain;
  addScript: IpcMain;
}

export default {
  definition: {
    getScripts: getScriptEvents,
    addScript: addScriptEvents,
  },
  functions: {
    getScripts: ipcMain.on(getScriptEvents.send, getScripts),
    addScript: ipcMain.on(addScriptEvents.send, addScript),
  },
};

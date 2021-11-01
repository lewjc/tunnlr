import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "..";
import { GlobalShare, HostConfig, PortMapping, PortMappingConfig, Script, ScriptConfig } from "../../../global";
const { ipcRenderer } = window.require("electron");

// Define a type for the slice state

interface ScriptsState {
  scriptsConfig: ScriptConfig;
  fetching: boolean;
  error: boolean;
  loaded: boolean;

}

// Define the initial state using that type
const initialState: ScriptsState = {
  scriptsConfig: {
    scriptList: [],
  },
  fetching: false,
  error: false,
  loaded: false,
};

export const scriptsSlice = createSlice({
  name: "scripts",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.fetching = true;
      state.error = false;
    },
    startAdding: (state) => {
      state.error = false;
    },

    setScripts: (state, action: PayloadAction<ScriptsState["scriptsConfig"]>) => {
      state.scriptsConfig = action.payload;
      state.fetching = false;
      state.error = false;
      state.loaded = true;
    },
    addScript: (state, action: PayloadAction<Script>) => {
      state.scriptsConfig.scriptList = [...state.scriptsConfig.scriptList, action.payload];
    },
    hasError: (state) => {
      state.fetching = false;
      state.error = true;
      state.loaded = true;
    },
  },
});

export const {
  startLoading,
  startAdding,
  hasError,
  setScripts,
  addScript
} = scriptsSlice.actions;

// State Funcs
export const fetchScripts = async (dispatch: AppDispatch, globalShare: GlobalShare) => {
  const { definition } = globalShare.services.scripts;
  dispatch(startLoading());
  try {
    ipcRenderer.send(definition.getScripts.send);
    ipcRenderer.on(definition.getScripts.response, (event, hosts) => {
      dispatch(setScripts(hosts));
    });
  } catch (e) {
    console.error(e);
    dispatch(hasError());
  }
};

export const createScript = async (
  dispatch: AppDispatch,
  globalShare: GlobalShare,
  script: Script
) => {
  const { definition } = globalShare.services.scripts;
  dispatch(startAdding());
  try {
    ipcRenderer.send(definition.addScript.send, script);
    ipcRenderer.on(definition.addScript.response, (event, addedMapping) => {
      dispatch(addScript(addedMapping));
    });
  } catch (e) {
    console.error(e);
    dispatch(hasError());
  }
};


export default scriptsSlice.reducer;

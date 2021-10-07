import { configureStore } from "@reduxjs/toolkit";
import { overArgs } from "lodash";
import { Dispatch } from "react";
import { arrayBuffer } from "stream/consumers";
import { TunnelMessage } from "../../global";
import globalReducer from "./slices/global";
import hostReducer from "./slices/host";
import portMappingsReducer from "./slices/portMappings";
import tunnelConfigReducer, { addMessage } from "./slices/tunnels";
const { ipcRenderer } = window.require("electron");

export const store = configureStore({
  reducer: {
    global: globalReducer,
    host: hostReducer,
    portMappings: portMappingsReducer,
    tunnelConfig: tunnelConfigReducer,
  },
});

// Initialising events that set state when recieving messages from IpcMain
ipcRenderer.on("active-tunnel-message", (evt, message: TunnelMessage) => {
  store.dispatch(addMessage(message));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

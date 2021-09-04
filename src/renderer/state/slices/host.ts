import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "..";
import { GlobalShare, Host } from "../../../global";
import { IpcMain } from "electron";
import { Services } from "../../../main/service";
import { HostService } from "../../../main/service/host";
const { ipcRenderer } = window.require("electron");

// Define a type for the slice state

interface HostState {
  hosts: {
    system: Array<Host>;
    user: Array<Host>;
  };
  fetching: boolean;
  error: boolean;
}

// Define the initial state using that type
const initialState: HostState = {
  hosts: {
    system: [],
    user: [],
  },
  fetching: false,
  error: false,
};

export const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.fetching = true;
    },
    setHosts: (state, action: PayloadAction<HostState["hosts"]>) => {
      state.hosts = action.payload;
      state.fetching = false;
      state.error = false;
    },
    hasError: (state) => {
      state.fetching = false;
      state.error = true;
    },
  },
});

export const { startLoading, setHosts, hasError } = hostSlice.actions;

// State Funcs
export const fetchHosts = async (
  dispatch: AppDispatch,
  globalShare: GlobalShare
) => {
  console.log(globalShare);
  const { definition } = globalShare.services.host;
  console.log(definition);
  dispatch(startLoading());
  try {
    ipcRenderer.send(definition.getHosts.send);
    ipcRenderer.on(definition.getHosts.response, (event, hosts) => {
      console.log(hosts);
      dispatch(setHosts(hosts));
    });
  } catch (e) {
    console.error(e);
    dispatch(hasError());
  }
};

export default hostSlice.reducer;

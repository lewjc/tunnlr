import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "..";
import {
  GlobalShare,
  PortMapping,
  SpawnedTunnel,
  StartTunnelConfig,
  Tunnel,
  TunnelConfig,
  TunnelMessage,
  TunnelPortMapping,
} from "../../../global";
import { useAppDispatch, useAppSelector } from "../hooks";
const { ipcRenderer } = window.require("electron");

// Define a type for the slice state

interface TunnelsState {
  tunnelConfig: TunnelConfig;
  fetching: boolean;
  error: boolean;
  loaded: boolean;
  adding: boolean;
  started: boolean;
  updating: boolean;
  starting: boolean;
  killing: boolean;
  activeTunnels: SpawnedTunnel[];
}

export function isSpawnedTunnel(object: object): object is SpawnedTunnel {
  const obj = object as SpawnedTunnel;
  return !!obj.tunnel && !!obj.config;
}

// Define the initial state using that type
const initialState: TunnelsState = {
  tunnelConfig: {
    tunnels: [],
  },
  activeTunnels: [],
  fetching: false,
  error: false,
  loaded: false,
  started: false,
  adding: false,
  starting: false,
  updating: false,
  killing: false,
};

export const tunnelsSlice = createSlice({
  name: "tunnels",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.fetching = true;
      state.error = false;
    },
    startAdding: (state) => {
      state.adding = true;
      state.error = false;
    },
    startStarting: (state) => {
      state.starting = true;
      state.error = false;
      state.started = false;
    },
    startKilling: (state) => {
      state.killing = true;
      state.error = false;
    },
    startUpdating: (state) => {
      state.updating = true;
      state.error = false;
    },
    setTunnelConfig: (
      state,
      action: PayloadAction<TunnelsState["tunnelConfig"]>
    ) => {
      state.tunnelConfig = action.payload;
      state.fetching = false;
      state.error = false;
      state.loaded = true;
    },
    addTunnel: (state, action: PayloadAction<Tunnel>) => {
      state.tunnelConfig.tunnels = [
        ...state.tunnelConfig.tunnels,
        action.payload,
      ];
    },
    addStartedTunnel: (state, action: PayloadAction<SpawnedTunnel>) => {
      state.activeTunnels = [...state.activeTunnels, action.payload];
      state.started = true;
      state.tunnelConfig.tunnels = [
        action.payload.tunnel,
        ...state.tunnelConfig.tunnels.filter(
          (x) => x.id !== action.payload.tunnel.id
        ),
      ];
    },
    stopTunnel: (state, action: PayloadAction<SpawnedTunnel>) => {
      state.activeTunnels = state.activeTunnels.filter(
        (x) => x.tunnel.id !== action.payload.tunnel.id
      );
      state.tunnelConfig.tunnels = [
        action.payload.tunnel,
        ...state.tunnelConfig.tunnels.filter(
          (x) => x.id !== action.payload.tunnel.id
        ),
      ];
    },
    stopPort: (state, action: PayloadAction<SpawnedTunnel>) => {
      state.activeTunnels = [
        ...state.activeTunnels.map((x) => {
          if (x.tunnel.id === action.payload.tunnel.id) {
            return {
              ...action.payload,
              messages: x.messages,
            };
          }
          return x;
        }),
      ];

      state.tunnelConfig.tunnels = [
        action.payload.tunnel,
        ...state.tunnelConfig.tunnels.filter(
          (x) => x.id !== action.payload.tunnel.id
        ),
      ];
    },
    addMessage: (state, action: PayloadAction<TunnelMessage>) => {
      const activeTunnel = {
        ...state.activeTunnels.find(
          (x) => x.tunnel.id === action.payload.tunnelId
        ),
      };
      if (isSpawnedTunnel(activeTunnel)) {
        activeTunnel.messages.push(action.payload.message);
        state.activeTunnels = [
          ...state.activeTunnels.filter(
            (x) => x.tunnel.id !== action.payload.tunnelId
          ),
          activeTunnel,
        ];
      }
    },
    hasError: (state) => {
      state.fetching = false;
      state.error = true;
      state.loaded = true;
      state.starting = false;
      state.updating = false;
      state.started = false;
      state.starting = false;
    },
  },
});

export const {
  startLoading,
  startStarting,
  startAdding,
  startUpdating,
  setTunnelConfig,
  addTunnel,
  hasError,
  addStartedTunnel,
  addMessage,
  stopTunnel,
  startKilling,
  stopPort,
} = tunnelsSlice.actions;

// State Funcs
export const fetchTunnelConfig = (
  dispatch: AppDispatch,
  globalShare: GlobalShare
) => {
  const { definition } = globalShare.services.tunnels;
  dispatch(startLoading());
  try {
    ipcRenderer.send(definition.getTunnelConfig.send);
    ipcRenderer.on(definition.getTunnelConfig.response, (event, tunnelConf) => {
      dispatch(setTunnelConfig(tunnelConf));
    });
  } catch (e) {
    console.error(e);
    dispatch(hasError());
  }
};

export const createTunnel = async (
  dispatch: AppDispatch,
  globalShare: GlobalShare,
  tunnel: Tunnel
) => {
  const { definition } = globalShare.services.tunnels;
  dispatch(startAdding());
  try {
    ipcRenderer.send(definition.addTunnel.send, tunnel);
    ipcRenderer.once(definition.addTunnel.response, (event, addedTunnel) => {
      dispatch(addTunnel(addedTunnel));
    });
  } catch (e) {
    console.error(e);
    dispatch(hasError());
  }
};

export const startTunnel = async (
  dispatch: AppDispatch,
  globalShare: GlobalShare,
  tunnel: Tunnel,
  startTunnelConfig: StartTunnelConfig
) => {
  const { definition } = globalShare.services.tunnels;
  return new Promise((resolve, reject) => {
    dispatch(startStarting());
    try {
      ipcRenderer.send(definition.startTunnel.send, tunnel, startTunnelConfig);
      ipcRenderer.once(definition.startTunnel.response, (event, response) => {
        if (response.error) {
          dispatch(hasError);
          reject();
        } else {
          dispatch(addStartedTunnel(response));
          resolve(true);
        }
      });
    } catch (e) {
      console.error(e);
      dispatch(hasError());
      reject();
    }
  });
};

export const killTunnel = async (
  dispatch: AppDispatch,
  globalShare: GlobalShare,
  tunnel: Tunnel
) => {
  const { definition } = globalShare.services.tunnels;
  return new Promise((resolve, reject) => {
    dispatch(startKilling());
    try {
      ipcRenderer.send(definition.stopTunnel.send, tunnel);
      ipcRenderer.once(definition.stopTunnel.response, (event, response) => {
        if (response.error) {
          dispatch(hasError);
          reject();
        } else {
          dispatch(stopTunnel(response));
          resolve(true);
        }
      });
    } catch (e) {
      console.error(e);
      dispatch(hasError());
      reject();
    }
  });
};

export const killPort = async (
  dispatch: AppDispatch,
  globalShare: GlobalShare,
  tunnel: Tunnel,
  port: TunnelPortMapping
) => {
  const { definition } = globalShare.services.tunnels;
  return new Promise((resolve, reject) => {
    dispatch(startKilling());
    try {
      ipcRenderer.send(
        definition.stopPort.send,
        tunnel,
        `${port.selectedLabel}`
      );
      ipcRenderer.once(definition.stopPort.response, (event, response) => {
        if (response.error) {
          dispatch(hasError);
          reject();
        } else {
          dispatch(stopPort(response));
          resolve(true);
        }
      });
    } catch (e) {
      console.error(e);
      dispatch(hasError());
      reject();
    }
  });
};

export const selectActiveTunnelPorts = () =>
  useAppSelector((state: RootState) =>
    state.tunnelConfig.activeTunnels.map((x) => x.tunnel.ports)
  );

export default tunnelsSlice.reducer;

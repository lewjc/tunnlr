import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "..";
import {
	GlobalShare,
	SpawnedTunnel,
	StartTunnelConfig,
	Tunnel,
	TunnelConfig,
} from "../../../global";
const { ipcRenderer } = window.require("electron");

// Define a type for the slice state

interface TunnelsState {
	tunnelConfig: TunnelConfig;
	fetching: boolean;
	error: boolean;
	loaded: boolean;
	adding: boolean;
	updating: boolean;
	starting: boolean;
	activeTunnels: SpawnedTunnel[];
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
	adding: false,
	starting: false,
	updating: false,
};

export const tunnelsSlice = createSlice({
	name: "host",
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
		},
		startUpdating: (state) => {
			state.updating = true;
			state.error = false;
		},
		setTunnelConfig: (state, action: PayloadAction<TunnelsState["tunnelConfig"]>) => {
			state.tunnelConfig = action.payload;
			state.fetching = false;
			state.error = false;
			state.loaded = true;
		},
		addTunnel: (state, action: PayloadAction<Tunnel>) => {
			state.tunnelConfig.tunnels = [...state.tunnelConfig.tunnels, action.payload];
		},
		addStartedTunnel: (state, action: PayloadAction<SpawnedTunnel>) => {
			state.activeTunnels = [...state.activeTunnels, action.payload];
			state.tunnelConfig.tunnels = [
				action.payload.tunnel,
				...state.tunnelConfig.tunnels.filter((x) => x.id !== action.payload.tunnel.id),
			];
		},
		hasError: (state) => {
			state.fetching = false;
			state.error = true;
			state.loaded = true;
			state.starting = false;
			state.updating = false;
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
} = tunnelsSlice.actions;

// State Funcs
export const fetchTunnelConfig = (dispatch: AppDispatch, globalShare: GlobalShare) => {
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
	dispatch(startStarting());
	try {
		ipcRenderer.send(definition.startTunnel.send, tunnel, startTunnelConfig);
		ipcRenderer.once(definition.startTunnel.response, (event, response) => {
			if (response.error) {
				dispatch(hasError);
			} else {
				dispatch(addStartedTunnel(response));
			}
		});
	} catch (e) {
		console.error(e);
		dispatch(hasError());
	}
};

export default tunnelsSlice.reducer;

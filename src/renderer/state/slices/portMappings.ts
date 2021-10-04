import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "..";
import { GlobalShare, HostConfig, PortMapping, PortMappingConfig } from "../../../global";
const { ipcRenderer } = window.require("electron");

// Define a type for the slice state

interface PortMappingsState {
	portMappings: PortMappingConfig;
	fetching: boolean;
	error: boolean;
	loaded: boolean;
	adding: boolean;
	updating: boolean;
}

// Define the initial state using that type
const initialState: PortMappingsState = {
	portMappings: {
		mappings: [],
	},
	fetching: false,
	error: false,
	loaded: false,
	adding: false,
	updating: false,
};

export const portMappingsSlice = createSlice({
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
		startUpdating: (state) => {
			state.updating = true;
			state.error = false;
		},
		setPortMappings: (state, action: PayloadAction<PortMappingsState["portMappings"]>) => {
			state.portMappings = action.payload;
			state.fetching = false;
			state.error = false;
			state.loaded = true;
		},
		addPortMapping: (state, action: PayloadAction<PortMapping>) => {
			state.portMappings.mappings = [...state.portMappings.mappings, action.payload];
		},
		addPortMappingLabels: (state, action: PayloadAction<PortMapping>) => {
			state.portMappings.mappings = [
				...state.portMappings.mappings.filter((x) => x.port !== action.payload.port),
				action.payload,
			];
			state.updating = false;
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
	startUpdating,
	setPortMappings,
	addPortMapping,
	addPortMappingLabels,
	hasError,
} = portMappingsSlice.actions;

// State Funcs
export const fetchPortMappings = async (dispatch: AppDispatch, globalShare: GlobalShare) => {
	const { definition } = globalShare.services.portMappings;
	dispatch(startLoading());
	try {
		ipcRenderer.send(definition.getPortMappings.send);
		ipcRenderer.on(definition.getPortMappings.response, (event, hosts) => {
			dispatch(setPortMappings(hosts));
		});
	} catch (e) {
		console.error(e);
		dispatch(hasError());
	}
};

export const createPortMapping = async (
	dispatch: AppDispatch,
	globalShare: GlobalShare,
	mapping: PortMapping
) => {
	const { definition } = globalShare.services.portMappings;
	dispatch(startAdding());
	try {
		ipcRenderer.send(definition.addPortMapping.send, mapping);
		ipcRenderer.on(definition.addPortMapping.response, (event, addedMapping) => {
			dispatch(addPortMapping(addedMapping));
		});
	} catch (e) {
		console.error(e);
		dispatch(hasError());
	}
};

export const addLabelsToPortMapping = async (
	dispatch: AppDispatch,
	globalShare: GlobalShare,
	port: number,
	labels: Array<string>
) => {
	const { definition } = globalShare.services.portMappings;
	dispatch(startUpdating());
	try {
		ipcRenderer.send(definition.addPortMappingLabels.send, port, labels);
		ipcRenderer.on(definition.addPortMappingLabels.response, (event, addedMapping) => {
			dispatch(addPortMappingLabels(addedMapping));
		});
	} catch (e) {
		console.error(e);
		dispatch(hasError());
	}
};

export default portMappingsSlice.reducer;

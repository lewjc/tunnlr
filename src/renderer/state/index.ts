import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./slices/global";
import hostReducer from "./slices/host";
import portMappingsReducer from "./slices/portMappings";
import tunnelConfigReducer from "./slices/tunnels";

export const store = configureStore({
	reducer: {
		global: globalReducer,
		host: hostReducer,
		portMappings: portMappingsReducer,
		tunnelConfig: tunnelConfigReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

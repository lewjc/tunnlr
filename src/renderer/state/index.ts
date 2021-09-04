import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./slices/global";
import hostReducer from "./slices/host";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    host: hostReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

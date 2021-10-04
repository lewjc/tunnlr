import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "..";
import { GlobalShare } from "../../../global";
import { IpcMain } from "electron";
import { Services } from "../../../main/service";
import { useAppSelector } from "../hooks";
const { ipcRenderer } = window.require("electron");

// Define a type for the slice state
interface GlobalState {
	share: GlobalShare;
	isFetching: boolean;
	isLoaded: boolean;
}

// Define the initial state using that type
const initialState: GlobalState = {
	share: null,
	isFetching: false,
	isLoaded: false,
};

export const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		set: (state, action: PayloadAction<GlobalShare>) => {
			state.share = { ...action.payload };
			state.isFetching = false;
			state.isLoaded = true;
		},
		startLoading: (state) => {
			state.isFetching = false;
		},
	},
});

export const { set, startLoading } = globalSlice.actions;

export const loadGlobal = (dispatch: AppDispatch) => {
	dispatch(startLoading());
	const globalShare = JSON.parse(ipcRenderer.sendSync("global"));
	dispatch(set(globalShare));
};

// Other code such as selectors can use the imported `RootState` type
export const selectGlobalShare = () => useAppSelector((state: RootState) => state.global.share);
export const selectGlobalShareMainServices = (state: RootState): Services | undefined =>
	state.global.share.services;

export default globalSlice.reducer;

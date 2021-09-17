import React, { useEffect } from "react";
import { fetchHosts } from "../state/slices/host";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { loadGlobal } from "../state/slices/global";
import Main from "../views/main";
import Loading from "./loading/loading";
import { fetchPortMappings } from "../state/slices/portMappings";

interface AppProps {}

export default function App(props: AppProps) {
  const { hosts, fetching: fetchingHosts } = useAppSelector(
    (state) => state.host
  );
  const {
    portMappings,
    fetching: fetchingPortMappings,
    loaded: loadedPortMappings,
  } = useAppSelector((state) => state.portMappings);
  const { global } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!global.isLoaded && !global.isFetching) {
      loadGlobal(dispatch);
    }
  }, [dispatch, global]);

  useEffect(() => {
    if (global.isLoaded && !fetchingHosts && hosts.system.length === 0) {
      setTimeout(() => {
        fetchHosts(dispatch, global.share);
      }, 1500);
    }
  }, [dispatch, hosts, global]);

  useEffect(() => {
    if (global.isLoaded && !fetchingPortMappings && !loadedPortMappings) {
      setTimeout(() => {
        fetchPortMappings(dispatch, global.share);
      }, 1500);
    }
  }, [dispatch, portMappings, global]);

  return !global.isLoaded ||
    hosts.system.length === 0 ||
    !loadedPortMappings ? (
    <Loading />
  ) : (
    <Main />
  );
}

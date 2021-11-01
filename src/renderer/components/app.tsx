import React, { useEffect, useMemo } from "react";
import { fetchHosts } from "../state/slices/host";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { loadGlobal } from "../state/slices/global";
import Main from "../views/main/main";
import Loading from "./loading/loading";
import { fetchPortMappings } from "../state/slices/portMappings";
import { fetchTunnelConfig } from "../state/slices/tunnels";
import { fetchScripts } from "../state/slices/scripts";

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
  const {
    tunnelConfig,
    fetching: fetchingTunnelConfig,
    loaded: loadedTunnelConfig,
  } = useAppSelector((state) => state.tunnelConfig);
  const {
    scriptsConfig,
    loaded: loadedScripts,
    fetching: fetchingScripts,
  } = useAppSelector((state) => state.scripts);
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
      }, 500);
    }
  }, [dispatch, hosts, global]);

  useEffect(() => {
    if (global.isLoaded && !fetchingPortMappings && !loadedPortMappings) {
      setTimeout(() => {
        fetchPortMappings(dispatch, global.share);
      }, 500);
    }
  }, [dispatch, portMappings, global]);

  useEffect(() => {
    if (global.isLoaded && !fetchingTunnelConfig && !loadedTunnelConfig) {
      setTimeout(() => {
        fetchTunnelConfig(dispatch, global.share);
      }, 500);
    }
  }, [dispatch, tunnelConfig, global]);

  useEffect(() => {
    if (global.isLoaded && !fetchingScripts && !loadedScripts) {
      setTimeout(() => {
        fetchScripts(dispatch, global.share);
      }, 500);
    }
  }, [dispatch, scriptsConfig, global]);

  const isLoadingAppData = useMemo(
    () =>
      !global.isLoaded ||
      hosts.system.length === 0 ||
      !loadedPortMappings ||
      !loadedTunnelConfig,
    [global, hosts.system, loadedPortMappings, loadedTunnelConfig]
  );

  return isLoadingAppData ? <Loading /> : <Main />;
}

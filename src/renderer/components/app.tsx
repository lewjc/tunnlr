import React, { useEffect } from "react";
import { fetchHosts } from "../state/slices/host";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { loadGlobal } from "../state/slices/global";
import Main from "../views/main";
import Loading from "./loading/loading";

interface AppProps {}

export default function App(props: AppProps) {
  const { hosts, fetching } = useAppSelector((state) => state.host);
  const { global } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!global.isLoaded && !global.isFetching) {
      loadGlobal(dispatch);
    }
  }, [dispatch, global]);

  useEffect(() => {
    if (global.isLoaded && !fetching && hosts.system.length === 0) {
      setTimeout(() => {
        fetchHosts(dispatch, global.share);
      }, 1500);
    }
  }, [dispatch, hosts, global]);
  return !global.isLoaded || hosts.system.length === 0 ? <Loading /> : <Main />;
}

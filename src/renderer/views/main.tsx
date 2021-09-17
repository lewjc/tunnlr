import React from "react";
import { Route, Switch } from "react-router-dom";
import SideNav from "../components/sidenav";
import Configuration from "./configuration";
import Hosts from "./hosts";
import PortMappings from "./port-mappings";
import Tunnels from "./tunnels";
import { ChipIcon } from "@heroicons/react/solid";
import CreateNewTunnel from "./create-new-tunnel";

export default function Main(props: any) {
  return (
    <main>
      <div className="2xl:container bg-gray-200 w-full">
        <div className="h-screen grid grid-cols-5 grid-flow-col gap-0">
          <SideNav />
          <div className="col-span-4">
            <div className="grid grid-rows-1 grid-flow-col h-6 bg-gray-500 sticky top-0">
              <div className="flex flex-row justify-center">
                <span className=" text-xs text-gray-200 font-semibold p-1">
                  0 Tunnels Running of 0 Configuations
                  <span className="ml-1 align-top">
                    <ChipIcon className=" text-red-400 h-4 w-4 inline mb-1" />
                  </span>
                </span>
              </div>
            </div>
            <div className="grid grid-rows-1 grid-flow-col">
              <Switch>
                <Route exact path="/" component={Hosts}></Route>
                <Route exact path="/hosts" component={Hosts}></Route>
                <Route
                  path="/tunnels/create"
                  component={CreateNewTunnel}
                ></Route>
                <Route path="/tunnels" component={Tunnels}></Route>
                <Route path="/ports" component={PortMappings}></Route>
                <Route path="/configuration" component={Configuration}></Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

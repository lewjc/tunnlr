import React from "react";
import { Route, Switch } from "react-router-dom";
import SideNav from "../components/sidenav";
import Configuration from "./configuration";
import Hosts from "./hosts";
import PortMappings from "./port-mappings";
import Tunnels from "./tunnels";

export default function Main(props: any) {
  return (
    <main>
      <div className="2xl:container bg-gray-200 w-full">
        <div className="h-screen grid grid-cols-5 grid-flow-col gap-0">
          <SideNav />
          <div className="col-span-4">
            <div className="grid grid-rows-1 grid-flow-col h-6 bg-gray-500">
              <Switch>
                <Route exact path="/" component={Hosts}></Route>
                <Route exact path="/hosts" component={Hosts}></Route>
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

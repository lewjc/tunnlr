import React from "react";
import { Route, Switch } from "react-router-dom";
import SideNav from "../../components/sidenav";
import Configuration from "../configuration/configuration";
import Hosts from "../hosts/hosts";
import PortMappings from "../port-mappings/port-mappings";
import Tunnels from "../tunnels/tunnels";
import { ChipIcon } from "@heroicons/react/solid";
import CreateNewTunnel from "../tunnels/create-new-tunnel";
import TunnelConsole from "../tunnel-console/tunnel-console";

export default function Main(props: any) {
	return (
		<main>
			<div className="bg-gray-200 w-full">
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
								<Route path="/tunnels/console" component={TunnelConsole}></Route>
								<Route exact path="/tunnels/create" component={CreateNewTunnel}></Route>
								<Route exact path="/tunnels" component={Tunnels}></Route>
								<Route exact path="/ports" component={PortMappings}></Route>
								<Route exact path="/configuration" component={Configuration}></Route>
							</Switch>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

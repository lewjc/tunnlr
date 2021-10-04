import { SupportIcon } from "@heroicons/react/solid";
import React from "react";
import { Tunnel } from "../../../global";
import IconButton from "../../components/icon-button";
import Pill from "../../components/pill";
import StartTunnelModal from "./start-tunnel-modal";

export interface TunnelCardProps {
	tunnel: Tunnel;
}

export default function TunnelCard({ tunnel }: TunnelCardProps) {
	return (
		<div className="w-1/3 flex p-3">
			<div className=" bg-gray-100 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal w-full">
				<div className="mb-8">
					<p className="text-sm text-gray-600 flex items-center">
						<SupportIcon className="h-3 w-3 inline text-gray-500 mr-1" />
						{`${tunnel.ports.length} ports configured`}
					</p>
					<div className="text-gray-900 font-bold text-xl mb-2">{tunnel.title}</div>
					<div>
						{tunnel.ports.map((port) => (
							<span className="m-1">
								<Pill className="my-1" colour="green" text={port.selectedLabel} />
							</span>
						))}
					</div>
					<div className="text-sm mt-2">
						{!!tunnel.defaultHost && (
							<p className="text-gray-500">Default host: {tunnel.defaultHost}</p>
						)}
					</div>
				</div>
				<div className="flex">
					<span className="pr-1 w-full">
						<StartTunnelModal disabled={tunnel.enabled} tunnel={tunnel} />
					</span>
					<span className="pl-1 w-full">
						<IconButton title="Stop" colour="red" disabled={!tunnel.enabled} />
					</span>
				</div>
			</div>
		</div>
	);
}

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import IconButton from "../../components/icon-button";
import { useAppSelector } from "../../state/hooks";
import BaseView from "../base-view";
import TunnelCard from "./tunnel-card";

export default function Tunnels() {
	const { tunnels } = useAppSelector((state) => state.tunnelConfig.tunnelConfig);
	console.log(tunnels);
	const tunnelCards = useMemo(
		() => tunnels.map((tunnel) => <TunnelCard tunnel={tunnel} />),
		[tunnels]
	);

	return (
		<BaseView title="Tunnel Configurations">
			<div className="mt-8 mb-4 flex flex-row">
				<div className="w-1/4">
					<Link to="/tunnels/create">
						<IconButton title="Create New" />
					</Link>
				</div>
				<div className="w-1/4 ml-1">
					<Link to="/tunnels/create">
						<IconButton title="Stop All" />
					</Link>
				</div>
			</div>
			<div className="w-full border-t-2 border-gray-300" />
			<div className="flex flex-row w-full flex-wrap">{...tunnelCards}</div>
		</BaseView>
	);
}

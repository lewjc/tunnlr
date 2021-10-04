import React, { MouseEventHandler, useMemo, useState } from "react";
import { Tunnel } from "../../../global";
import { useAppSelector } from "../../state/hooks";
import BaseView from "../base-view";

interface TunnelConsoleProps {
	activeTunnel?: Tunnel;
}

export default function TunnelConsole({ activeTunnel }: TunnelConsoleProps) {
	const activeTunnels = useAppSelector((state) => state.tunnelConfig.activeTunnels);
	const [activeTab, setActiveTab] = useState(activeTunnel?.id ?? "");

	const tabs = useMemo(() => {
		if (activeTunnels.length > 0) {
			const selectedId = activeTab || activeTunnels[0].tunnel.id;
			return activeTunnels.map((spawn) => (
				<li
					className={`bg-gray-100 px-4 border-gray-300 rounded text-xs font-semibold text-gray-600 uppercase tracking-wider py-2 mb-px cursor-pointer ${
						selectedId === spawn.tunnel.id ? "border-t border-l border-r border-b-0 -mb-px " : ""
					}`}
				>
					<div
						id={spawn.tunnel.id}
						onClick={(event: React.MouseEvent<HTMLDivElement>) =>
							setActiveTab(event.currentTarget.id)
						}
					>
						{spawn.tunnel.title}
					</div>
				</li>
			));
		} else {
			return [];
		}
	}, [activeTunnels, activeTab]);

	const tabList = (
		<ul id="tabs" className="inline-flex pt-2 px-1 w-full border-b border-gray-300">
			{...tabs}
		</ul>
	);

	const content = (
		<div className="bg-gray-100">
			<div id="first" className="p-4">
				First tab
			</div>
			<div id="second" className="hidden p-4">
				Second tab
			</div>
			<div id="third" className="hidden p-4">
				Third tab
			</div>
			<div id="fourth" className="hidden p-4">
				Fourth tab
			</div>
		</div>
	);

	return (
		<BaseView title="Tunnel Console">
			{activeTunnels.length ? (
				<div className="border-gray-300 w-full border rounded mx-auto mt-4 bg-gray-100">
					{tabList}
					{content}
				</div>
			) : (
				<h4>No active tunnels</h4>
			)}
		</BaseView>
	);
}

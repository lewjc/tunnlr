import React, { MouseEventHandler, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tunnel } from "../../../global";
import { useAppSelector } from "../../state/hooks";
import BaseView from "../base-view";
import TabContent from "./tab-content";

export default function TunnelConsole() {
	const location = useLocation<{
		activeId: string;
	}>();
	const activeTunnels = useAppSelector((state) => state.tunnelConfig.activeTunnels);
	const [activeTab, setActiveTab] = useState(location.state?.activeId ?? "");
	const activeTunnel = useMemo(
		() => activeTunnels.find((x) => x.tunnel.id === activeTab),
		[activeTunnels, activeTab]
	);

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
	console.log(activeTunnel);
	console.log(activeTab);
	return (
		<BaseView title="Tunnel Console">
			{activeTunnels.length ? (
				<div className="border-gray-300 w-full border rounded mx-auto mt-4 bg-gray-100">
					{tabList}
					{!!activeTunnel && <TabContent tunnel={activeTunnel} />}
				</div>
			) : (
				<h4>No active tunnels</h4>
			)}
		</BaseView>
	);
}

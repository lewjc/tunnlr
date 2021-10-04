import React from "react";
import { SpawnedTunnel } from "../../../global";

interface TabContentProps {
	tunnel: SpawnedTunnel;
}

export default function TabContent({ tunnel }: TabContentProps) {
	console.log(tunnel);
	const messages = tunnel.messages.map((message) => <p>{message.contents}</p>);
	console.log(messages);
	return (
		<div className="flex flex-col">
			<div>Info</div>
			<div>Messages: {...messages}</div>
		</div>
	);
}

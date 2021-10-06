import React from "react";
import { SpawnedTunnel } from "../../../global";
import "./tab-content.scss";

interface TabContentProps {
  tunnel: SpawnedTunnel;
}

export default function TabContent({ tunnel }: TabContentProps) {
  const messages = tunnel.messages.map((message) => (
    <p className="p-1">{message.contents}</p>
  ));
  return (
    <div className="flex flex-col">
      <div className="p-10">
        <h4 className="font-semibold uppercase text-green-500 tracking-wider ">
          Info
        </h4>
      </div>
      <div className="p-10 ">
        <h4 className="font-semibold uppercase text-green-500 mb-4">
          Messages
        </h4>
        <code className="text-xs">
          <div className="bg-gray-800 text-gray-200 messages-height">
            {...messages.length ? messages : [<p className="p-1">...</p>]}
          </div>
        </code>
      </div>
    </div>
  );
}

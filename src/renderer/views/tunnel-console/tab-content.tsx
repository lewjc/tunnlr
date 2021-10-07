import React, { useMemo } from "react";
import { SpawnedTunnel } from "../../../global";
import PortSwitch from "./port-switch";
import "./tab-content.scss";

interface TabContentProps {
  tunnel: SpawnedTunnel;
}

export default function TabContent({ tunnel }: TabContentProps) {
  const messages = tunnel.messages.map((message) => (
    <p className="p-2">{message.contents}</p>
  ));
  const portSwitches = useMemo(
    () =>
      tunnel.tunnel.ports.map((port) => (
        <div className="w-1/5">
          <PortSwitch
            label={`${port.selectedLabel.toUpperCase()}`}
            isInitiallySelected={true}
            onChange={(evt) => {
              if (evt.target.checked) {
                console.log("Turn Port On");
              } else {
                console.log("Turn Port Off");
              }
            }}
          />
        </div>
      )),
    [tunnel]
  );
  return (
    <div className="flex flex-col">
      <div>
        <h4 className="pt-4 pb-2 pl-4 font-semibold text-gray-500 tracking-wider ">
          Current Host: {tunnel.config.host.domain}
        </h4>
        <div className="flex flex-col">
          <div>
            <h4 className="pt-6 pl-4 font-semibold uppercase text-green-500 mb-1">
              Ports
            </h4>
          </div>
          <div className="flex flex-row flex-wrap mt-3 p-5">
            {...portSwitches}
          </div>
        </div>
      </div>
      <div>
        <h4 className="pt-6 pl-4 font-semibold uppercase text-green-500 mb-1">
          Messages
        </h4>
        <div className="drop-shadow-xl shadow-xl p-4 bg-gray-100">
          <code className="text-xs ">
            <div className="bg-gray-800 text-gray-200 messages-height">
              {...messages.length ? messages : [<p className="p-2">...</p>]}
            </div>
          </code>
        </div>
      </div>
    </div>
  );
}

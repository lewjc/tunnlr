import React, { useMemo } from "react";
import { SpawnedTunnel } from "../../../global";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { killPort } from "../../state/slices/tunnels";
import PortSwitch from "./port-switch";
import "./tab-content.scss";

interface TabContentProps {
  tunnel: SpawnedTunnel;
}

export default function TabContent({ tunnel }: TabContentProps) {
  const dispatch = useAppDispatch();
  const { share } = useAppSelector((state) => state.global);
  const messages = tunnel.messages.map((message) => (
    <p className={`p-2 ${message.isError && "text-red-400"}`}>
      {message.contents}
    </p>
  ));

  const portSwitches = useMemo(
    () =>
      tunnel.tunnel.ports.map((port, idx) => (
        <div className={`w-1/5 ${idx > 4 ? "mt-3" : ""}`}>
          <PortSwitch
            label={`${port.selectedLabel.toUpperCase()}`}
            isInitiallySelected={port.running}
            disabled={!tunnel.config.splitPorts}
            onChange={(evt) => {
              if (evt.target.checked) {
                console.log("Turn Port On");
              } else {
                killPort(dispatch, share, tunnel.tunnel, port);
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
        <div className="flex flex-row">
          <h4 className="pt-4 pb-2 pl-4 font-semibold text-gray-500 tracking-wider ">
            Current Host: {tunnel.config.host.domain}
          </h4>
          <h4
            className="pt-4 pb-2 pl-4 font-semibold text-gray-500 tracking-wider"
            title="Allows ports to be turned off and on"
          >
            Port Splitting: {!!tunnel.config.splitPorts ? "Yes" : "No"}
          </h4>
        </div>
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

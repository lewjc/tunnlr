import React, { useMemo } from "react";
import {
  CogIcon,
  CollectionIcon,
  ChipIcon,
  SupportIcon,
  TerminalIcon,
  BeakerIcon
} from "@heroicons/react/solid";
import IconButton from "./icon-button";
import { version } from "../../../package.json";
import { Link } from "react-router-dom";

export default function SideNav() {
  const options = useMemo(
    () => [
      {
        title: "Hosts",
        icon: <CollectionIcon className="h-6 w-6 inline" />,
        route: "/hosts",
      },
      {
        title: "Port Mappings",
        icon: <SupportIcon className="h-6 w-6 inline" />,
        route: "/ports",
      },
      {
        title: "Scripts",
        icon: <BeakerIcon className="h-6 w-6 inline" />,
        route: "/scripts",
      },
      {
        title: "Tunnel Configurations",
        icon: <ChipIcon className="h-6 w-6 inline" />,
        route: "/tunnels",
      },
      {
        title: "Tunnel Console",
        icon: <TerminalIcon className="h-6 w-6 inline" />,
        route: "/tunnels/console",
      },
      {
        title: "System",
        icon: <CogIcon className="h-6 w-6 inline" />,
        route: "/configuration",
      },
    ],
    []
  );

  return (
    <div className="col-span-1 bg-gray-500 shadow-md max-w-xl">
      <div className="h-24 grid grid-rows-1 grid-flow-col bg-green-500">
        <span className="p-4 text-gray-200">
          <div className="text-3xl font-bold">
            <div className="flex flex-row">
              Tunnlr
              <span>
                <svg
                  className="fill-current text-gray-200 align-middle h-10 w-10 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="text-xs pt-1 font-extralight">Version: {version}</div>
        </span>
      </div>
      <div className="h-36 flex flex-col">
        {options.map((option) => (
          <Link key={option.route} to={option.route}>
            <IconButton title={option.title} icon={option.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
}

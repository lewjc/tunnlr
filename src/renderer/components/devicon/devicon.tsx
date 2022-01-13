import React from "react";
import { IconProps } from ".";
import NodeIcon from "./node";
import PythonIcon from "./python";
import ShellIcon from "./shell";

interface DeviconProps extends IconProps {
  type: "py" | "node" | "sh";
}

export default function Devicon({
  height,
  width,
  type,
  className,
}: DeviconProps) {
  switch (type) {
    case "py":
      return <PythonIcon className={className} width={width} height={height} />;
    case "sh":
      return <ShellIcon className={className} width={width} height={height} />;
    case "node":
      return <NodeIcon className={className} width={width} height={height} />;
    default:
      return <></>;
  }
}

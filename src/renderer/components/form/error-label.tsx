import React from "react";

export interface ErrorLabelProps {
  show: boolean;
  text: string;
}

export default function ErrorLabel(props: ErrorLabelProps) {
  return props.show ? (
    <span className=" text-red-400 text-sm font-normal">{props.text}</span>
  ) : null;
}

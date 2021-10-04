import React from "react";

export interface PillProps {
  colour: "green" | "gray";
  text: string;
  className?: string;
}

export default function Pill(props: PillProps) {
  return (
    <span
      className={
        `relative inline-block px-3 py-1 font-semibold text-${props.colour}-900 leading-tight ` +
        props.className
      }
    >
      <span
        aria-hidden
        className={`absolute inset-0 bg-${props.colour}-200 opacity-50 rounded-full`}
      ></span>
      <span className="relative">{props.text}</span>
    </span>
  );
}

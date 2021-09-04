import { string } from "prop-types";
import React, { Component, ReactElement } from "react";

interface IconButtonProps {
  title: string;
  icon: ReactElement;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <button className="bg-gray-500 hover:bg-gray-400 font-bold text-gray-200 py-2 px-4 w-full text-left text-xs">
      <span>
        {props.icon}
        <span className="align-middle ml-3">{props.title}</span>
      </span>
    </button>
  );
}

import React, { ReactElement } from "react";

interface IconButtonProps {
  title: string;
  icon?: ReactElement;
  colour?: "green" | "gray" | "red";
  onClick?: any;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  form?: string;
}

export default function IconButton(props: IconButtonProps) {
  const colour = props.colour || "gray";
  const type = props.type || "button";

  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={type}
      form={props.form}
      className={`${
        props.className
      } bg-${colour}-500 hover:bg-${colour}-400 font-bold text-gray-${
        colour === "gray" ? "200" : "100"
      } py-2 px-4 w-full text-left text-xs disabled:opacity-50 disabled:pointer-events-none`}
    >
      <span>
        {props.icon}
        <span className={`align-middle ${props.icon && "ml-3"}`}>
          {props.title}
        </span>
      </span>
    </button>
  );
}

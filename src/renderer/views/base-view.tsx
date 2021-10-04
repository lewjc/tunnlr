import React from "react";

export interface BaseViewProps {
  title: string;
  children?: React.ReactNode;
}

export default function BaseView(props: BaseViewProps) {
  return (
    <div className="px-8 pt-2 overflow-auto">
      <div>
        <h2 className="text-2xl text-green-500 mt-8 font-bold">
          {props.title}
        </h2>
      </div>
      {props.children}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { Script } from "../../../global";
import Devicon from "../../components/devicon";
import IconButton from "../../components/icon-button";
import { useAppSelector } from "../../state/hooks";
import BaseView from "../base-view";

const renderScriptIcon = (scriptType: "py" | "node" | "sh") => (
  <Devicon
    type={scriptType}
    width={60}
    height={60}
    className="text-black fill-current m-auto"
  />
);

export default function Scripts() {
  const { scriptList } = useAppSelector((state) => state.scripts.scriptsConfig);

  const renderRow = (script: Script) => {
    return (
      <div className="flex flex-row w-full min-h-16 bg-gray-300 border-gray-400 rounded-md mt-4 border-2 p-1 break-words ">
        <div className="w-1/5 p-1 self-center justify-center">
          {renderScriptIcon(script.fileType)}
        </div>
        <div className="flex flex-col w-2/5">
          <h2 className="p-1 font-bold uppercase text-green-500">
            {script.displayName}
          </h2>
          <h4 className="p-1 font-light">{script.description}</h4>
        </div>
        <div className="w-2/5 self-center font-extralight text-sm">
          <span>{script.fileName}</span>
        </div>
      </div>
    );
  };

  return (
    <BaseView title="Scripts">
      <div className="mt-8 mb-4 flex flex-row">
        <div className="w-1/4">
          <Link to="/scripts/add">
            <IconButton title="Add New Script" />
          </Link>
        </div>
      </div>
      <div className="w-full border-t-2 border-gray-300" />
      <div className="flex flex-col justify-around content-around mt-4">
        {scriptList.map((script) => renderRow(script))}
      </div>
    </BaseView>
  );
}

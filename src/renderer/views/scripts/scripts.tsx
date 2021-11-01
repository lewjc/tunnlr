import React from "react";
import { Link } from "react-router-dom";
import { Script } from "../../../global";
import IconButton from "../../components/icon-button";
import { useAppSelector } from "../../state/hooks";
import BaseView from "../base-view";
import DevIcon from "devicon-react-svg";

export default function Scripts() {
  const { scriptList } = useAppSelector((state) => state.scripts.scriptsConfig);
  console.log(scriptList);
  const renderRow = (script: Script) => {
    return (
      <div className="flex flex-row w-4/5 h-16 bg-gray-300">
        <div className="w-1/5 p-1 self-center justify-center">
          <DevIcon
            icon="python"
            className="w-`0 h-10 text-black fill-current m-auto"
          />
        </div>
        <div className="flex flex-col w-2/5">
          <h2 className="p-1 font-semibold uppercase">{script.displayName}</h2>
          <h4 className="p-1">{script.description}</h4>
        </div>
        <div className="w-2/5">
          <h4>{script.fileName}</h4>
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
      <div className="flex flex-row justify-around mt-4">
        {scriptList.map((script) => renderRow(script))}
      </div>
    </BaseView>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import IconButton from "../components/icon-button";
import BaseView from "./base-view";

export default function Tunnels() {
  return (
    <BaseView title="Tunnel Configurations">
      <div className="mt-8 mb-4 flex flex-row">
        <div className="w-1/4">
          <Link to="/tunnels/create">
            <IconButton title="Create New" />
          </Link>
        </div>
      </div>
      <div className="w-full border-t-2 border-gray-300"></div>
    </BaseView>
  );
}

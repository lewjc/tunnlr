import React from "react";

import "./loading.scss";

export default function Loading() {
  return (
    <div className="h-screen justify-center flex flex-col w-full bg-green-500 text-gray-100 text-center text-5xl font-bold">
      Tunnlr
      <div className="flex flex-row justify-center mt-8">
        <div>
          <div className="w-16 h-16 border-4 border-gray-100 border-dashed rounded-full animate-spin load"></div>
        </div>
      </div>
    </div>
  );
}

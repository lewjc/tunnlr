import React, { ChangeEventHandler, useState } from "react";

interface PortSwitchProps {
  disabled?: boolean;
  isInitiallySelected?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  label: string;
}

export default function PortSwitch({
  disabled,
  isInitiallySelected,
  onChange,
  label,
}: PortSwitchProps) {
  const [isChecked, setIsChecked] = useState(isInitiallySelected ?? false);
  return (
    <>
      <div
        className={
          "relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in "
        }
      >
        <input
          type="checkbox"
          disabled={disabled ?? false}
          name={`${label}-toggle`}
          id={`${label}-toggle`}
          defaultChecked={isInitiallySelected ?? false}
          onChange={(evt) => {
            setIsChecked(evt.target.checked);
            onChange(evt);
          }}
          className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer ${
            isChecked ? "border-green-400 right-0 bg-green-600" : ""
          }`}
        />
        <label
          htmlFor={`${label}-toggle`}
          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
            isChecked ? "bg-green-400" : "bg-gray-300"
          }`}
        ></label>
      </div>
      <label
        htmlFor={`${label}-toggle`}
        className="text-gray-700 uppercase text-sm tracking-wider"
      >
        {label}
      </label>
    </>
  );
}

import React, { ChangeEventHandler, ReactEventHandler } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface SelectProps {
  items: Array<SelectItem>;
  formRegistration?: UseFormRegisterReturn;
  className: string;
  defaultNoSelectMessage?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onSelect?: ReactEventHandler<HTMLSelectElement>;
  selectedOption?: string | null;
}

export interface SelectItem {
  key: number;
  value: string;
}

export default function Select(props: SelectProps) {
  return (
    <select
      className={`w-full ${props.className}`}
      onSelect={props.onSelect}
      {...props.formRegistration}
      onChange={props.onChange}
    >
      {props.defaultNoSelectMessage && (
        <option disabled selected>
          {props.defaultNoSelectMessage}
        </option>
      )}
      {props.items.map((x) => (
        <option
          key={x.key}
          value={x.value}
          selected={x.value === props.selectedOption}
        >
          {x.value}
        </option>
      ))}{" "}
    </select>
  );
}

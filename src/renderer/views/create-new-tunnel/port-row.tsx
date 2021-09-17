import React, { useMemo, useState } from "react";
import FormLabel from "../../components/form/label";
import Select, { SelectItem } from "../../components/form/select";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { PortMapping } from "../../../global";
import { MinusCircleIcon } from "@heroicons/react/solid";
import ErrorLabel from "../../components/form/error-label";

export interface PortLabelMap {
  [key: string]: Array<string>;
}

export interface PortRowProps {
  register: UseFormRegister<FieldValues>;
  onPortSelect: (port: string, previousPort: string) => void;
  availablePorts: Array<PortMapping>;
  index: number;
  portLabelMappings: PortLabelMap;
  selectedPorts: Array<string>;
  onRemoveRow: (index: number, selectedPort: string) => void;
  errors: {
    [key: string]: any;
  };
}

export default function PortRow(props: PortRowProps) {
  const [selectedPort, setSelectedPort] = useState<string>("");
  console.log(props.errors);
  const availablePortSelections: Array<SelectItem> = [
    ...props.availablePorts.map((availablePort) => ({
      key: availablePort.port,
      value: "" + availablePort.port,
    })),
    !!selectedPort
      ? {
          key: Number(selectedPort),
          value: selectedPort,
        }
      : null,
  ]
    .filter((x) => x !== null)
    .sort((a, b) => {
      const portA = Number(a);
      const portB = Number(b);

      if (portA === portB) {
        return 0;
      } else {
        return portA >= portB ? -1 : 1;
      }
    });

  return (
    <div className="flex flex-row m-2 items-center">
      <MinusCircleIcon
        className="mr-5 text-red-400 cursor-pointer"
        height={20}
        width={20}
        onClick={() => props.onRemoveRow(props.index, selectedPort)}
      />
      <div className="w-1/3">
        <FormLabel label="Port Mapping" required>
          <Select
            defaultNoSelectMessage="-- Select a Port --"
            className="h-8"
            selectedOption={selectedPort || null}
            onChange={(evt) => {
              props.onPortSelect(evt.target.value, selectedPort);
              setSelectedPort(evt.target.value);
            }}
            items={availablePortSelections}
            formRegistration={props.register("Port" + props.index, {
              required: true,
              validate: {
                notDefault: (x) => x !== "-- Select a Port --",
              },
            })}
          ></Select>
          <ErrorLabel
            show={
              props.errors &&
              props.errors["Port" + props.index]?.type === "notDefault"
            }
            text="Port must be selected"
          />
        </FormLabel>
      </div>
      {!!selectedPort && (
        <div className="ml-5 self-start">
          <FormLabel label="Label">
            <Select
              defaultNoSelectMessage="-- Select a Label --"
              className="h-8"
              items={props.portLabelMappings[selectedPort].map((x: any) => ({
                key: x,
                value: x,
              }))}
              formRegistration={props.register("PortLabel" + props.index, {
                required: true,
              })}
            ></Select>
          </FormLabel>
        </div>
      )}
    </div>
  );
}

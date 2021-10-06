import React, { useMemo, useState } from "react";
import FormLabel from "../../../components/form/label";
import Select, { SelectItem } from "../../../components/form/select";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { PortMapping } from "../../../../global";
import { MinusCircleIcon, ArrowSmRightIcon } from "@heroicons/react/solid";
import ErrorLabel from "../../../components/form/error-label";
import * as _ from "lodash";

export interface PortLabelMap {
  [key: string]: number;
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
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const availablePortSelections: Array<SelectItem<string>> = _.flatten(
    [
      ...props.availablePorts.map((availablePort) =>
        availablePort.labels.map((label) => ({
          key: label,
          value: `${props.portLabelMappings[label]};${label}`,
        }))
      ),
    ].filter(Boolean)
  );

  if (selectedPort) {
    availablePortSelections.push({
      key: selectedLabel,
      value: `${selectedPort};${selectedLabel}`,
    });
  }

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
            defaultNoSelectMessage="-- Select a Mapping --"
            className="h-9 text-xs"
            selectedOption={selectedPort || null}
            onChange={(evt) => {
              console.log("Chaning selectio");
              const [port, label] = evt.target.value.split(";");
              props.onPortSelect(port, selectedPort);
              setSelectedPort(port);
              setSelectedLabel(label);
            }}
            items={availablePortSelections}
            formRegistration={props.register("Port" + props.index, {
              required: true,
              validate: {
                notDefault: (x) => x !== "-- Select a Mapping --",
              },
            })}
          ></Select>
          <ErrorLabel
            show={
              props.errors &&
              props.errors["Port" + props.index]?.type === "notDefault"
            }
            text="Label must be selected"
          />
        </FormLabel>
      </div>
      {!!selectedPort && (
        <div className="ml-3 mb-1 self-end">
          <div className="flex flex-row">
            <span>
              <ArrowSmRightIcon className="w-8 h-8 pl-1 text-green-400" />
            </span>
            <span className="ml-4 self-center text-gray-400 font-semibold">
              Port: {selectedPort}{" "}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

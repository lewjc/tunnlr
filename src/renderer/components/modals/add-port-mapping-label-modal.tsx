import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/solid";
import IconButton from "../icon-button";
import {
  addLabelsToPortMapping,
  createPortMapping,
} from "../../state/slices/portMappings";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import Pill from "../pill";
import ModalBase from "./modal-base";
import { PortMapping } from "../../../global";
import Textbox from "../textbox";

export interface AddPortMappingLabelModalProps {
  mapping: PortMapping;
}

export default function AddPortMappingLabelModal(
  props: AddPortMappingLabelModalProps
) {
  const [labels, addLabel] = useState<Array<string>>([]);
  const [currentLabel, setCurrentLabel] = useState("");
  const { share } = useAppSelector((state) => state.global);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const clearModal = () => {
    addLabel([]);
    setCurrentLabel("");
    setOpen(false);
  };

  return (
    <ModalBase
      titleText="Add Label to Port"
      openModalButton={
        <IconButton title="Add Label to Port" onClick={() => setOpen(true)} />
      }
      open={open}
      actions={[
        <IconButton
          title="Submit"
          disabled={labels.length === 0}
          className="mx-2"
          colour="green"
          onClick={() => {
            // Add labels to selected port
            addLabelsToPortMapping(
              dispatch,
              share,
              Number(props.mapping.port),
              labels
            );
            clearModal();
          }}
        />,
        <IconButton
          title="Cancel"
          colour="gray"
          className="mx-2"
          onClick={() => {
            clearModal();
          }}
        />,
      ]}
      onClose={() => {
        clearModal();
      }}
      body={
        <div className="w-full">
          <div className="flex flex-row justify-between items-center ">
            <Textbox
              value={currentLabel}
              onChange={(evt) => {
                setCurrentLabel(evt.target.value);
              }}
              onKeyPress={(evt) => {
                if (evt.key === "Enter") {
                  addLabel([...labels, currentLabel]);
                  setCurrentLabel("");
                }
              }}
              className=" w-1/2 appearance-none rounded-r rounded-l border border-gray-400 border-b block pl-8 pr-6 py-2 bg-white text-sm placeholder-gray-200 text-gray-700 focus:bg-white focus:placeholder-gray-300 focus:text-gray-700 focus:outline-none"
            />

            <h4 className="ml-4 text-xs text-gray-400 align-middle">
              Press Enter to confirm label
            </h4>
          </div>
          <div className="mt-2 flex flex-row w-full flex-wrap">
            {labels.map((label) => (
              <span className="m-1">
                <Pill className="my-1" colour="gray" text={label} />
              </span>
            ))}
          </div>
        </div>
      }
      titleIcon={
        <PencilIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
      }
    />
  );
}

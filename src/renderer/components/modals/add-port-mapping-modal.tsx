import React, { ChangeEvent, useState } from "react";
import { SupportIcon } from "@heroicons/react/solid";
import IconButton from "../icon-button";
import { createPortMapping } from "../../state/slices/portMappings";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import ModalBase from "./modal-base";
import Textbox from "../textbox";

export interface AddPortMappingModalProps {}

export default function AddPortMappingModal(props: AddPortMappingModalProps) {
  const [open, setOpen] = useState(false);
  const [portValue, setPortValue] = useState("");
  const { share } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  return (
    <ModalBase
      openModalButton={
        <IconButton
          title="Configure New Port"
          colour="green"
          onClick={() => {
            setOpen(true);
          }}
        />
      }
      titleText="Add Label to Port"
      open={open}
      actions={[
        <IconButton
          title="Submit"
          className="mx-2"
          colour="green"
          onClick={() => {
            setOpen(false);
            createPortMapping(dispatch, share, {
              port: Number(portValue),
              labels: [],
            });
            setOpen(false);
          }}
        />,

        <IconButton
          title="Cancel"
          colour="gray"
          className="mx-2"
          onClick={() => {
            setOpen(false);
          }}
        />,
      ]}
      body={
        <div className="block relative">
          <Textbox
            placeholder="0 - 65535"
            onChange={(evt) => setPortValue(evt.currentTarget.value)}
            maxLength={5}
            className="appearance-none rounded-r rounded-l border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-200 text-gray-700 focus:bg-white focus:placeholder-gray-300 focus:text-gray-700 focus:outline-none"
          />
        </div>
      }
      titleIcon={
        <SupportIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
      }
    />
  );
}

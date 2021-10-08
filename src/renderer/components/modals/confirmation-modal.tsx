import React, { ChangeEvent, useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import IconButton from "../icon-button";
import ModalBase from "./modal-base";
import Textbox from "../form/textbox";

interface ConfirmationModalProps {
  openButtonLabel: string;
  openButtonColour: "green" | "gray" | "red";
  title: string;
  openButtonDisabled?: boolean;
  onYes: () => void;
  onNo: () => void;
}

export default function ConfirmationModal({
  openButtonLabel,
  openButtonColour,
  openButtonDisabled,
  title,
  onYes,
  onNo,
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <ModalBase
      openModalButton={
        <IconButton
          title={openButtonLabel}
          colour={openButtonColour}
          disabled={openButtonDisabled}
          onClick={() => {
            setOpen(true);
          }}
        />
      }
      titleText={title}
      open={open}
      actions={[
        <IconButton
          title="Yes"
          className="mx-2"
          colour="green"
          onClick={() => {
            setOpen(false);
            onYes();
          }}
        />,

        <IconButton
          title="Cancel"
          colour="gray"
          className="mx-2"
          onClick={() => {
            setOpen(false);
            onNo();
          }}
        />,
      ]}
      body={<></>}
      titleIcon={
        <QuestionMarkCircleIcon
          className="h-6 w-6 text-gray-500"
          aria-hidden="true"
        />
      }
    />
  );
}

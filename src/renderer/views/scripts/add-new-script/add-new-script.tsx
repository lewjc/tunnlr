import React, { useRef, useState } from "react";
import IconButton from "../../../components/icon-button";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import Textbox from "../../../components/form/textbox";
import FormLabel from "../../../components/form/label";
import { get } from "lodash";
import BaseView from "../../base-view";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorLabel from "../../../components/form/error-label";
import { createScript } from "../../../state/slices/scripts";
import { Script } from "../../../../global";
import { extname } from "path";

export default function AddNewScript() {
  const { share } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const [filePath, setFilePath] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileType = (filePath: string) => {
    switch (extname(filePath)) {
      case ".py":
        return "py";
      case ".js":
        return "node";
      case ".sh":
        return "sh";
      default:
        return null;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    if (!!filePath) {
      const fileType = getFileType(filePath);
      if (fileType) {
        const script: Script = {
          fileName: filePath,
          displayName: data["name"],
          description: data["description"],
          fileType,
        };
        createScript(dispatch, share, script);
      } else {
        // Invalid file type selected
        console.error(`Invalid file type selected: ${fileType}`);
      }
    } else {
      // No file path
      console.error(`Invalid File Path ${filePath}`);
    }
  };

  return (
    <BaseView title="Add New Script">
      <div className="w-full mt-6">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(evt) => {
            setFilePath(get(inputRef.current, "files[0].path", ""));
          }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row m-2 justify-start space-x-1 align-middle items-center">
            <div className="w-1/5 mr-4">
              <IconButton
                title="File explorer"
                colour="gray"
                className="mx-2 mt-0.5"
                onClick={() => {
                  setFilePath("");
                  inputRef.current?.click();
                }}
              />
            </div>
            <div className="w-3/5 pb-2">
              <FormLabel label="Absolute Path to Script">
                <Textbox
                  value={filePath}
                  {...register("file", {
                    validate: { filePathSet: () => !!filePath },
                  })}
                  onChange={(evt) => setFilePath(evt.target.value)}
                />
                <ErrorLabel
                  show={errors.file?.type === "filePathSet"}
                  text="Absolute file path required"
                />
              </FormLabel>
            </div>
          </div>
          <div className="flex flex-row m-4 w-full justify-between">
            <div className="flex w-1/5">
              <FormLabel label="Script Name">
                <Textbox
                  formRegistration={register("name", { required: true })}
                />
                <ErrorLabel
                  show={errors.name?.type === "required"}
                  text="Name is required"
                />
              </FormLabel>
            </div>
            <div className="flex w-3/4">
              <FormLabel label="Description">
                <Textbox
                  formRegistration={register("description", { required: true })}
                />
                <ErrorLabel
                  show={errors.description?.type === "required"}
                  text="Description is required"
                />
              </FormLabel>
            </div>
          </div>
          <div className="w-full border-t-2 border-gray-300" />
          <div className="flex flex-row mt-3">
            <div className="w-1/3 mr-3">
              <Link to="/scripts">
                <IconButton title="Back" type="button" colour="gray" />
              </Link>
            </div>
            <div className="w-1/3">
              <IconButton title="Create" type="submit" colour="green" />
            </div>
          </div>
        </form>
      </div>
    </BaseView>
  );
}

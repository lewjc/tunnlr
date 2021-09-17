import React, { useMemo, useState } from "react";
import BaseView from "../base-view";
import { useForm } from "react-hook-form";
import Textbox from "../../components/textbox";
import FormLabel from "../../components/form/label";
import Select from "../../components/form/select";
import IconButton from "../../components/icon-button";
import { useAppSelector } from "../../state/hooks";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import PortRow from "./port-row";
import ErrorLabel from "../../components/form/error-label";

export default function CreateNewTunnel() {
  const { hosts } = useAppSelector((x) => x.host);
  const { mappings } = useAppSelector(
    (state) => state.portMappings.portMappings
  );
  const [rowObjs, setRowObjs] = useState<Array<any>>([]);
  const [rowIdCounter, setRowIdCounter] = useState(0);
  const [selectedPorts, setSelectedPorts] = useState<Array<string>>([]);

  const {
    register,
    handleSubmit,
    watch,
    unregister,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => console.log(data);

  const cumulativeHosts = useMemo(
    () => [...hosts.system, ...hosts.user],
    [hosts]
  );

  const availableMappings = useMemo(
    () => mappings.filter((x) => !selectedPorts.includes("" + x.port)),
    [mappings, selectedPorts]
  );

  const availableLabels: any = useMemo(
    () =>
      mappings.reduce((prev, curr) => {
        const newLabelMap: any = {};
        newLabelMap[`${curr.port}`] = curr.labels;
        return { ...prev, ...newLabelMap };
      }, {}),
    [mappings]
  );

  return (
    <BaseView title="Create New Tunnel Configuation">
      <div className="mt-8 mb-4 flex flex-row">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="">
            <div className="">
              <div className="flex flex-row items-start">
                <div className="w-1/3 mr-3">
                  <FormLabel label="Name" required>
                    <Textbox
                      placeholder="My Super Config..."
                      formRegistration={register("Name", { required: true })}
                    />
                    <ErrorLabel
                      show={errors.Name?.type === "required"}
                      text="Name is required"
                    />
                  </FormLabel>
                </div>
                <div className="w-1/3">
                  <FormLabel label="Host" required>
                    <Select
                      defaultNoSelectMessage="-- Select a Host --"
                      className="h-9"
                      items={cumulativeHosts.map((x) => ({
                        key: x.id,
                        value: x.domain,
                      }))}
                      formRegistration={register("Hosts", {
                        required: true,
                        validate: {
                          notDefault: (x) => x !== "-- Select a Host --",
                        },
                      })}
                    ></Select>
                    <ErrorLabel
                      show={errors.Hosts?.type === "notDefault"}
                      text="You must select a host"
                    />
                  </FormLabel>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-row text-xl text-gray-500 font-semibold items-center">
                <h5>Ports to Tunnel</h5>
                <PlusCircleIcon
                  className="text-green-500 cursor-pointer ml-2"
                  width="20"
                  height="20"
                  onClick={() => {
                    setRowObjs([
                      ...rowObjs,
                      {
                        index: rowIdCounter,
                      },
                    ]);
                    setRowIdCounter(rowIdCounter + 1);
                  }}
                />
              </div>
              {rowObjs.map((row) => (
                <PortRow
                  index={row.index}
                  register={register}
                  errors={errors}
                  availablePorts={availableMappings}
                  portLabelMappings={availableLabels}
                  selectedPorts={selectedPorts}
                  onRemoveRow={(index, previousPort) => {
                    setSelectedPorts([
                      ...selectedPorts.filter((x) => x !== previousPort),
                    ]);
                    setRowObjs([...rowObjs.filter((x) => x.index !== index)]);
                    unregister("Port" + index);
                    unregister("PortLabel" + index);
                  }}
                  onPortSelect={(port, previousPort) =>
                    setSelectedPorts([
                      ...selectedPorts.filter((x) => x !== previousPort),
                      port,
                    ])
                  }
                />
              ))}
            </div>
            <div className="row-span-1 mt-4">
              <div className="flex flex-row">
                <div className="w-full border-t-2 border-gray-300"></div>
              </div>
              <div className="flex flex-row mt-3">
                <div className="w-1/3 mr-3">
                  <Link to="/tunnels">
                    <IconButton title="Back" type="button" colour="gray" />
                  </Link>
                </div>
                <div className="w-1/3">
                  <IconButton title="Create" type="submit" colour="green" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </BaseView>
  );
}

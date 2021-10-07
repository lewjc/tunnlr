import React, { ChangeEvent, useMemo, useState } from "react";
import { SupportIcon } from "@heroicons/react/solid";
import { createPortMapping } from "../../state/slices/portMappings";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import ModalBase from "../../components/modals/modal-base";
import IconButton from "../../components/icon-button";
import Textbox from "../../components/form/textbox";
import { Tunnel, StartTunnelConfig } from "../../../global";
import { useForm } from "react-hook-form";
import Select from "../../components/form/select";
import FormLabel from "../../components/form/label";
import Checkbox from "../../components/form/checkbox";
import { clearFlags, startTunnel } from "../../state/slices/tunnels";
import { useHistory } from "react-router";

export interface StartTunnelModalProps {
  tunnel: Tunnel;
  disabled: boolean;
}

export default function StartTunnelModal({
  tunnel,
  disabled,
}: StartTunnelModalProps) {
  const [open, setOpen] = useState(false);
  const { hosts } = useAppSelector((x) => x.host);
  const { share } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const cumulativeHosts = useMemo(
    () => [...hosts.system, ...hosts.user],
    [hosts]
  );
  const { register, handleSubmit } = useForm();
  const history = useHistory();

  const onSubmit = (data: any) => {
    console.log("Starting tunnel");
    const selectedHost = data["Hosts"];
    const host = hosts.system.find((host) => host.domain === selectedHost);
    if (host) {
      const splitPorts = data["splitPorts"];
      const startTunnelConfig: StartTunnelConfig = {
        splitPorts,
        host,
      };
      startTunnel(dispatch, share, tunnel, startTunnelConfig).then(() => {
        history.push({
          pathname: "/tunnels/console",
          state: { activeId: tunnel.id },
        });
      });
    }
  };

  return (
    <ModalBase
      openModalButton={
        <IconButton
          title="Start"
          colour="green"
          disabled={disabled}
          onClick={() => {
            setOpen(true);
          }}
        />
      }
      titleText="Start Tunnel"
      open={open}
      actions={[
        <IconButton
          title="Start"
          className="mx-2"
          colour="green"
          form="start-tunnel-form"
          type="submit"
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
          <div className="flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} id="start-tunnel-form">
              <div>
                <FormLabel label="Host">
                  <Select
                    selectedOption={tunnel.defaultHost}
                    defaultNoSelectMessage="-- Select a Host --"
                    className="h-9"
                    items={cumulativeHosts.map((x) => ({
                      key: x.domain,
                      value: x.domain,
                    }))}
                    formRegistration={register("Hosts")}
                  ></Select>
                </FormLabel>
              </div>
              <div>
                <Checkbox
                  label={"Open Tunnel Console"}
                  formRegistration={register("openTunnelConsole")}
                />
                <Checkbox
                  className="ml-3"
                  label={"Port Splitting"}
                  formRegistration={register("splitPorts")}
                />
              </div>
            </form>
          </div>
        </div>
      }
      titleIcon={
        <SupportIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
      }
    />
  );
}

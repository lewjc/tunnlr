import React from "react";
import HostsTable from "../../components/hosts-table";
import BaseView from "../base-view";

interface HostsProps {}

export default function Hosts(props: HostsProps) {
	return (
		<BaseView title={"Hosts"}>
			<HostsTable />
		</BaseView>
	);
}

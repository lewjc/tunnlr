import { Address } from "cluster";
import React, { useMemo, useState } from "react";
import { PortMapping } from "../../../global";
import IconButton from "../../components/icon-button";
import AddPortMappingLabelModal from "../../components/modals/add-port-mapping-label-modal";
import AddPortMappingModal from "../../components/modals/add-port-mapping-modal";
import Pill from "../../components/pill";
import { useAppSelector } from "../../state/hooks";
import BaseView from "../base-view";

const noLabelsAvailable = (
	<span className="text-sm font-bold text-gray-400">No Labels Created</span>
);

interface EnrichedPortMappings {
	[key: string]: PortMapping;
}

export default function PortMappings() {
	const { mappings } = useAppSelector((state) => state.portMappings.portMappings);

	const enrichedPortMappings = useMemo(() => {
		const mappingsAsKeys: EnrichedPortMappings = mappings.reduce(
			(obj, item) => ({ ...obj, [`${item.port}`]: item }),
			{}
		);
		return mappingsAsKeys;
	}, [mappings]);

	const renderRow = useMemo(
		() => (mapping: PortMapping) => {
			const labels = mapping.labels.map((label) => (
				<span className="m-1">
					<Pill className="my-1" colour="gray" text={label} />
				</span>
			));
			return (
				<dl>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-lg font-bold text-gray-500 text-center">{mapping.port}</dt>
						<dt className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
							{labels.length ? labels : noLabelsAvailable}
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
							<AddPortMappingLabelModal mapping={mapping} />
						</dd>
					</div>
				</dl>
			);
		},
		[]
	);

	const renderRows = useMemo(
		() => (portMappings: EnrichedPortMappings) => {
			const rows = [];
			const orderedMappings = Object.keys(portMappings).sort();
			for (const portKey of orderedMappings) {
				rows.push(renderRow(portMappings[portKey]));
			}
			return rows;
		},
		[]
	);

	const rows = useMemo(() => {
		return renderRows(enrichedPortMappings);
	}, [enrichedPortMappings]);

	return (
		<BaseView title="Port Mappings">
			<div className="bg-gray-100 shadow overflow-hidden sm:rounded-lg my-4">
				<div className="border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-5 sm:px-6">
					<div className="flex flex-row">
						<h3>
							Ports can be mapped to names that allow you to easily identify them and make tunnel
							configuration's more definable.
						</h3>

						<span className="w-1/3">
							<AddPortMappingModal />
						</span>
					</div>
				</div>
				<div className="border-t border-gray-200">{rows}</div>
			</div>
		</BaseView>
	);
}

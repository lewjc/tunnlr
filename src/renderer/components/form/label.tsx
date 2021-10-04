import React, { ReactNode } from "react";

export interface FormLabelProps {
	label: string;
	children: ReactNode;
	required?: boolean;
}

export default function FormLabel(props: FormLabelProps) {
	return (
		<label className="text-xs font-medium text-gray-400">
			{props.required && <span className="text-yellow-500">*&nbsp;</span>}
			{props.label}
			{props.children}
		</label>
	);
}

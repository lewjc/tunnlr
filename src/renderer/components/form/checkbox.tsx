import React, { ChangeEventHandler } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps {
	onChange?: ChangeEventHandler<HTMLInputElement>;
	label: string;
	formRegistration?: UseFormRegisterReturn;
	className?: string;
}

export default function Checkbox({ onChange, label, formRegistration, className }: CheckboxProps) {
	return (
		<label className="inline-flex items-center mt-3">
			<input
				onChange={onChange}
				type="checkbox"
				className={`form-checkbox h-5 w-5 text-green-500 form-checkbox ${className}`}
				{...formRegistration}
			/>
			<span className="ml-2 text-gray-500 text-sm">{label}</span>
		</label>
	);
}

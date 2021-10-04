import React, { ChangeEventHandler, KeyboardEventHandler, ReactElement } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface TextboxProps {
	placeholder?: string;
	maxLength?: number;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
	className?: string;
	value?: string;
	formRegistration?: UseFormRegisterReturn;
}

export default function Textbox(props: TextboxProps) {
	return (
		<input
			{...props}
			{...props.formRegistration}
			className={`appearance-none rounded-r rounded-l border border-gray-300 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-200 text-gray-700 focus:bg-white focus:placeholder-gray-300 focus:text-gray-700 focus:outline-none ${props.className}`}
		/>
	);
}

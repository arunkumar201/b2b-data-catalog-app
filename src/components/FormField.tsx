"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";

interface FormFieldProps {
	label: string;
	type: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
	label,
	type,
	value,
	onChange,
	error,
	placeholder,
}) => (
	<div className="grid gap-2">
		<Label htmlFor={label}>{label}</Label>
		<Input
			type={type}
			id={label}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className={error ? "border-red-500" : ""}
		/>
		{error && <span className="text-sm text-red-500">{error}</span>}
	</div>
);

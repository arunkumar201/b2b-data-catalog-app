"use client";

import { FormField } from "@/components/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { type TRegisterUser, ZRegisterUser } from "@/schema/auth";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ZodError, set } from "zod";
import { LoadingButton } from "../LoadingButton";

export const RegisterForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<TRegisterUser>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof TRegisterUser, string>>
	>({});
	const [submitError, setSubmitError] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setSubmitError("");
		setIsLoading(true);

		try {
			const validatedData = ZRegisterUser.parse(formData);

			const response = await fetch("/api/v1/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(validatedData),
			});

			const data = await response.json();

			console.debug("🚀 ~ handleSubmit ~ data:", data);

			if (!response.ok) {
				toast.error(data.message);
				setSubmitError(data.message);
				setIsLoading(false);
				return;
			}
			toast.success(data.message);
			router.push("/auth/login");
		} catch (error) {
			console.debug("🚀 ~ handleSubmit ~ error:", error);

			if (error instanceof ZodError) {
				const formErrors = error.errors.reduce(
					(acc, err) => {
						const path = err.path[0] as keyof TRegisterUser;
						acc[path] = err.message;
						return acc;
					},
					{} as Partial<Record<keyof TRegisterUser, string>>,
				);
				setErrors(formErrors);
				setSubmitError(error.errors[0].message);
			} else if (error instanceof Error) {
				setSubmitError(error.message || "An error occurred");
			} else {
				toast.error("An unexpected error occurred");
				setSubmitError("An unexpected error occurred");
			}
		} finally {
			setFormData((prev) => {
				return { ...prev, password: "", confirmPassword: "" };
			});
			setTimeout(() => {
				setIsLoading(false);
			}, 3000);
		}
	};

	return (
		<Card className="w-full max-w-lg">
			<CardHeader className="mb-2 w-full flex flex-col items-center justify-center">
				<CardTitle className="text-2xl font-bold mb-1">
					<span>Join Us Today!</span>
				</CardTitle>
				<CardDescription className="text-base">
					Create a new account to get started
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{submitError && (
						<Alert variant="destructive">
							<AlertDescription>{submitError}</AlertDescription>
						</Alert>
					)}
					<div className="grid grid-cols-2 gap-4">
						<FormField
							label="First Name"
							type="text"
							value={formData.firstName}
							onChange={(value) =>
								setFormData({ ...formData, firstName: value })
							}
							error={errors.firstName}
							placeholder="Enter your first name"
						/>
						<FormField
							label="Last Name"
							type="text"
							value={formData.lastName}
							onChange={(value) =>
								setFormData({ ...formData, lastName: value })
							}
							error={errors.lastName}
							placeholder="Enter your last name"
						/>
					</div>
					<FormField
						label="Email"
						type="email"
						value={formData.email}
						onChange={(value) => setFormData({ ...formData, email: value })}
						error={errors.email}
						placeholder="Enter your email"
					/>
					<FormField
						label="Password"
						type="password"
						value={formData.password}
						onChange={(value) => setFormData({ ...formData, password: value })}
						error={errors.password}
						placeholder="Enter your password"
					/>
					<FormField
						label="Confirm Password"
						type="password"
						value={formData.confirmPassword}
						onChange={(value) =>
							setFormData({ ...formData, confirmPassword: value })
						}
						error={errors.confirmPassword}
						placeholder="Confirm your password"
					/>
					<LoadingButton type="submit" loading={isLoading}>
						Register
					</LoadingButton>
				</form>
			</CardContent>
		</Card>
	);
};

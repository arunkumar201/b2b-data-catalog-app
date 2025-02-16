"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type LoginFormData,
	type TRegisterUser,
	loginSchema,
} from "@/schema/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { FormField } from "../FormField";
import { LoadingButton } from "../LoadingButton";

export const LoginForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof LoginFormData, string>>
	>({});
	const [submitError, setSubmitError] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});
		setSubmitError("");

		try {
			const validatedData = await loginSchema.parseAsync(formData);

			const result = await signIn("credentials", {
				email: validatedData.email,
				password: validatedData.password,
				redirect: false,
			});

			if (!result?.ok) {
				toast.error("Failed to sign in");
				setSubmitError("Invalid credentials");
				setIsLoading(false);
				return;
			}

			toast.success("Signed in successfully");
			router.push("/dashboard");
		} catch (error) {
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
			} else if (error instanceof Error) {
				setSubmitError(error.message || "An error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-lg">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-2xl font-bold mb-2">
					<span>Welcome back!</span>
				</CardTitle>
				<CardDescription className="text-sm">
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{submitError && (
						<Alert variant="destructive">
							<AlertDescription>{submitError}</AlertDescription>
						</Alert>
					)}
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
					<LoadingButton type="submit" loading={isLoading}>
						Login
					</LoadingButton>
				</form>
			</CardContent>
		</Card>
	);
};

"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

export const LogoutButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await signOut({ redirect: true });
		} catch (error) {
			console.error("Error logging out:", error);
			toast.error("Error logging out");
		} finally {
			toast.success("Logged out successfully");
			setTimeout(() => {
				setIsLoading(false);
			}, 2000);
		}
	};
	return (
		<div className="flex items-center justify-end">
			<Button className="w-fit" onClick={handleLogout} disabled={isLoading}>
				Logout
			</Button>
		</div>
	);
};

"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

export const LogoutButton = () => {
	const handleLogout = async () => {
		try {
			await signOut({ redirect: true });
		} catch (error) {
			console.error("Error logging out:", error);
			toast.error("Error logging out");
		}
	};
	return (
		<div className="flex items-center justify-end">
			<Button className="w-fit" onClick={handleLogout}>
				Logout
			</Button>
		</div>
	);
};

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export const LoadingButton = ({
	children,
	loading,
	disabled,
	type = "button",
	onClickHandler,
	...props
}: {
	children: React.ReactNode;
	loading: boolean;
	onClickHandler?: () => void;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
}) => (
	<Button
		{...props}
		onClick={onClickHandler}
		disabled={loading || disabled}
		type={type}
		className="flex items-center gap-2 disabled:opacity-50 w-full"
	>
		{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
	</Button>
);

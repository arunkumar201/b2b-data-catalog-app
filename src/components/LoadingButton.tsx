import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export const LoadingButton = ({
	children,
	loading,
	disabled,
	onClickHandler,
	...props
}: {
	children: React.ReactNode;
	loading: boolean;
	onClickHandler?: () => void;
	disabled?: boolean;
}) => (
	<Button
		{...props}
		onClick={onClickHandler}
		disabled={loading || disabled}
		className="flex items-center gap-2 disabled:opacity-50"
	>
		{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
	</Button>
);

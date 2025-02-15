import { LoginForm } from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage: React.FC = async () => {
	const session = await getServerSession(authOptions);
	if (session) {
		redirect(`/dashboard/${session.user.id}`);
	}

	return (
		<div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
			<LoginForm />
		</div>
	);
};

export default LoginPage;

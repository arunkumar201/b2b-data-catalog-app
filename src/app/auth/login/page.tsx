import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
	return (
		<div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
			<LoginForm />
		</div>
	);
};

export default LoginPage;

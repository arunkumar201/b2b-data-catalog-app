import { RegisterForm } from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
	return (
		<div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
			<RegisterForm />
		</div>
	);
};

export default RegisterPage;

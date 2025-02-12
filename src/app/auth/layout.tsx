import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen flex flex-col h-screen">
			<header className="bg-primary text-white p-4 flex flex-row items-center justify-center w-full">
				<div className="flex flex-row items-center justify-between w-full max-w-5xl">
					<div className="flex flex-row items-center">
						<h1 className="text-base md:text-2xl font-bold">
							Data Catalog App
						</h1>
					</div>
					<nav className="flex flex-row items-center space-x-4">
						<ul className="flex space-x-4">
							<li>
								<Button className="text-primary" variant={"outline"}>
									<Link href="/auth/register" className="hover:underline">
										Register
									</Link>
								</Button>
							</li>
							<li>
								<Button className="text-primary" variant={"outline"}>
									<Link href="/auth/login" className="hover:underline">
										Login
									</Link>
								</Button>
							</li>
						</ul>
					</nav>
				</div>
			</header>
			<main className="flex-grow">{children}</main>
		</div>
	);
};
export default AuthLayout;

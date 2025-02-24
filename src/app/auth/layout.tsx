import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await getServerSession(authOptions);
	if (session) {
		redirect(`/dashboard/${session.user.id}`);
	}

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
								<Link href="/auth/register" className="hover:underline">
									<Button
										className="text-primary hover:underline"
										variant={"outline"}
									>
										Register
									</Button>
								</Link>
							</li>
							<li>
								<Link href="/auth/login" className="hover:underline">
									<Button
										className="text-primary hover:underline"
										variant={"outline"}
									>
										Login
									</Button>
								</Link>
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

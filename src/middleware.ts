import { withAuth } from "next-auth/middleware";

export default withAuth(
	function middleware(req) {
		console.log("Middleware executed on path", req.nextUrl.pathname);
	},
	{
		pages: {
			signIn: "/auth/login",
			error: "/auth/register",
			signOut: "/auth/login",
		},
	},
);

export const config = {
	matcher: ["/dashboard/:path*"],
};

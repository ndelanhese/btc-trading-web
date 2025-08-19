import { getCookie } from "cookies-next/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SECURITY_CONFIG } from "./lib/security-config";

// Define protected routes
const protectedRoutes = SECURITY_CONFIG.ROUTES.PROTECTED;
const authRoutes = SECURITY_CONFIG.ROUTES.AUTH;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Get auth token from cookies
	const token = await getCookie("auth_token", { req: request });

	// Check if user is authenticated
	const isAuthenticated = !!token;

	// Handle protected routes
	if (protectedRoutes.some((route) => pathname.startsWith(route))) {
		if (!isAuthenticated) {
			// Redirect to login if not authenticated
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Handle auth routes (login/register)
	if (authRoutes.some((route) => pathname.startsWith(route))) {
		if (isAuthenticated) {
			// Redirect to dashboard if already authenticated
			// return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	// Add security headers
	const response = NextResponse.next();

	// Security headers
	response.headers.set(
		"X-Frame-Options",
		SECURITY_CONFIG.HEADERS.X_FRAME_OPTIONS,
	);
	response.headers.set(
		"X-Content-Type-Options",
		SECURITY_CONFIG.HEADERS.X_CONTENT_TYPE_OPTIONS,
	);
	response.headers.set(
		"Referrer-Policy",
		SECURITY_CONFIG.HEADERS.REFERRER_POLICY,
	);
	response.headers.set(
		"Permissions-Policy",
		SECURITY_CONFIG.HEADERS.PERMISSIONS_POLICY,
	);
	response.headers.set("Content-Security-Policy", SECURITY_CONFIG.HEADERS.CSP);

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};

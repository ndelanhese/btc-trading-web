import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "BTC Trading Bot",
	description: "Advanced Bitcoin trading bot with automated features",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<QueryProvider>
					<AuthProvider>
						{children}
						<Toaster />
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}

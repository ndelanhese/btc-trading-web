"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../lib/store";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		} else {
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
		</div>
	);
}

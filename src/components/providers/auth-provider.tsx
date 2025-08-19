"use client";

import { useEffect } from "react";
import { checkAndMigrate } from "@/lib/migration";
import { useAuthStore } from "@/lib/store";

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const initialize = useAuthStore((state) => state.initialize);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	useEffect(() => {
		const initAuth = async () => {
			try {
				// Check for localStorage migration first
				const migrated = checkAndMigrate();

				// Initialize auth state from cookies on app start
				await initialize();

				if (migrated) {
					// Re-initialize after migration
					setTimeout(async () => {
						await initialize();
					}, 100);
				}
			} catch (error) {
				console.error("Failed to initialize authentication:", error);
			}
		};

		if (!isInitialized) {
			initAuth();
		}
	}, [initialize, isInitialized]);

	return <>{children}</>;
};

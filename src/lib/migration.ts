import { securityUtils, tokenCookies } from "./cookies";
import type { User } from "./types";

export const migrateFromLocalStorage = () => {
	if (typeof window === "undefined") return;

	try {
		// Check if user has data in localStorage
		const oldToken = localStorage.getItem("token");
		const oldUser = localStorage.getItem("user");

		if (oldToken && oldUser) {
			// Validate the old token
			if (securityUtils.isValidToken(oldToken)) {
				// Parse user data
				let userData: Record<string, unknown>;
				try {
					userData = JSON.parse(oldUser) as Record<string, unknown>;
				} catch {
					console.warn("Invalid user data in localStorage");
					return;
				}

				// Migrate to cookies
				tokenCookies.setAuthToken(oldToken);
				const sanitizedUserData = securityUtils.sanitizeUserData(
					userData as unknown as User,
				);
				if (sanitizedUserData) {
					tokenCookies.setUserData(sanitizedUserData);
				}

				// Clear localStorage
				localStorage.removeItem("token");
				localStorage.removeItem("user");

				console.log("Successfully migrated from localStorage to cookies");
				return true;
			} else {
				// Clear invalid data
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				console.warn("Invalid token found in localStorage, cleared");
			}
		}
	} catch (error) {
		console.error("Error during migration:", error);
	}

	return false;
};

export const checkAndMigrate = async () => {
	// Only run migration if cookies are enabled
	if (!(await securityUtils.areCookiesEnabled())) {
		console.warn("Cookies are disabled, cannot migrate from localStorage");
		return false;
	}

	return migrateFromLocalStorage();
};

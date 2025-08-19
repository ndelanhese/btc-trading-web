import { securityUtils, tokenCookies } from "./cookies";

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
				let userData: any;
				try {
					userData = JSON.parse(oldUser);
				} catch {
					console.warn("Invalid user data in localStorage");
					return;
				}

				// Migrate to cookies
				tokenCookies.setAuthToken(oldToken);
				tokenCookies.setUserData(securityUtils.sanitizeUserData(userData));

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

export const checkAndMigrate = () => {
	// Only run migration if cookies are enabled
	if (!securityUtils.areCookiesEnabled()) {
		console.warn("Cookies are disabled, cannot migrate from localStorage");
		return false;
	}

	return migrateFromLocalStorage();
};

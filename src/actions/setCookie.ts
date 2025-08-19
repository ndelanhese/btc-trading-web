'use server'

import { cookies } from "next/headers";

export const setCookieAction = async (name: string, value: string, config: Record<string, string | number | boolean | undefined>) => {
	const cookieStore = await cookies();
	cookieStore.set(name, value, config);
};
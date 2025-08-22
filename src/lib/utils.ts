import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { cryptoApi } from "./crypto-api";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const SATOSHIS_PER_BITCOIN = 100_000_000;

export async function getBitcoinPrice(): Promise<number> {
	try {
		return await cryptoApi.getBitcoinPrice();
	} catch (error) {
		toast.error('Failed to fetch Bitcoin price', {
			description: error instanceof Error ? error.message : 'Unknown error',
		});
		return 0;
	}
}

export function satoshisToUSD(satoshis: number, bitcoinPrice: number): number {
	const bitcoins = satoshis / SATOSHIS_PER_BITCOIN;
	return bitcoins * bitcoinPrice;
}

export async function convertSatoshisToUSD(satoshis: number): Promise<number> {
	const bitcoinPrice = await getBitcoinPrice();
	return satoshisToUSD(satoshis, bitcoinPrice);
}

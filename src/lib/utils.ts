import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const SATOSHIS_PER_BITCOIN = 100_000_000;

interface BitcoinPriceResponse {
	bitcoin: {
		usd: number;
	};
}

let cachedBitcoinPrice: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getBitcoinPrice(): Promise<number> {
	const now = Date.now();
	
	// Return cached price if it's still valid
	if (cachedBitcoinPrice && (now - lastFetchTime) < CACHE_DURATION) {
		return cachedBitcoinPrice;
	}

	try {
		const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
		
		if (!response.ok) {
			throw new Error(`Failed to fetch Bitcoin price: ${response.status}`);
		}

		const data: BitcoinPriceResponse = await response.json();
		const price = data.bitcoin.usd;
		
		cachedBitcoinPrice = price;
		lastFetchTime = now;
		
		return price;
	} catch (error) {
		toast.error('Failed to fetch Bitcoin price', {
			description: error instanceof Error ? error.message : 'Unknown error',
		});		

		if (cachedBitcoinPrice) {
			return cachedBitcoinPrice;
		}
		
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

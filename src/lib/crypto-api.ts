// API Ninjas Crypto Price API Client
// https://api-ninjas.com/api/cryptoprice

const API_NINJAS_BASE_URL = "https://api.api-ninjas.com/v1";
const API_NINJAS_KEY = process.env.NEXT_PUBLIC_API_NINJAS_KEY;

// Cache for crypto prices to minimize API calls
const priceCache: Map<string, { price: number; timestamp: number }> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CryptoPriceResponse {
	symbol: string;
	price: string;
	timestamp: number;
}

interface CryptoPriceError {
	error: string;
}

export class CryptoApiClient {
	private static instance: CryptoApiClient;
	private apiKey: string;

	private constructor() {
		this.apiKey = API_NINJAS_KEY || "";
		if (!this.apiKey) {
			console.warn(
				"API Ninjas key not found. Please set NEXT_PUBLIC_API_NINJAS_KEY environment variable.",
			);
		}
	}

	public static getInstance(): CryptoApiClient {
		if (!CryptoApiClient.instance) {
			CryptoApiClient.instance = new CryptoApiClient();
		}
		return CryptoApiClient.instance;
	}

	private async makeRequest<T>(endpoint: string): Promise<T> {
		if (!this.apiKey) {
			throw new Error("API Ninjas key is required");
		}

		const response = await fetch(`${API_NINJAS_BASE_URL}${endpoint}`, {
			headers: {
				"X-Api-Key": this.apiKey,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData: CryptoPriceError = await response
				.json()
				.catch(() => ({ error: "Unknown error" }));
			throw new Error(
				errorData.error || `HTTP error! status: ${response.status}`,
			);
		}

		return response.json();
	}

	public async getCryptoPrice(symbol: string): Promise<number> {
		const now = Date.now();
		const cached = priceCache.get(symbol);

		// Return cached price if it's still valid
		if (cached && now - cached.timestamp < CACHE_DURATION) {
			return cached.price;
		}

		try {
			const data: CryptoPriceResponse = await this.makeRequest(
				`/cryptoprice?symbol=${symbol}`,
			);
			const price = parseFloat(data.price);

			// Cache the result
			priceCache.set(symbol, { price, timestamp: now });

			return price;
		} catch (error) {
			console.error(`Failed to fetch price for ${symbol}:`, error);

			// Return cached price if available, even if expired
			if (cached) {
				return cached.price;
			}

			throw error;
		}
	}

	public async getAvailableSymbols(): Promise<string[]> {
		try {
			const data: { symbols: string[] } =
				await this.makeRequest("/cryptosymbols");
			return data.symbols;
		} catch (error) {
			console.error("Failed to fetch available symbols:", error);
			throw error;
		}
	}

	public async getBitcoinPrice(): Promise<number> {
		return this.getCryptoPrice("BTCUSD");
	}

	// Clear cache (useful for testing or manual refresh)
	public clearCache(): void {
		priceCache.clear();
	}

	// Get cache statistics
	public getCacheStats(): { size: number; entries: string[] } {
		return {
			size: priceCache.size,
			entries: Array.from(priceCache.keys()),
		};
	}
}

// Export singleton instance
export const cryptoApi = CryptoApiClient.getInstance();

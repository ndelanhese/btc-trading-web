// WebSocket-based Crypto Price API Client
// Connects to our backend's BTC price WebSocket endpoint

import { tokenCookies } from "./cookies";

const WS_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || "ws://localhost:8080";

interface PriceSnapshot {
	price: number;
	timestamp: number;
	sources: Record<string, number>;
}

interface WebSocketMessage {
	price: number;
	timestamp: number;
	sources: Record<string, number>;
}

interface CryptoPriceError {
	error: string;
}

export class CryptoApiClient {
	private static instance: CryptoApiClient;
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000; // Start with 1 second
	private authToken: string | null = null;
	private priceCallbacks: Set<(price: number) => void> = new Set();
	private isConnecting = false;

	private constructor() {
		// Get auth token from cookies if available
		if (typeof window !== "undefined") {
			this.authToken = tokenCookies.getAuthToken() || null;
		}
	}

	public static getInstance(): CryptoApiClient {
		if (!CryptoApiClient.instance) {
			CryptoApiClient.instance = new CryptoApiClient();
		}
		return CryptoApiClient.instance;
	}

	private getWebSocketUrl(): string {
		const baseUrl = WS_BASE_URL;
		const token = this.authToken;
		if (!token) {
			throw new Error("Authentication token required for WebSocket connection");
		}
		return `${baseUrl}/api/ws/btc-price?token=${encodeURIComponent(token)}`;
	}

	private connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isConnecting) {
				reject(new Error("Connection already in progress"));
				return;
			}

			this.isConnecting = true;

			try {
				const wsUrl = this.getWebSocketUrl();
				this.ws = new WebSocket(wsUrl);

				this.ws.onopen = () => {
					console.log("WebSocket connected to BTC price stream");
					this.isConnecting = false;
					this.reconnectAttempts = 0;
					this.reconnectDelay = 1000;
					resolve();
				};

				this.ws.onmessage = (event) => {
					try {
						const data: WebSocketMessage = JSON.parse(event.data);
						this.handlePriceUpdate(data.price);
					} catch (error) {
						console.error("Error parsing WebSocket message:", error);
					}
				};

				this.ws.onclose = (event) => {
					console.log("WebSocket connection closed:", event.code, event.reason);
					this.isConnecting = false;
					this.handleDisconnect();
				};

				this.ws.onerror = (error) => {
					console.error("WebSocket error:", error);
					this.isConnecting = false;
					reject(new Error("WebSocket connection failed"));
				};

			} catch (error) {
				this.isConnecting = false;
				reject(error);
			}
		});
	}

	private handleDisconnect(): void {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++;
			console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
			
			setTimeout(() => {
				this.connect().catch((error) => {
					console.error("Reconnection failed:", error);
				});
			}, this.reconnectDelay);

			// Exponential backoff
			this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
		} else {
			console.error("Max reconnection attempts reached");
		}
	}

	private handlePriceUpdate(price: number): void {
		// Notify all registered callbacks
		this.priceCallbacks.forEach(callback => {
			try {
				callback(price);
			} catch (error) {
				console.error("Error in price callback:", error);
			}
		});
	}

	public async ensureConnection(): Promise<void> {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			await this.connect();
		}
	}

	public async getCryptoPrice(symbol: string): Promise<number> {
		// For now, we only support BTC price
		if (symbol !== "BTCUSD" && symbol !== "BTC") {
			throw new Error(`Symbol ${symbol} not supported. Only BTC price is available.`);
		}

		await this.ensureConnection();

		// Return a promise that resolves with the next price update
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error("Timeout waiting for price update"));
			}, 10000); // 10 second timeout

			const callback = (price: number) => {
				clearTimeout(timeout);
				this.priceCallbacks.delete(callback);
				resolve(price);
			};

			this.priceCallbacks.add(callback);
		});
	}

	public async getBitcoinPrice(): Promise<number> {
		return this.getCryptoPrice("BTCUSD");
	}

	public onPriceUpdate(callback: (price: number) => void): () => void {
		this.priceCallbacks.add(callback);
		
		// Return unsubscribe function
		return () => {
			this.priceCallbacks.delete(callback);
		};
	}

	public async getAvailableSymbols(): Promise<string[]> {
		// We only support BTC for now
		return ["BTCUSD", "BTC"];
	}

	public disconnect(): void {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.priceCallbacks.clear();
		this.reconnectAttempts = 0;
		this.reconnectDelay = 1000;
	}

	public setAuthToken(token: string): void {
		this.authToken = token;
		// Reconnect with new token if currently connected
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.disconnect();
			this.connect().catch(console.error);
		}
	}

	public updateAuthToken(): void {
		// Update auth token from cookies
		this.authToken = tokenCookies.getAuthToken() || null;
		// Reconnect with new token if currently connected
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.disconnect();
			this.connect().catch(console.error);
		}
	}

	// Get connection status
	public getConnectionStatus(): "connecting" | "connected" | "disconnected" | "error" {
		if (this.isConnecting) return "connecting";
		if (this.ws && this.ws.readyState === WebSocket.OPEN) return "connected";
		if (this.ws && this.ws.readyState === WebSocket.CLOSED) return "disconnected";
		return "error";
	}

	// Clear cache (no longer needed but kept for compatibility)
	public clearCache(): void {
		// No cache in WebSocket implementation
	}

	// Get cache statistics (no longer needed but kept for compatibility)
	public getCacheStats(): { size: number; entries: string[] } {
		return {
			size: 0,
			entries: [],
		};
	}
}

// Export singleton instance
export const cryptoApi = CryptoApiClient.getInstance();

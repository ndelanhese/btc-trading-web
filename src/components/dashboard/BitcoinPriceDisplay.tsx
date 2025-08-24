"use client";

import { TrendingDown, TrendingUp, Wifi, WifiOff } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBitcoinPriceWebSocket } from "@/lib/hooks";

export const BitcoinPriceDisplay: React.FC = () => {
	const { price, sources, timestamp, isConnected, error } =
		useBitcoinPriceWebSocket();

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const formatTimestamp = (timestamp: number) => {
		return new Date(timestamp).toLocaleTimeString();
	};

	const getPriceChangeIndicator = () => {
		return null;
	};

	if (error) {
		return (
			<Card className="bg-red-50 border-red-200">
				<CardHeader className="pb-2">
					<CardTitle className="text-red-800 text-sm font-medium flex items-center gap-2">
						<WifiOff className="h-4 w-4" />
						BTC Price - Connection Error
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-red-600 text-sm">{error}</p>
				</CardContent>
			</Card>
		);
	}

	if (!isConnected) {
		return (
			<Card className="bg-yellow-50 border-yellow-200">
				<CardHeader className="pb-2">
					<CardTitle className="text-yellow-800 text-sm font-medium flex items-center gap-2">
						<WifiOff className="h-4 w-4" />
						BTC Price - Connecting...
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="animate-pulse">
						<div className="h-8 bg-yellow-200 rounded w-32"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
			<CardHeader className="pb-2">
				<CardTitle className="text-purple-100 text-sm font-medium flex items-center gap-2">
					<Wifi className="h-4 w-4" />
					Bitcoin Price (Live)
					{timestamp && (
						<span className="text-xs text-purple-200 ml-auto">
							{formatTimestamp(timestamp)}
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{/* Main Price */}
					<div className="flex items-center justify-between">
						<p className="text-3xl font-bold">
							{price ? formatCurrency(price) : "Loading..."}
						</p>
						{getPriceChangeIndicator()}
					</div>

					{/* Sources */}
					{sources && Object.keys(sources).length > 0 && (
						<div className="space-y-1">
							<p className="text-xs text-purple-200 font-medium">Sources:</p>
							<div className="grid grid-cols-3 gap-2 text-xs">
								{Object.entries(sources).map(([source, sourcePrice]) => (
									<div key={source} className="bg-purple-400/20 rounded p-1">
										<p className="text-purple-100 font-medium capitalize">
											{source}
										</p>
										<p className="text-purple-50">
											{formatCurrency(sourcePrice)}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

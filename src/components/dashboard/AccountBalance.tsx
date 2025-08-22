import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccountBalance } from "@/lib/types";
import { convertSatoshisToUSD } from "@/lib/utils";

interface AccountBalanceDisplayProps {
	balance: AccountBalance | null;
}

interface ConvertedBalance {
	balance: number;
	available_balance: number;
	margin_balance: number;
}

export const AccountBalanceDisplay: React.FC<AccountBalanceDisplayProps> = ({
	balance,
}) => {
	const {
		data: convertedBalance,
		isLoading,
		error,
	} = useQuery({
		queryKey: [
			"balance-conversion",
			balance?.balance,
			balance?.available_balance,
			balance?.margin_balance,
		],
		queryFn: async (): Promise<ConvertedBalance> => {
			if (!balance) {
				throw new Error("No balance data available");
			}

			const [balanceUSD, availableBalanceUSD, marginBalanceUSD] =
				await Promise.all([
					convertSatoshisToUSD(balance.balance || 0),
					convertSatoshisToUSD(balance.available_balance || 0),
					balance.margin_balance
						? convertSatoshisToUSD(balance.margin_balance)
						: Promise.resolve(0),
				]);

			return {
				balance: balanceUSD,
				available_balance: availableBalanceUSD,
				margin_balance: marginBalanceUSD,
			};
		},
		enabled: !!balance,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	if (!balance) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
				<p>No balance information available</p>
			</div>
		);
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const displayBalance = convertedBalance?.balance || 0;
	const displayAvailableBalance = convertedBalance?.available_balance || 0;
	const displayMarginBalance = convertedBalance?.margin_balance || 0;
	const displayMarginUsed = displayBalance - displayAvailableBalance;

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[1, 2, 3].map((i) => (
					<Card key={i} className="animate-pulse">
						<CardHeader className="pb-2">
							<div className="h-4 bg-gray-200 rounded w-24"></div>
						</CardHeader>
						<CardContent>
							<div className="h-8 bg-gray-200 rounded w-32"></div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8 text-red-600">
				<DollarSign className="h-12 w-12 mx-auto mb-4 text-red-400" />
				<p>{error.message || "Failed to convert balance to USD"}</p>
				<p className="text-sm text-muted-foreground mt-2">
					Showing balance in satoshis as fallback
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* Total Balance */}
			<Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
				<CardHeader className="pb-2">
					<CardTitle className="text-blue-100 text-sm font-medium">
						Total Balance
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<p className="text-2xl font-bold">
							{formatCurrency(displayBalance)}
						</p>
						<DollarSign className="h-8 w-8 text-blue-200" />
					</div>
				</CardContent>
			</Card>

			{/* Available Balance */}
			<Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
				<CardHeader className="pb-2">
					<CardTitle className="text-green-100 text-sm font-medium">
						Available Balance
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<p className="text-2xl font-bold">
							{formatCurrency(displayAvailableBalance)}
						</p>
						<TrendingUp className="h-8 w-8 text-green-200" />
					</div>
				</CardContent>
			</Card>

			{/* Margin Used */}
			<Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
				<CardHeader className="pb-2">
					<CardTitle className="text-orange-100 text-sm font-medium">
						Margin Used
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<p className="text-2xl font-bold">
							{formatCurrency(displayMarginUsed)}
						</p>
						<TrendingDown className="h-8 w-8 text-orange-200" />
					</div>
				</CardContent>
			</Card>

			{/* Additional Details */}
			{balance.margin_balance && (
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle>Detailed Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Total Balance</p>
								<p className="text-lg font-semibold">
									{formatCurrency(displayBalance)}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Available Balance
								</p>
								<p className="text-lg font-semibold">
									{formatCurrency(displayAvailableBalance)}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Margin Balance</p>
								<p className="text-lg font-semibold">
									{formatCurrency(displayMarginBalance)}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Currency</p>
								<p className="text-lg font-semibold">
									{balance.currency || "USD"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

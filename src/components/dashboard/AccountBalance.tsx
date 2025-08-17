import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AccountBalanceProps {
	balance: any;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ balance }) => {
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

	const formatSats = (sats: number) => {
		return new Intl.NumberFormat("en-US").format(sats);
	};

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
							{formatCurrency(balance.total_balance || 0)}
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
							{formatCurrency(balance.available_balance || 0)}
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
							{formatCurrency(balance.margin_used || 0)}
						</p>
						<TrendingDown className="h-8 w-8 text-orange-200" />
					</div>
				</CardContent>
			</Card>

			{/* Additional Details */}
			{balance.sats && (
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle>Detailed Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Sats Balance</p>
								<p className="text-lg font-semibold">
									{formatSats(balance.sats.balance || 0)} sats
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Available Sats</p>
								<p className="text-lg font-semibold">
									{formatSats(balance.sats.available || 0)} sats
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Margin Sats</p>
								<p className="text-lg font-semibold">
									{formatSats(balance.sats.margin || 0)} sats
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Unrealized P&L</p>
								<p
									className={cn(
										"text-lg font-semibold",
										(balance.sats.unrealized_pnl || 0) >= 0
											? "text-green-600"
											: "text-red-600",
									)}
								>
									{formatCurrency(balance.sats.unrealized_pnl || 0)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

"use client";

import { BarChart3, Play, Settings, Square, User, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccountBalance, useBotManagement, usePositions } from "@/lib/hooks";
import { useAuthStore, useTradingStore } from "@/lib/store";
import { AccountBalance } from "./AccountBalance";
import { BotStatus } from "./BotStatus";
import { LNMarketsConfig } from "./LNMarketsConfig";
import { PositionsList } from "./PositionsList";
import { TradingConfig } from "./TradingConfig";

export const Dashboard: React.FC = () => {
	const router = useRouter();
	const { user, logout, isAuthenticated } = useAuthStore();
	const {
		botStatus,
		accountBalance,
		positions,
		setBotStatus,
		setAccountBalance,
		setPositions,
	} = useTradingStore();

	const {
		status: botStatusData,
		startBot,
		stopBot,
		isStarting,
		isStopping,
	} = useBotManagement();
	const { balance: accountBalanceData } = useAccountBalance();
	const { positions: positionsData } = usePositions();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}
	}, [isAuthenticated, router]);

	useEffect(() => {
		if (botStatusData) {
			setBotStatus(
				(botStatusData.status as "running" | "stopped" | "error") || "stopped",
			);
		}
	}, [botStatusData, setBotStatus]);

	useEffect(() => {
		if (accountBalanceData) {
			setAccountBalance(accountBalanceData);
		}
	}, [accountBalanceData, setAccountBalance]);

	useEffect(() => {
		if (positionsData) {
			setPositions(positionsData);
		}
	}, [positionsData, setPositions]);

	const handleStartBot = () => {
		startBot();
	};

	const handleStopBot = () => {
		stopBot();
	};

	const handleLogout = () => {
		logout();
		router.push("/login");
		toast.success("Logged out successfully");
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<BarChart3 className="h-8 w-8 text-primary" />
							<h1 className="text-2xl font-bold">BTC Trading Bot</h1>
						</div>

						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<User className="h-4 w-4" />
								<span>{user?.username}</span>
							</div>
							<Button variant="outline" size="sm" onClick={handleLogout}>
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto py-6 px-4">
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger
							value="overview"
							className="flex items-center space-x-2"
						>
							<BarChart3 className="h-4 w-4" />
							<span>Overview</span>
						</TabsTrigger>
						<TabsTrigger value="config" className="flex items-center space-x-2">
							<Settings className="h-4 w-4" />
							<span>Configuration</span>
						</TabsTrigger>
						<TabsTrigger
							value="lnmarkets"
							className="flex items-center space-x-2"
						>
							<Wallet className="h-4 w-4" />
							<span>LN Markets</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						{/* Bot Control */}
						<Card>
							<CardHeader>
								<CardTitle>Bot Control</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<BotStatus status={botStatus} />
									<div className="flex space-x-2">
										<Button
											onClick={handleStartBot}
											disabled={isStarting || botStatus === "running"}
											className="flex items-center space-x-2"
										>
											<Play className="h-4 w-4" />
											<span>Start Bot</span>
										</Button>
										<Button
											variant="destructive"
											onClick={handleStopBot}
											disabled={isStopping || botStatus === "stopped"}
											className="flex items-center space-x-2"
										>
											<Square className="h-4 w-4" />
											<span>Stop Bot</span>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Account Balance */}
						<Card>
							<CardHeader>
								<CardTitle>Account Balance</CardTitle>
							</CardHeader>
							<CardContent>
								<AccountBalance balance={accountBalance} />
							</CardContent>
						</Card>

						{/* Positions */}
						<Card>
							<CardHeader>
								<CardTitle>Active Positions</CardTitle>
							</CardHeader>
							<CardContent>
								<PositionsList positions={positions} onUpdate={() => {}} />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="config">
						<TradingConfig />
					</TabsContent>

					<TabsContent value="lnmarkets">
						<LNMarketsConfig />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};

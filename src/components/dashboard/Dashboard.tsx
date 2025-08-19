"use client";

import {
	BarChart3,
	Bug,
	Play,
	Settings,
	Square,
	User,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tokenCookies } from "@/lib/cookies";
import { useAccountBalance, useBotManagement, usePositions } from "@/lib/hooks";
import { useAuthStore, useTradingStore } from "@/lib/store";
import { AccountBalanceDisplay } from "./AccountBalance";
import { BotStatus } from "./BotStatus";
import { LNMarketsConfigForm } from "./LNMarketsConfig";
import { PositionsList } from "./PositionsList";
import { TradingConfig } from "./TradingConfig";

export const Dashboard: React.FC = () => {
	const router = useRouter();
	const { user, logout, isAuthenticated, isInitialized } = useAuthStore();
	const {
		botStatus,
		accountBalance,
		positions,
		setBotStatus,
		setAccountBalance,
		setPositions,
	} = useTradingStore();

	const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});

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
		if (!isAuthenticated && isInitialized) {
			router.push("/login");
			return;
		}
	}, [isAuthenticated, isInitialized, router]);

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

	// Debug function to check cookie state
	const checkCookieState = () => {
		const debug = {
			hasAuthToken: tokenCookies.hasAuthToken(),
			hasUserData: tokenCookies.hasUserData(),
			hasRefreshToken: tokenCookies.hasRefreshToken(),
			authToken: tokenCookies.getAuthToken() ? "Present" : "Not found",
			userData: tokenCookies.getUserData() ? "Present" : "Not found",
			refreshToken: tokenCookies.getRefreshToken() ? "Present" : "Not found",
			storeState: {
				isAuthenticated,
				isInitialized,
				user: user ? "Present" : "Not found",
			},
		};
		setDebugInfo(debug);
		console.log("Cookie Debug Info:", debug);
	};

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

	if (!isAuthenticated || !isInitialized) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Loading...</h2>
					<p className="text-muted-foreground">
						{!isInitialized
							? "Initializing authentication..."
							: "Redirecting to login..."}
					</p>
				</div>
			</div>
		);
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
					<TabsList className="grid w-full grid-cols-5">
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
						<TabsTrigger value="debug" className="flex items-center space-x-2">
							<Bug className="h-4 w-4" />
							<span>Debug</span>
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
								<AccountBalanceDisplay balance={accountBalance} />
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
						<LNMarketsConfigForm />
					</TabsContent>

					<TabsContent value="debug">
						<Card>
							<CardHeader>
								<CardTitle>Authentication Debug</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<Button onClick={checkCookieState} variant="outline">
										Check Cookie State
									</Button>

									{Object.keys(debugInfo).length > 0 && (
										<div className="space-y-2">
											<h3 className="font-semibold">Cookie Status:</h3>
											<pre className="bg-muted p-4 rounded text-sm overflow-auto">
												{JSON.stringify(debugInfo, null, 2)}
											</pre>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};

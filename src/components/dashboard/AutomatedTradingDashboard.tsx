"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Play,
	Square,
	Settings,
	BarChart3,
	DollarSign,
	TrendingUp,
	TrendingDown,
	AlertTriangle,
	Info,
	Clock,
	Shield,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store";

interface AutomatedBotStatus {
	user_id: number;
	is_running: boolean;
	status: string;
	last_price: number;
	last_update: string;
	last_restructure: string;
	active_positions: number;
	total_trades: number;
	total_fees: number;
	net_profit: number;
}

interface AutomatedTradingConfig {
	user_id: number;
	initial_margin: number;
	max_leverage: number;
	risk_percentage: number;
	auto_margin_addition: boolean;
	margin_threshold: number;
	restructure_interval: number;
	max_positions: number;
	take_profit_percent: number;
	stop_loss_percent: number;
	enable_funding_fee: boolean;
	min_profit_margin: number;
}

interface TradingReport {
	user_id: number;
	period: string;
	start_date: string;
	end_date: string;
	total_trades: number;
	winning_trades: number;
	losing_trades: number;
	win_rate: number;
	total_volume: number;
	total_pnl: number;
	total_fees: number;
	net_pnl: number;
	average_trade_size: number;
	max_drawdown: number;
	profit_history: any[];
	fee_history: any[];
}

export const AutomatedTradingDashboard: React.FC = () => {
	const { user } = useAuthStore();
	const [botStatus, setBotStatus] = useState<AutomatedBotStatus | null>(null);
	const [config, setConfig] = useState<AutomatedTradingConfig | null>(null);
	const [report, setReport] = useState<TradingReport | null>(null);
	const [isStarting, setIsStarting] = useState(false);
	const [isStopping, setIsStopping] = useState(false);

	useEffect(() => {
		loadBotStatus();
		loadConfig();
		loadReport();
	}, []);

	const loadBotStatus = async () => {
		try {
			const response = await apiClient.get("/automated-trading/status");
			const data = await response.json() as AutomatedBotStatus;
			setBotStatus(data);
		} catch (error) {
			console.error("Error to load bot status:", error);
		}
	};

	const loadConfig = async () => {
		try {
			const response = await apiClient.get("/automated-trading/config");
			const data = await response.json() as AutomatedTradingConfig;
			setConfig(data);
		} catch (error) {
			console.error("Error to load config:", error);
		}
	};

	const loadReport = async () => {
		try {
			const response = await apiClient.get("/automated-trading/report");
			const data = await response.json() as TradingReport;
			setReport(data);
		} catch (error) {
			console.error("Error to load report:", error);
		}
	};

	const startBot = async () => {
		setIsStarting(true);
		try {
			await apiClient.post("/automated-trading/start");
			toast.success("Automated bot started successfully!");
			loadBotStatus();
		} catch (error) {
			toast.error("Error to start automated bot");
			console.error("Error to start bot:", error);
		} finally {
			setIsStarting(false);
		}
	};

	const stopBot = async () => {
		setIsStopping(true);
		try {
			await apiClient.post("/automated-trading/stop");
			toast.success("Automated bot stopped successfully!");
			loadBotStatus();
		} catch (error) {
			toast.error("Error to stop automated bot");
			console.error("Error to stop bot:", error);
		} finally {
			setIsStopping(false);
		}
	};

	const formatSats = (sats: number) => {
		return `${(sats / 100000000).toFixed(8)} BTC`;
	};

	const formatUSD = (usd: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(usd);
	};

	const formatPercentage = (value: number) => {
		return `${(value * 100).toFixed(2)}%`;
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Automated Trading</h1>
						<p className="text-muted-foreground">
							Your automated agent for BTC trading
						</p>
					</div>
					<div className="flex items-center space-x-2">
						{botStatus?.is_running ? (
							<>
								<Badge variant="default" className="bg-green-500">
									<Zap className="w-3 h-3 mr-1" />
									Active
								</Badge>
								<Button
									variant="destructive"
									onClick={stopBot}
									disabled={isStopping}
								>
									{isStopping ? (
										<>Stopping...</>
									) : (
										<>
											<Square className="w-4 h-4 mr-2" />
											Stop Bot
										</>
									)}
								</Button>
							</>
						) : (
							<>
								<Badge variant="secondary">Inactive</Badge>
								<Button onClick={startBot} disabled={isStarting}>
									{isStarting ? (
										<>Starting...</>
									) : (
										<>
											<Play className="w-4 h-4 mr-2" />
											Start Bot
										</>
									)}
								</Button>
							</>
						)}
					</div>
				</div>

				{/* Status Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Current BTC Price
							</CardTitle>
							<Tooltip>
								<TooltipTrigger>
									<Info className="w-4 h-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Real-time Bitcoin price</p>
								</TooltipContent>
							</Tooltip>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{botStatus?.last_price
									? formatUSD(botStatus.last_price)
									: "N/A"}
							</div>
							<p className="text-xs text-muted-foreground">
								Last update:{" "}
								{botStatus?.last_update
									? new Date(botStatus.last_update).toLocaleString()
									: "N/A"}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Active Positions
							</CardTitle>
							<Tooltip>
								<TooltipTrigger>
									<Info className="w-4 h-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Number of open positions currently</p>
								</TooltipContent>
							</Tooltip>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{botStatus?.active_positions || 0}
							</div>
							<p className="text-xs text-muted-foreground">
								Máximo: {config?.max_positions || 0}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Net Profit
							</CardTitle>
							<Tooltip>
								<TooltipTrigger>
									<Info className="w-4 h-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Total profit after deduction of fees</p>
								</TooltipContent>
							</Tooltip>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{botStatus?.net_profit
									? formatSats(botStatus.net_profit)
									: "0 BTC"}
							</div>
							<p className="text-xs text-muted-foreground">
								Taxas: {botStatus?.total_fees
									? formatSats(botStatus.total_fees)
									: "0 BTC"}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Trades
							</CardTitle>
							<Tooltip>
								<TooltipTrigger>
									<Info className="w-4 h-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Total number of trades performed</p>
								</TooltipContent>
							</Tooltip>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{botStatus?.total_trades || 0}
							</div>
							<p className="text-xs text-muted-foreground">
								Taxa de sucesso: {report?.win_rate
									? formatPercentage(report.win_rate)
									: "N/A"}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="config">Configuration</TabsTrigger>
						<TabsTrigger value="report">Reports</TabsTrigger>
						<TabsTrigger value="monitoring">Monitoring</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Configuração Atual */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Settings className="w-5 h-5 mr-2" />
										Current Configuration
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="font-medium">Initial Margin:</span>
											<br />
											<span className="text-muted-foreground">
												{config?.initial_margin
													? formatSats(config.initial_margin)
													: "N/A"}
											</span>
										</div>
										<div>
											<span className="font-medium">Alavancagem:</span>
											<br />
											<span className="text-muted-foreground">
												{config?.max_leverage || 0}x
											</span>
										</div>
										<div>
											<span className="font-medium">Risco por Trade:</span>
											<br />
											<span className="text-muted-foreground">
												{config?.risk_percentage
													? `${config.risk_percentage}%`
													: "N/A"}
											</span>
										</div>
										<div>
											<span className="font-medium">
												Automatic Margin Addition:
											</span>
											<br />
											<span className="text-muted-foreground">
												{config?.auto_margin_addition ? "Yes" : "No"}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Status do Sistema */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Shield className="w-5 h-5 mr-2" />
										System Status
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm">Last Restructuring:</span>
											<span className="text-sm text-muted-foreground">
												{botStatus?.last_restructure
													? new Date(
															botStatus.last_restructure,
													  ).toLocaleString()
													: "N/A"}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Next Restructuring:</span>
											<span className="text-sm text-muted-foreground">
												{botStatus?.last_restructure && config?.restructure_interval
													? new Date(
															new Date(botStatus.last_restructure).getTime() +
																config.restructure_interval *
																	60 *
																	60 *
																	1000,
													  ).toLocaleString()
													: "N/A"}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Margin Protection:</span>
											<span className="text-sm text-muted-foreground">
												{config?.auto_margin_addition ? "Active" : "Inactive"}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="config" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Automated Bot Configuration</CardTitle>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm">
											<Info className="w-4 h-4 mr-2" />
											How to Configure
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>How to Configure the Bot</DialogTitle>
											<DialogDescription>
												Configure your automated bot to operate securely and
												efficiently:
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<div>
												<h4 className="font-medium">Initial Margin</h4>
												<p className="text-sm text-muted-foreground">
													Amount of BTC to start operations
												</p>
											</div>
											<div>
												<h4 className="font-medium">Leverage</h4>
												<p className="text-sm text-muted-foreground">
													Multiplicador de risco (maximum 100x)
												</p>
											</div>
											<div>
												<h4 className="font-medium">Risk per Trade</h4>
												<p className="text-sm text-muted-foreground">
													Percentage of capital at risk per operation
												</p>
											</div>
											<div>
												<h4 className="font-medium">
													Automatic Margin Addition
												</h4>
												<p className="text-sm text-muted-foreground">
													Add margin automatically to avoid liquidation
												</p>
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Current configuration loaded. To modify, contact the
									administrator.
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="report" className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Resumo de Performance */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<BarChart3 className="w-5 h-5 mr-2" />
										Performance Summary
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">
												{report?.winning_trades || 0}
											</div>
											<div className="text-sm text-muted-foreground">
												Trades Vencedores
											</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-red-600">
												{report?.losing_trades || 0}
											</div>
											<div className="text-sm text-muted-foreground">
												Losing Trades
											</div>
										</div>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold">
											{report?.win_rate
												? formatPercentage(report.win_rate)
												: "0%"}
										</div>
										<div className="text-sm text-muted-foreground">
											Success Rate
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Estatísticas Financeiras */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<DollarSign className="w-5 h-5 mr-2" />
										Financial Statistics
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">Total Volume:</span>
										<span className="text-sm font-medium">
											{report?.total_volume
												? formatUSD(report.total_volume)
												: "N/A"}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">P&L Total:</span>
										<span className="text-sm font-medium">
											{report?.total_pnl
												? formatSats(report.total_pnl)
												: "N/A"}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Total Fees:</span>
										<span className="text-sm font-medium">
											{report?.total_fees
												? formatSats(report.total_fees)
												: "N/A"}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Net P&L:</span>
										<span className="text-sm font-medium">
											{report?.net_pnl
												? formatSats(report.net_pnl)
												: "N/A"}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Average Trade Size:</span>
										<span className="text-sm font-medium">
											{report?.average_trade_size
												? formatUSD(report.average_trade_size)
												: "N/A"}
										</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="monitoring" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<AlertTriangle className="w-5 h-5 mr-2" />
									Real-time Monitoring
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
										<div className="flex items-center space-x-2">
											<Clock className="w-4 h-4" />
											<span>Last Update</span>
										</div>
										<span className="text-sm">
											{botStatus?.last_update
												? new Date(botStatus.last_update).toLocaleString()
												: "N/A"}
										</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
										<div className="flex items-center space-x-2">
											<TrendingUp className="w-4 h-4" />
											<span>Bot Status</span>
										</div>
										<Badge
											variant={
												botStatus?.is_running ? "default" : "secondary"
											}
										>
											{botStatus?.is_running ? "Active" : "Inactive"}
										</Badge>
									</div>
									<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
										<div className="flex items-center space-x-2">
											<Shield className="w-4 h-4" />
											<span>Margin Protection</span>
										</div>
										<Badge
											variant={
												config?.auto_margin_addition
													? "default"
													: "secondary"
											}
										>
											{config?.auto_margin_addition ? "Active" : "Inactive"}
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</TooltipProvider>
	);
};

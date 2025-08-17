"use client";

import type React from "react";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	useEntryAutomation,
	useMarginProtection,
	usePriceAlert,
	useTakeProfit,
} from "@/lib/hooks";
import { useTradingStore } from "@/lib/store";
import type {
	EntryAutomationRequest,
	MarginProtectionRequest,
	PriceAlertRequest,
	TakeProfitRequest,
} from "@/lib/types";

export const TradingConfig: React.FC = () => {
	const {
		setMarginProtection,
		setTakeProfit,
		setEntryAutomation,
		setPriceAlert,
	} = useTradingStore();

	const {
		config: marginConfig,
		updateConfig: updateMargin,
		isUpdating: isUpdatingMargin,
	} = useMarginProtection();
	const {
		config: takeProfitConfig,
		updateConfig: updateTakeProfit,
		isUpdating: isUpdatingTakeProfit,
	} = useTakeProfit();
	const {
		config: entryConfig,
		updateConfig: updateEntry,
		isUpdating: isUpdatingEntry,
	} = useEntryAutomation();
	const {
		config: alertConfig,
		updateConfig: updateAlert,
		isUpdating: isUpdatingAlert,
	} = usePriceAlert();

	const {
		register: registerMargin,
		handleSubmit: handleSubmitMargin,
		formState: { errors: errorsMargin },
		reset: resetMargin,
		watch: watchMargin,
	} = useForm();

	const {
		register: registerTakeProfit,
		handleSubmit: handleSubmitTakeProfit,
		formState: { errors: errorsTakeProfit },
		reset: resetTakeProfit,
		watch: watchTakeProfit,
	} = useForm();

	const {
		register: registerEntry,
		handleSubmit: handleSubmitEntry,
		formState: { errors: errorsEntry },
		reset: resetEntry,
		watch: watchEntry,
	} = useForm();

	const {
		register: registerAlert,
		handleSubmit: handleSubmitAlert,
		formState: { errors: errorsAlert },
		reset: resetAlert,
		watch: watchAlert,
	} = useForm();

	useEffect(() => {
		if (marginConfig) {
			resetMargin(marginConfig);
			setMarginProtection(marginConfig);
		}
	}, [marginConfig, resetMargin, setMarginProtection]);

	useEffect(() => {
		if (takeProfitConfig) {
			resetTakeProfit(takeProfitConfig);
			setTakeProfit(takeProfitConfig);
		}
	}, [takeProfitConfig, resetTakeProfit, setTakeProfit]);

	useEffect(() => {
		if (entryConfig) {
			resetEntry(entryConfig);
			setEntryAutomation(entryConfig);
		}
	}, [entryConfig, resetEntry, setEntryAutomation]);

	useEffect(() => {
		if (alertConfig) {
			resetAlert(alertConfig);
			setPriceAlert(alertConfig);
		}
	}, [alertConfig, resetAlert, setPriceAlert]);

	const onSubmitMargin = async (data: any) => {
		const body: MarginProtectionRequest = {
			is_enabled: data.is_enabled,
			activation_distance: parseFloat(data.activation_distance),
			new_liquidation_distance: parseFloat(data.new_liquidation_distance),
		};

		updateMargin(body, {
			onSuccess: (response: any) => {
				setMarginProtection(response);
			},
		});
	};

	const onSubmitTakeProfit = async (data: any) => {
		const body: TakeProfitRequest = {
			is_enabled: data.is_enabled,
			daily_percentage: parseFloat(data.daily_percentage),
		};

		updateTakeProfit(body, {
			onSuccess: (response: any) => {
				setTakeProfit(response);
			},
		});
	};

	const onSubmitEntry = async (data: any) => {
		const body: EntryAutomationRequest = {
			is_enabled: data.is_enabled,
			amount_per_order: parseFloat(data.amount_per_order),
			margin_per_order: parseInt(data.margin_per_order),
			number_of_orders: parseInt(data.number_of_orders),
			price_variation: parseFloat(data.price_variation),
			initial_price: parseFloat(data.initial_price),
			take_profit_per_order: parseFloat(data.take_profit_per_order),
			operation_type: data.operation_type,
			leverage: parseInt(data.leverage),
		};

		updateEntry(body, {
			onSuccess: (response: any) => {
				setEntryAutomation(response);
			},
		});
	};

	const onSubmitAlert = async (data: any) => {
		const body: PriceAlertRequest = {
			is_enabled: data.is_enabled,
			min_price: parseFloat(data.min_price),
			max_price: parseFloat(data.max_price),
			check_interval: parseInt(data.check_interval),
		};

		updateAlert(body, {
			onSuccess: (response: any) => {
				setPriceAlert(response);
			},
		});
	};

	const marginEnabledId = useId();
	const takeProfitEnabledId = useId();
	const entryEnabledId = useId();
	const alertEnabledId = useId();
	const activationDistanceId = useId();
	const newLiquidationDistanceId = useId();
	const dailyPercentageId = useId();
	const amountPerOrderId = useId();
	const marginPerOrderId = useId();
	const numberOfOrdersId = useId();
	const priceVariationId = useId();
	const initialPriceId = useId();
	const takeProfitPerOrderId = useId();
	const leverageId = useId();
	const minPriceId = useId();
	const maxPriceId = useId();
	const checkIntervalId = useId();

	return (
		<div className="space-y-6">
			{/* Margin Protection */}
			<Card>
				<CardHeader>
					<CardTitle>Margin Protection</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmitMargin(onSubmitMargin)}
						className="space-y-4"
					>
						<div className="flex items-center space-x-2">
							<Switch
								id={marginEnabledId}
								{...registerMargin("is_enabled")}
							/>
							<Label htmlFor={marginEnabledId}>Enable Margin Protection</Label>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="activation-distance">
									Activation Distance (%)
								</Label>
								<Input
									id={activationDistanceId}
									type="number"
									step="0.1"
									{...registerMargin("activation_distance", {
										required: "Activation distance is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="5.0"
								/>
								{errorsMargin.activation_distance && (
									<p className="text-sm text-destructive">
										{errorsMargin.activation_distance.message as string}
									</p>
								)}
								<p className="text-sm text-muted-foreground">
									Distance to liquidation to trigger protection
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="new-liquidation-distance">
									New Liquidation Distance (%)
								</Label>
								<Input
									id={newLiquidationDistanceId}
									type="number"
									step="0.1"
									{...registerMargin("new_liquidation_distance", {
										required: "New liquidation distance is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="10.0"
								/>
								{errorsMargin.new_liquidation_distance && (
									<p className="text-sm text-destructive">
										{errorsMargin.new_liquidation_distance.message as string}
									</p>
								)}
								<p className="text-sm text-muted-foreground">
									New distance to liquidation after protection
								</p>
							</div>
						</div>

						<Button type="submit" disabled={isUpdatingMargin}>
							{isUpdatingMargin ? "Saving..." : "Save Margin Protection"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Take Profit */}
			<Card>
				<CardHeader>
					<CardTitle>Take Profit Automation</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmitTakeProfit(onSubmitTakeProfit)}
						className="space-y-4"
					>
						<div className="flex items-center space-x-2">
							<Switch
								id={takeProfitEnabledId}
								{...registerTakeProfit("is_enabled")}
							/>
							<Label htmlFor="take-profit-enabled">
								Enable Take Profit Automation
							</Label>
						</div>

						<div className="space-y-2">
							<Label htmlFor="daily-percentage">
								Daily Percentage Increase (%)
							</Label>
							<Input
								id={dailyPercentageId}
								type="number"
								step="0.1"
								{...registerTakeProfit("daily_percentage", {
									required: "Daily percentage is required",
									min: { value: 0, message: "Must be positive" },
								})}
								placeholder="1.0"
							/>
							{errorsTakeProfit.daily_percentage && (
								<p className="text-sm text-destructive">
									{errorsTakeProfit.daily_percentage.message as string}
								</p>
							)}
							<p className="text-sm text-muted-foreground">
								Daily percentage increase for take profit
							</p>
						</div>

						<Button type="submit" disabled={isUpdatingTakeProfit}>
							{isUpdatingTakeProfit ? "Saving..." : "Save Take Profit Settings"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Entry Automation */}
			<Card>
				<CardHeader>
					<CardTitle>Entry Automation (DCA)</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmitEntry(onSubmitEntry)}
						className="space-y-4"
					>
						<div className="flex items-center space-x-2">
							<Switch id={entryEnabledId} {...registerEntry("is_enabled")} />
							<Label htmlFor="entry-enabled">Enable Entry Automation</Label>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="amount-per-order">Amount per Order (USD)</Label>
								<Input
									id={amountPerOrderId}
									type="number"
									step="0.01"
									{...registerEntry("amount_per_order", {
										required: "Amount per order is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="10.00"
								/>
								{errorsEntry.amount_per_order && (
									<p className="text-sm text-destructive">
										{errorsEntry.amount_per_order.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="margin-per-order">
									Margin per Order (sats)
								</Label>
								<Input
									id={marginPerOrderId}
									type="number"
									{...registerEntry("margin_per_order", {
										required: "Margin per order is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="855"
								/>
								{errorsEntry.margin_per_order && (
									<p className="text-sm text-destructive">
										{errorsEntry.margin_per_order.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="number-of-orders">Number of Orders</Label>
								<Input
									id={numberOfOrdersId}
									type="number"
									{...registerEntry("number_of_orders", {
										required: "Number of orders is required",
										min: { value: 1, message: "Must be at least 1" },
									})}
									placeholder="9"
								/>
								{errorsEntry.number_of_orders && (
									<p className="text-sm text-destructive">
										{errorsEntry.number_of_orders.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="price-variation">Price Variation (USD)</Label>
								<Input
									id={priceVariationId}
									type="number"
									step="0.01"
									{...registerEntry("price_variation", {
										required: "Price variation is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="50.00"
								/>
								{errorsEntry.price_variation && (
									<p className="text-sm text-destructive">
										{errorsEntry.price_variation.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="initial-price">Initial Price (USD)</Label>
								<Input
									id={initialPriceId}
									type="number"
									step="0.01"
									{...registerEntry("initial_price", {
										required: "Initial price is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="116000.00"
								/>
								{errorsEntry.initial_price && (
									<p className="text-sm text-destructive">
										{errorsEntry.initial_price.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="take-profit-per-order">
									Take Profit per Order (%)
								</Label>
								<Input
									id={takeProfitPerOrderId}
									type="number"
									step="0.01"
									{...registerEntry("take_profit_per_order", {
										required: "Take profit per order is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="0.25"
								/>
								{errorsEntry.take_profit_per_order && (
									<p className="text-sm text-destructive">
										{errorsEntry.take_profit_per_order.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="leverage">Leverage</Label>
								<Input
									    id={leverageId}
									type="number"
									{...registerEntry("leverage", {
										required: "Leverage is required",
										min: { value: 1, message: "Must be at least 1" },
									})}
									placeholder="10"
								/>
								{errorsEntry.leverage && (
									<p className="text-sm text-destructive">
										{errorsEntry.leverage.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="operation-type">Operation Type</Label>
								<Select {...registerEntry("operation_type")} defaultValue="buy">
									<SelectTrigger>
										<SelectValue placeholder="Select operation type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="buy">Buy</SelectItem>
										<SelectItem value="sell">Sell</SelectItem>
									</SelectContent>
								</Select>
								{errorsEntry.operation_type && (
									<p className="text-sm text-destructive">
										{errorsEntry.operation_type.message as string}
									</p>
								)}
							</div>
						</div>

						<Button type="submit" disabled={isUpdatingEntry}>
							{isUpdatingEntry ? "Saving..." : "Save Entry Automation"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Price Alert */}
			<Card>
				<CardHeader>
					<CardTitle>Price Alert</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmitAlert(onSubmitAlert)}
						className="space-y-4"
					>
						<div className="flex items-center space-x-2">
							<Switch id={alertEnabledId} {...registerAlert("is_enabled")} />
							<Label htmlFor={alertEnabledId}>Enable Price Alert</Label>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="min-price">Minimum Price (USD)</Label>
								<Input
									id={minPriceId}
									type="number"
									step="0.01"
									{...registerAlert("min_price", {
										required: "Minimum price is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="100000.00"
								/>
								{errorsAlert.min_price && (
									<p className="text-sm text-destructive">
										{errorsAlert.min_price.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="max-price">Maximum Price (USD)</Label>
								<Input
									id={maxPriceId}
									type="number"
									step="0.01"
									{...registerAlert("max_price", {
										required: "Maximum price is required",
										min: { value: 0, message: "Must be positive" },
									})}
									placeholder="120000.00"
								/>
								{errorsAlert.max_price && (
									<p className="text-sm text-destructive">
										{errorsAlert.max_price.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="check-interval">Check Interval (seconds)</Label>
								<Input
									id={checkIntervalId}
									type="number"
									{...registerAlert("check_interval", {
										required: "Check interval is required",
										min: { value: 1, message: "Must be at least 1 second" },
									})}
									placeholder="60"
								/>
								{errorsAlert.check_interval && (
									<p className="text-sm text-destructive">
										{errorsAlert.check_interval.message as string}
									</p>
								)}
							</div>
						</div>

						<Button type="submit" disabled={isUpdatingAlert}>
							{isUpdatingAlert ? "Saving..." : "Save Price Alert"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

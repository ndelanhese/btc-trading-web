"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEntryAutomation } from "@/lib/hooks";
import {
	type EntryAutomationFormData,
	entryAutomationSchema,
} from "@/lib/schemas";
import { useTradingStore } from "@/lib/store";
import type { EntryAutomation, EntryAutomationRequest } from "@/lib/types";

export const EntryAutomationForm: React.FC = () => {
	const { setEntryAutomation } = useTradingStore();
	const { config, updateConfig, isUpdating } = useEntryAutomation();

	const form = useForm<EntryAutomationFormData>({
		resolver: zodResolver(entryAutomationSchema),
		defaultValues: {
			enabled: false,
			entry_strategy: "market",
			position_size_percentage: 10,
			max_positions: 5,
			risk_per_trade: 2,
		},
	});

	useEffect(() => {
		if (config) {
			form.reset({
				enabled: config.is_enabled,
				entry_strategy:
					(config.operation_type as "market" | "limit" | "stop") || "market",
				position_size_percentage: config.amount_per_order || 10,
				max_positions: config.number_of_orders || 5,
				risk_per_trade: config.leverage || 2,
			});
			setEntryAutomation(config);
		}
	}, [config, form, setEntryAutomation]);

	const onSubmit = async (data: EntryAutomationFormData) => {
		const body: EntryAutomationRequest = {
			is_enabled: data.enabled,
			amount_per_order: data.position_size_percentage,
			margin_per_order: data.max_positions,
			number_of_orders: data.max_positions,
			price_variation: 0.1, // Default value
			initial_price: 0, // Will be set by market
			take_profit_per_order: 5, // Default value
			operation_type: data.entry_strategy,
			leverage: data.risk_per_trade,
		};

		updateConfig(body, {
			onSuccess: (response: EntryAutomation) => {
				setEntryAutomation(response);
			},
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Entry Automation</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="enabled"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Enable Entry Automation
										</FormLabel>
										<p className="text-sm text-muted-foreground">
											Automatically enter positions based on strategy
										</p>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onChange={field.onChange}
											disabled={isUpdating}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="entry_strategy"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Entry Strategy</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select entry strategy" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="market">Market</SelectItem>
											<SelectItem value="limit">Limit</SelectItem>
											<SelectItem value="stop">Stop</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="position_size_percentage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Position Size Percentage (%)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="10"
											disabled={isUpdating}
											{...field}
											onChange={(e) =>
												field.onChange(parseFloat(e.target.value) || 0)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="max_positions"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Max Positions</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="5"
											disabled={isUpdating}
											{...field}
											onChange={(e) =>
												field.onChange(parseFloat(e.target.value) || 0)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="risk_per_trade"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Risk Per Trade (%)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="2"
											disabled={isUpdating}
											{...field}
											onChange={(e) =>
												field.onChange(parseFloat(e.target.value) || 0)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isUpdating} className="w-full">
							{isUpdating ? "Saving..." : "Save Entry Automation"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

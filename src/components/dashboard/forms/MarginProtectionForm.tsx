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
import { Switch } from "@/components/ui/switch";
import { useMarginProtection } from "@/lib/hooks";
import {
	type MarginProtectionFormData,
	marginProtectionSchema,
} from "@/lib/schemas";
import { useTradingStore } from "@/lib/store";
import type { MarginProtection, MarginProtectionRequest } from "@/lib/types";

export const MarginProtectionForm: React.FC = () => {
	const { setMarginProtection } = useTradingStore();
	const { config, updateConfig, isUpdating } = useMarginProtection();

	const form = useForm<MarginProtectionFormData>({
		resolver: zodResolver(marginProtectionSchema),
		defaultValues: {
			enabled: false,
			max_margin_usage: 80,
			stop_loss_percentage: 10,
			auto_close_threshold: 5,
		},
	});

	useEffect(() => {
		if (config) {
			form.reset({
				enabled: config.is_enabled,
				max_margin_usage: config.activation_distance || 80,
				stop_loss_percentage: config.new_liquidation_distance || 10,
				auto_close_threshold: 5, // Default value if not in config
			});
			setMarginProtection(config);
		}
	}, [config, form, setMarginProtection]);

	const onSubmit = async (data: MarginProtectionFormData) => {
		const body: MarginProtectionRequest = {
			is_enabled: data.enabled,
			activation_distance: data.max_margin_usage,
			new_liquidation_distance: data.stop_loss_percentage,
		};

		updateConfig(body, {
			onSuccess: (response: MarginProtection) => {
				setMarginProtection(response);
			},
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Margin Protection</CardTitle>
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
											Enable Margin Protection
										</FormLabel>
										<p className="text-sm text-muted-foreground">
											Automatically manage margin to prevent liquidation
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
							name="max_margin_usage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Max Margin Usage (%)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="80"
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
							name="stop_loss_percentage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Stop Loss Percentage (%)</FormLabel>
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
							name="auto_close_threshold"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Auto Close Threshold (%)</FormLabel>
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

						<Button type="submit" disabled={isUpdating} className="w-full">
							{isUpdating ? "Saving..." : "Save Margin Protection"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

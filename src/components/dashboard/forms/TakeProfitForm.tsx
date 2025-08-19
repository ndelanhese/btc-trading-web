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
import { useTakeProfit } from "@/lib/hooks";
import { type TakeProfitFormData, takeProfitSchema } from "@/lib/schemas";
import { useTradingStore } from "@/lib/store";
import type { TakeProfit, TakeProfitRequest } from "@/lib/types";

export const TakeProfitForm: React.FC = () => {
	const { setTakeProfit } = useTradingStore();
	const { config, updateConfig, isUpdating } = useTakeProfit();

	const form = useForm<TakeProfitFormData>({
		resolver: zodResolver(takeProfitSchema),
		defaultValues: {
			enabled: false,
			profit_target_percentage: 5,
			trailing_stop_percentage: 2,
			auto_close_on_target: true,
		},
	});

	useEffect(() => {
		if (config) {
			form.reset({
				enabled: config.is_enabled,
				profit_target_percentage: config.daily_percentage || 5,
				trailing_stop_percentage: 2, // Default value if not in config
				auto_close_on_target: true, // Default value if not in config
			});
			setTakeProfit(config);
		}
	}, [config, form, setTakeProfit]);

	const onSubmit = async (data: TakeProfitFormData) => {
		const body: TakeProfitRequest = {
			is_enabled: data.enabled,
			daily_percentage: data.profit_target_percentage,
		};

		updateConfig(body, {
			onSuccess: (response: TakeProfit) => {
				setTakeProfit(response);
			},
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Take Profit</CardTitle>
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
											Enable Take Profit
										</FormLabel>
										<p className="text-sm text-muted-foreground">
											Automatically close positions when profit target is
											reached
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
							name="profit_target_percentage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Profit Target Percentage (%)</FormLabel>
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
							name="trailing_stop_percentage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Trailing Stop Percentage (%)</FormLabel>
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

						<FormField
							control={form.control}
							name="auto_close_on_target"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Auto Close on Target
										</FormLabel>
										<p className="text-sm text-muted-foreground">
											Automatically close position when profit target is reached
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

						<Button type="submit" disabled={isUpdating} className="w-full">
							{isUpdating ? "Saving..." : "Save Take Profit"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

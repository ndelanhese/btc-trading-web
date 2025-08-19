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
import { usePriceAlert } from "@/lib/hooks";
import { type PriceAlertFormData, priceAlertSchema } from "@/lib/schemas";
import { useTradingStore } from "@/lib/store";
import type { PriceAlert, PriceAlertRequest } from "@/lib/types";

export const PriceAlertForm: React.FC = () => {
	const { setPriceAlert } = useTradingStore();
	const { config, updateConfig, isUpdating } = usePriceAlert();

	const form = useForm<PriceAlertFormData>({
		resolver: zodResolver(priceAlertSchema),
		defaultValues: {
			enabled: false,
			alert_price: 50000,
			alert_type: "above",
			notification_method: "email",
			repeat_alerts: false,
		},
	});

	useEffect(() => {
		if (config) {
			form.reset({
				enabled: config.is_enabled,
				alert_price: config.min_price || 50000,
				alert_type: "above" as const, // Default value if not in config
				notification_method: "email" as const, // Default value if not in config
				repeat_alerts: false, // Default value if not in config
			});
			setPriceAlert(config);
		}
	}, [config, form, setPriceAlert]);

	const onSubmit = async (data: PriceAlertFormData) => {
		const body: PriceAlertRequest = {
			is_enabled: data.enabled,
			min_price: data.alert_price,
			max_price: data.alert_price + 1000, // Default range
			check_interval: 60, // Default 1 minute
		};

		updateConfig(body, {
			onSuccess: (response: PriceAlert) => {
				setPriceAlert(response);
			},
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Price Alert</CardTitle>
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
											Enable Price Alert
										</FormLabel>
										<p className="text-sm text-muted-foreground">
											Get notified when price reaches target levels
										</p>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isUpdating}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="alert_price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Alert Price (USD)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="50000"
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
							name="alert_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Alert Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select alert type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="above">Above Price</SelectItem>
											<SelectItem value="below">Below Price</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="notification_method"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notification Method</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select notification method" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="email">Email</SelectItem>
											<SelectItem value="push">Push Notification</SelectItem>
											<SelectItem value="both">Both</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="repeat_alerts"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Repeat Alerts</FormLabel>
										<p className="text-sm text-muted-foreground">
											Send multiple alerts for the same price level
										</p>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isUpdating}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isUpdating} className="w-full">
							{isUpdating ? "Saving..." : "Save Price Alert"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

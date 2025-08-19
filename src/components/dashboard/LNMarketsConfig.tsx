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
import { useLNMarketsConfig } from "@/lib/hooks";
import {
	type LNMarketsConfigFormData,
	lnMarketsConfigSchema,
} from "@/lib/schemas";
import { useTradingStore } from "@/lib/store";
import type { LNMarketsConfig, LNMarketsConfigRequest } from "@/lib/types";

export const LNMarketsConfigForm: React.FC = () => {
	const { setLNMarketsConfig } = useTradingStore();
	const { config, updateConfig, isUpdating } = useLNMarketsConfig();

	const form = useForm<LNMarketsConfigFormData>({
		resolver: zodResolver(lnMarketsConfigSchema),
		defaultValues: {
			api_key: "",
			secret_key: "",
			passphrase: "",
			is_testnet: false,
		},
	});

	useEffect(() => {
		if (config) {
			form.reset(config);
			setLNMarketsConfig(config);
		}
	}, [config, form, setLNMarketsConfig]);

	const onSubmit = async (data: LNMarketsConfigFormData) => {
		const body: LNMarketsConfigRequest = {
			api_key: data.api_key,
			secret_key: data.secret_key,
			passphrase: data.passphrase,
			is_testnet: data.is_testnet,
		};

		updateConfig(body, {
			onSuccess: (response: LNMarketsConfig) => {
				setLNMarketsConfig(response);
			},
		});
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>LN Markets API Configuration</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="api_key"
								render={({ field }) => (
									<FormItem>
										<FormLabel>API Key</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your LN Markets API key"
												disabled={isUpdating}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="secret_key"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Secret Key</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your LN Markets secret key"
												disabled={isUpdating}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="passphrase"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Passphrase</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your LN Markets passphrase"
												disabled={isUpdating}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="is_testnet"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Use Testnet</FormLabel>
											<p className="text-sm text-muted-foreground">
												Enable testnet mode for development and testing
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
								{isUpdating ? "Saving..." : "Save Configuration"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

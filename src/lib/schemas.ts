import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
	.object({
		username: z.string().min(3, "Username must be at least 3 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

// LN Markets Configuration Schema
export const lnMarketsConfigSchema = z.object({
	api_key: z.string().min(1, "API key is required"),
	secret_key: z.string().min(1, "Secret key is required"),
	passphrase: z.string().min(1, "Passphrase is required"),
	is_testnet: z.boolean(),
});

// Trading Configuration Schemas
export const marginProtectionSchema = z.object({
	enabled: z.boolean(),
	max_margin_usage: z
		.number()
		.min(0)
		.max(100, "Margin usage must be between 0 and 100"),
	stop_loss_percentage: z
		.number()
		.min(0)
		.max(100, "Stop loss must be between 0 and 100"),
	auto_close_threshold: z
		.number()
		.min(0, "Auto close threshold must be positive"),
});

export const takeProfitSchema = z.object({
	enabled: z.boolean(),
	profit_target_percentage: z.number().min(0, "Profit target must be positive"),
	trailing_stop_percentage: z
		.number()
		.min(0)
		.max(100, "Trailing stop must be between 0 and 100"),
	auto_close_on_target: z.boolean(),
});

export const entryAutomationSchema = z.object({
	enabled: z.boolean(),
	entry_strategy: z.enum(["market", "limit", "stop"]),
	position_size_percentage: z
		.number()
		.min(0)
		.max(100, "Position size must be between 0 and 100"),
	max_positions: z.number().min(1, "Max positions must be at least 1"),
	risk_per_trade: z
		.number()
		.min(0)
		.max(100, "Risk per trade must be between 0 and 100"),
});

export const priceAlertSchema = z.object({
	enabled: z.boolean(),
	alert_price: z.number().min(0, "Alert price must be positive"),
	alert_type: z.enum(["above", "below"]),
	notification_method: z.enum(["email", "push", "both"]),
	repeat_alerts: z.boolean(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LNMarketsConfigFormData = z.infer<typeof lnMarketsConfigSchema>;
export type MarginProtectionFormData = z.infer<typeof marginProtectionSchema>;
export type TakeProfitFormData = z.infer<typeof takeProfitSchema>;
export type EntryAutomationFormData = z.infer<typeof entryAutomationSchema>;
export type PriceAlertFormData = z.infer<typeof priceAlertSchema>;

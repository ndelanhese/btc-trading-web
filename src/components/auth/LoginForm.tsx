"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { useAuth } from "@/lib/hooks";
import { type LoginFormData, loginSchema } from "@/lib/schemas";
import { useAuthStore } from "@/lib/store";
import type { ApiError, LoginResponse } from "@/lib/types";

export const LoginForm: React.FC = () => {
	const router = useRouter();
	const login = useAuthStore((state) => state.login);
	const { login: loginUser, isLoggingIn } = useAuth();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			loginUser(data, {
				onSuccess: async (response: LoginResponse) => {
					try {
						const { token, refresh_token, user } = response;
						if (token && user) {
							await login(user, token, refresh_token);
							toast.success("Login successful!");
							router.push("/dashboard");
						} else {
							toast.error("Invalid response from server");
						}
					} catch (error) {
						console.error("Failed to store authentication data:", error);
						toast.error("Failed to complete login. Please try again.");
					}
				},
				onError: (error: ApiError) => {
					console.error("Login error:", error);
					toast.error(
						error?.message || "Login failed. Please check your credentials.",
					);
				},
			});
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error("An unexpected error occurred. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight">
						Sign in to your account
					</h2>
					<p className="text-muted-foreground mt-2">
						Or{" "}
						<Link
							href="/register"
							className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 cursor-pointer"
						>
							create a new account
						</Link>
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Login</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your username"
													disabled={isLoggingIn}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter your password"
													disabled={isLoggingIn}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full" disabled={isLoggingIn}>
									{isLoggingIn ? "Signing in..." : "Sign in"}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

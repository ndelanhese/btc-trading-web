"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";

interface LoginFormData {
	username: string;
	password: string;
}

export const LoginForm: React.FC = () => {
	const router = useRouter();
	const login = useAuthStore((state) => state.login);
	const { login: loginUser, isLoggingIn } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>();

	const onSubmit = async (data: LoginFormData) => {
		loginUser(data, {
			onSuccess: (response: any) => {
				const { token, user } = response;
				login(user, token);
				toast.success("Login successful!");
				router.push("/dashboard");
			},
		});
	};

	const usernameId = useId();
	const passwordId = useId();

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
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id={usernameId}
									type="text"
									{...register("username", {
										required: "Username is required",
									})}
									placeholder="Enter your username"
								/>
								{errors.username && (
									<p className="text-sm text-destructive">
										{errors.username.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id={passwordId}
									type="password"
									{...register("password", {
										required: "Password is required",
									})}
									placeholder="Enter your password"
								/>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>

							<Button type="submit" disabled={isLoggingIn} className="w-full">
								{isLoggingIn ? "Signing in..." : "Sign in"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

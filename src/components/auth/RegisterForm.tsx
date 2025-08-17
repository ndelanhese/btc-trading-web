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

interface RegisterFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
	const router = useRouter();
	const { register: registerUser, isRegistering } = useAuth();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterFormData>();

	const password = watch("password");

	const onSubmit = async (data: RegisterFormData) => {
		registerUser(
			{
				username: data.username,
				email: data.email,
				password: data.password,
			},
			{
				onSuccess: () => {
					toast.success("Registration successful! Please log in.");
					router.push("/login");
				},
			},
		);
	};

	const usernameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight">
						Create your account
					</h2>
					<p className="text-muted-foreground mt-2">
						Or{" "}
						<Link
							href="/login"
							className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 cursor-pointer"
						>
							sign in to your existing account
						</Link>
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Register</CardTitle>
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
										minLength: {
											value: 3,
											message: "Username must be at least 3 characters",
										},
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
								<Label htmlFor="email">Email</Label>
								<Input
									id={emailId}
									type="email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email address",
										},
									})}
									placeholder="Enter your email"
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
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
										minLength: {
											value: 6,
											message: "Password must be at least 6 characters",
										},
									})}
									placeholder="Enter your password"
								/>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id={confirmPasswordId}
									type="password"
									{...register("confirmPassword", {
										required: "Please confirm your password",
										validate: (value) =>
											value === password || "Passwords do not match",
									})}
									placeholder="Confirm your password"
								/>
								{errors.confirmPassword && (
									<p className="text-sm text-destructive">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>

							<Button type="submit" disabled={isRegistering} className="w-full">
								{isRegistering ? "Creating account..." : "Create account"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

import type React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BotStatusProps {
	status: "running" | "stopped" | "error" | null;
}

export const BotStatus: React.FC<BotStatusProps> = ({ status }) => {
	const getStatusConfig = () => {
		switch (status) {
			case "running":
				return {
					label: "Running",
					variant: "default" as const,
					className: "bg-green-500 hover:bg-green-500",
				};
			case "stopped":
				return {
					label: "Stopped",
					variant: "secondary" as const,
					className: "",
				};
			case "error":
				return {
					label: "Error",
					variant: "destructive" as const,
					className: "",
				};
			default:
				return {
					label: "Unknown",
					variant: "outline" as const,
					className: "",
				};
		}
	};

	const config = getStatusConfig();

	return (
		<div className="flex items-center space-x-2">
			<Badge variant={config.variant} className={cn(config.className)}>
				{config.label}
			</Badge>
		</div>
	);
};

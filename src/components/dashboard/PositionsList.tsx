import { Edit, TrendingDown, TrendingUp, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { usePositionOperations } from "@/lib/hooks";
import type { Position } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PositionsListProps {
	positions: Position[];
	onUpdate: () => void;
}

export const PositionsList: React.FC<PositionsListProps> = ({
	positions,
	onUpdate,
}) => {
	const [editingPosition, setEditingPosition] = useState<string | null>(null);
	const [takeProfitPrice, setTakeProfitPrice] = useState("");
	const [stopLossPrice, setStopLossPrice] = useState("");
	const {
		closePosition,
		updateTakeProfit,
		updateStopLoss,
		isClosing,
		isUpdatingTakeProfit,
		isUpdatingStopLoss,
	} = usePositionOperations();

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(num);
	};

	const handleClosePosition = (positionId: string) => {
		closePosition(
			{ id: positionId },
			{
				onSuccess: () => {
					onUpdate();
				},
			},
		);
	};

	const handleUpdateTakeProfit = (positionId: string) => {
		updateTakeProfit(
			{ id: positionId, take_profit: parseFloat(takeProfitPrice) },
			{
				onSuccess: () => {
					setEditingPosition(null);
					setTakeProfitPrice("");
					onUpdate();
				},
			},
		);
	};

	const handleUpdateStopLoss = (positionId: string) => {
		updateStopLoss(
			{ id: positionId, stop_loss: parseFloat(stopLossPrice) },
			{
				onSuccess: () => {
					setEditingPosition(null);
					setStopLossPrice("");
					onUpdate();
				},
			},
		);
	};

	if (!positions || positions.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
				<p>No active positions</p>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Type</TableHead>
						<TableHead>Size</TableHead>
						<TableHead>Entry Price</TableHead>
						<TableHead>Current Price</TableHead>
						<TableHead>P&L</TableHead>
						<TableHead>Take Profit</TableHead>
						<TableHead>Stop Loss</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{positions.map((position) => (
						<TableRow key={position.id}>
							<TableCell>
								<div className="flex items-center space-x-2">
									{position.side === "long" ? (
										<TrendingUp className="h-4 w-4 text-green-500" />
									) : (
										<TrendingDown className="h-4 w-4 text-red-500" />
									)}
									<span className="capitalize font-medium">
										{position.side}
									</span>
								</div>
							</TableCell>
							<TableCell>{formatNumber(position.size || 0)}</TableCell>
							<TableCell>{formatCurrency(position.entry_price || 0)}</TableCell>
							<TableCell>
								{formatCurrency(position.current_price || 0)}
							</TableCell>
							<TableCell>
								<span
									className={cn(
										"font-medium",
										(position.unrealized_pnl || 0) >= 0
											? "text-green-600"
											: "text-red-600",
									)}
								>
									{formatCurrency(position.unrealized_pnl || 0)}
								</span>
							</TableCell>
							<TableCell>
								{editingPosition === `${position.id}-tp` ? (
									<div className="flex items-center space-x-2">
										<Input
											type="number"
											value={takeProfitPrice}
											onChange={(e) => setTakeProfitPrice(e.target.value)}
											className="w-20"
											placeholder="Price"
										/>
										<Button
											size="sm"
											onClick={() => handleUpdateTakeProfit(position.id || "")}
											disabled={isUpdatingTakeProfit}
										>
											{isUpdatingTakeProfit ? "Saving..." : "Save"}
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setEditingPosition(null)}
										>
											Cancel
										</Button>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<span>{formatCurrency(position.take_profit || 0)}</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setEditingPosition(`${position.id}-tp`)}
										>
											<Edit className="h-4 w-4" />
										</Button>
									</div>
								)}
							</TableCell>
							<TableCell>
								{editingPosition === `${position.id}-sl` ? (
									<div className="flex items-center space-x-2">
										<Input
											type="number"
											value={stopLossPrice}
											onChange={(e) => setStopLossPrice(e.target.value)}
											className="w-20"
											placeholder="Price"
										/>
										<Button
											size="sm"
											onClick={() => handleUpdateStopLoss(position.id || "")}
											disabled={isUpdatingStopLoss}
										>
											{isUpdatingStopLoss ? "Saving..." : "Save"}
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setEditingPosition(null)}
										>
											Cancel
										</Button>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<span>{formatCurrency(position.stop_loss || 0)}</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setEditingPosition(`${position.id}-sl`)}
										>
											<Edit className="h-4 w-4" />
										</Button>
									</div>
								)}
							</TableCell>
							<TableCell>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleClosePosition(position.id || "")}
									disabled={isClosing}
								>
									<X className="h-4 w-4 mr-1" />
									{isClosing ? "Closing..." : "Close"}
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

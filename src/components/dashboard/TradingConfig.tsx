"use client";

import type React from "react";
import {
	EntryAutomationForm,
	MarginProtectionForm,
	PriceAlertForm,
	TakeProfitForm,
} from "./forms";

export const TradingConfig: React.FC = () => {
	return (
		<div className="space-y-6">
			<MarginProtectionForm />
			<TakeProfitForm />
			<EntryAutomationForm />
			<PriceAlertForm />
		</div>
	);
};

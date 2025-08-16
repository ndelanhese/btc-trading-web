'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { tradingConfigAPI } from '@/lib/api';
import { useTradingStore } from '@/lib/store';

export const TradingConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setMarginProtection, setTakeProfit, setEntryAutomation, setPriceAlert } = useTradingStore();
  const { toast } = useToast();

  const {
    register: registerMargin,
    handleSubmit: handleSubmitMargin,
    formState: { errors: errorsMargin },
    reset: resetMargin,
    watch: watchMargin,
  } = useForm();

  const {
    register: registerTakeProfit,
    handleSubmit: handleSubmitTakeProfit,
    formState: { errors: errorsTakeProfit },
    reset: resetTakeProfit,
    watch: watchTakeProfit,
  } = useForm();

  const {
    register: registerEntry,
    handleSubmit: handleSubmitEntry,
    formState: { errors: errorsEntry },
    reset: resetEntry,
    watch: watchEntry,
  } = useForm();

  const {
    register: registerAlert,
    handleSubmit: handleSubmitAlert,
    formState: { errors: errorsAlert },
    reset: resetAlert,
    watch: watchAlert,
  } = useForm();

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      // Load all configurations
      const [marginRes, takeProfitRes, entryRes, alertRes] = await Promise.all([
        tradingConfigAPI.getMarginProtection(),
        tradingConfigAPI.getTakeProfit(),
        tradingConfigAPI.getEntryAutomation(),
        tradingConfigAPI.getPriceAlert(),
      ]);

      // Reset forms with current values
      resetMargin(marginRes.data);
      resetTakeProfit(takeProfitRes.data);
      resetEntry(entryRes.data);
      resetAlert(alertRes.data);

      // Update store
      setMarginProtection(marginRes.data);
      setTakeProfit(takeProfitRes.data);
      setEntryAutomation(entryRes.data);
      setPriceAlert(alertRes.data);
    } catch (error) {
      console.error('Error loading configurations:', error);
    }
  };

  const onSubmitMargin = async (data: any) => {
    setLoading(true);
    try {
      const response = await tradingConfigAPI.setMarginProtection(data);
      setMarginProtection(response.data);
      toast({
        title: "Success",
        description: "Margin protection updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to update margin protection',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitTakeProfit = async (data: any) => {
    setLoading(true);
    try {
      const response = await tradingConfigAPI.setTakeProfit(data);
      setTakeProfit(response.data);
      toast({
        title: "Success",
        description: "Take profit settings updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to update take profit settings',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitEntry = async (data: any) => {
    setLoading(true);
    try {
      const response = await tradingConfigAPI.setEntryAutomation(data);
      setEntryAutomation(response.data);
      toast({
        title: "Success",
        description: "Entry automation updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to update entry automation',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAlert = async (data: any) => {
    setLoading(true);
    try {
      const response = await tradingConfigAPI.setPriceAlert(data);
      setPriceAlert(response.data);
      toast({
        title: "Success",
        description: "Price alert updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to update price alert',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Margin Protection */}
      <Card>
        <CardHeader>
          <CardTitle>Margin Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitMargin(onSubmitMargin)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="margin-enabled"
                {...registerMargin('is_enabled')}
              />
              <Label htmlFor="margin-enabled">Enable Margin Protection</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activation-distance">Activation Distance (%)</Label>
                <Input
                  id="activation-distance"
                  type="number"
                  step="0.1"
                  {...registerMargin('activation_distance', { 
                    required: 'Activation distance is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="5.0"
                />
                {errorsMargin.activation_distance && (
                  <p className="text-sm text-destructive">{errorsMargin.activation_distance.message as string}</p>
                )}
                <p className="text-sm text-muted-foreground">Distance to liquidation to trigger protection</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-liquidation-distance">New Liquidation Distance (%)</Label>
                <Input
                  id="new-liquidation-distance"
                  type="number"
                  step="0.1"
                  {...registerMargin('new_liquidation_distance', { 
                    required: 'New liquidation distance is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="10.0"
                />
                {errorsMargin.new_liquidation_distance && (
                  <p className="text-sm text-destructive">{errorsMargin.new_liquidation_distance.message as string}</p>
                )}
                <p className="text-sm text-muted-foreground">New distance to liquidation after protection</p>
              </div>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Margin Protection"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Take Profit */}
      <Card>
        <CardHeader>
          <CardTitle>Take Profit Automation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitTakeProfit(onSubmitTakeProfit)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="take-profit-enabled"
                {...registerTakeProfit('is_enabled')}
              />
              <Label htmlFor="take-profit-enabled">Enable Take Profit Automation</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="daily-percentage">Daily Percentage Increase (%)</Label>
              <Input
                id="daily-percentage"
                type="number"
                step="0.1"
                {...registerTakeProfit('daily_percentage', { 
                  required: 'Daily percentage is required',
                  min: { value: 0, message: 'Must be positive' }
                })}
                placeholder="1.0"
              />
                              {errorsTakeProfit.daily_percentage && (
                  <p className="text-sm text-destructive">{errorsTakeProfit.daily_percentage.message as string}</p>
                )}
              <p className="text-sm text-muted-foreground">Daily percentage increase for take profit</p>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Take Profit Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Entry Automation */}
      <Card>
        <CardHeader>
          <CardTitle>Entry Automation (DCA)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitEntry(onSubmitEntry)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="entry-enabled"
                {...registerEntry('is_enabled')}
              />
              <Label htmlFor="entry-enabled">Enable Entry Automation</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount-per-order">Amount per Order (USD)</Label>
                <Input
                  id="amount-per-order"
                  type="number"
                  step="0.01"
                  {...registerEntry('amount_per_order', { 
                    required: 'Amount per order is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="10.00"
                />
                {errorsEntry.amount_per_order && (
                  <p className="text-sm text-destructive">{errorsEntry.amount_per_order.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="margin-per-order">Margin per Order (sats)</Label>
                <Input
                  id="margin-per-order"
                  type="number"
                  {...registerEntry('margin_per_order', { 
                    required: 'Margin per order is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="855"
                />
                {errorsEntry.margin_per_order && (
                  <p className="text-sm text-destructive">{errorsEntry.margin_per_order.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="number-of-orders">Number of Orders</Label>
                <Input
                  id="number-of-orders"
                  type="number"
                  {...registerEntry('number_of_orders', { 
                    required: 'Number of orders is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  placeholder="9"
                />
                {errorsEntry.number_of_orders && (
                  <p className="text-sm text-destructive">{errorsEntry.number_of_orders.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price-variation">Price Variation (USD)</Label>
                <Input
                  id="price-variation"
                  type="number"
                  step="0.01"
                  {...registerEntry('price_variation', { 
                    required: 'Price variation is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="50.00"
                />
                {errorsEntry.price_variation && (
                  <p className="text-sm text-destructive">{errorsEntry.price_variation.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="initial-price">Initial Price (USD)</Label>
                <Input
                  id="initial-price"
                  type="number"
                  step="0.01"
                  {...registerEntry('initial_price', { 
                    required: 'Initial price is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="116000.00"
                />
                {errorsEntry.initial_price && (
                  <p className="text-sm text-destructive">{errorsEntry.initial_price.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="take-profit-per-order">Take Profit per Order (%)</Label>
                <Input
                  id="take-profit-per-order"
                  type="number"
                  step="0.01"
                  {...registerEntry('take_profit_per_order', { 
                    required: 'Take profit per order is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="0.25"
                />
                {errorsEntry.take_profit_per_order && (
                  <p className="text-sm text-destructive">{errorsEntry.take_profit_per_order.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leverage">Leverage</Label>
                <Input
                  id="leverage"
                  type="number"
                  {...registerEntry('leverage', { 
                    required: 'Leverage is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  placeholder="10"
                />
                {errorsEntry.leverage && (
                  <p className="text-sm text-destructive">{errorsEntry.leverage.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operation-type">Operation Type</Label>
                <Select {...registerEntry('operation_type')} defaultValue="buy">
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
                {errorsEntry.operation_type && (
                  <p className="text-sm text-destructive">{errorsEntry.operation_type.message as string}</p>
                )}
              </div>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Entry Automation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Price Alert */}
      <Card>
        <CardHeader>
          <CardTitle>Price Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitAlert(onSubmitAlert)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="alert-enabled"
                {...registerAlert('is_enabled')}
              />
              <Label htmlFor="alert-enabled">Enable Price Alert</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-price">Minimum Price (USD)</Label>
                <Input
                  id="min-price"
                  type="number"
                  step="0.01"
                  {...registerAlert('min_price', { 
                    required: 'Minimum price is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="100000.00"
                />
                {errorsAlert.min_price && (
                  <p className="text-sm text-destructive">{errorsAlert.min_price.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-price">Maximum Price (USD)</Label>
                <Input
                  id="max-price"
                  type="number"
                  step="0.01"
                  {...registerAlert('max_price', { 
                    required: 'Maximum price is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  placeholder="120000.00"
                />
                {errorsAlert.max_price && (
                  <p className="text-sm text-destructive">{errorsAlert.max_price.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="check-interval">Check Interval (seconds)</Label>
                <Input
                  id="check-interval"
                  type="number"
                  {...registerAlert('check_interval', { 
                    required: 'Check interval is required',
                    min: { value: 1, message: 'Must be at least 1 second' }
                  })}
                  placeholder="60"
                />
                {errorsAlert.check_interval && (
                  <p className="text-sm text-destructive">{errorsAlert.check_interval.message as string}</p>
                )}
              </div>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Price Alert"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

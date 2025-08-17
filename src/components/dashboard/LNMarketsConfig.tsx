'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useLNMarketsConfig } from '@/lib/hooks';
import { useAuthStore, useTradingStore } from '@/lib/store';
import type { LNMarketsConfigRequest } from '@/lib/types';

export const LNMarketsConfig: React.FC = () => {
  const { setLNMarketsConfig } = useTradingStore();
  const { user } = useAuthStore();
  const { config, updateConfig, isUpdating } = useLNMarketsConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (config) {
      reset(config);
      setLNMarketsConfig(config);
    }
  }, [config, reset, setLNMarketsConfig]);

  const onSubmit = async (data: any) => {
    const body: LNMarketsConfigRequest = {
      api_key: data.api_key,
      secret_key: data.secret_key,
      passphrase: data.passphrase,
      is_testnet: data.is_testnet || false,
    };

    updateConfig(body, {
      onSuccess: (response: any) => {
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                {...register('api_key', { required: 'API key is required' })}
                placeholder="Enter your LN Markets API key"
              />
              {errors.api_key && (
                <p className="text-sm text-destructive">{errors.api_key.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secret-key">Secret Key</Label>
              <Input
                id="secret-key"
                type="password"
                {...register('secret_key', { required: 'Secret key is required' })}
                placeholder="Enter your LN Markets secret key"
              />
              {errors.secret_key && (
                <p className="text-sm text-destructive">{errors.secret_key.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passphrase">Passphrase</Label>
              <Input
                id="passphrase"
                type="password"
                {...register('passphrase', { required: 'Passphrase is required' })}
                placeholder="Enter your LN Markets passphrase"
              />
              {errors.passphrase && (
                <p className="text-sm text-destructive">{errors.passphrase.message as string}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="testnet"
                {...register('is_testnet')}
              />
              <Label htmlFor="testnet">Use Testnet</Label>
            </div>
            
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Configuration"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {config && (
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">API Key:</span>
                <span className="text-sm font-mono">
                  {config.api_key ? `${config.api_key.substring(0, 8)}...` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Secret Key:</span>
                <span className="text-sm font-mono">
                  {config.secret_key ? `${config.secret_key.substring(0, 8)}...` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Passphrase:</span>
                <span className="text-sm font-mono">
                  {config.passphrase ? `${config.passphrase.substring(0, 8)}...` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Testnet:</span>
                <span className="text-sm">
                  {config.is_testnet ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

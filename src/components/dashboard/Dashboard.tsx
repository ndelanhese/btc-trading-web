'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Square,
  User,
  Wallet,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useTradingStore } from '@/lib/store';
import { botAPI, tradingAPI } from '@/lib/api';
import { BotStatus } from './BotStatus';
import { AccountBalance } from './AccountBalance';
import { PositionsList } from './PositionsList';
import { TradingConfig } from './TradingConfig';
import { LNMarketsConfig } from './LNMarketsConfig';

export const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const { 
    botStatus, 
    accountBalance, 
    positions,
    setBotStatus,
    setAccountBalance,
    setPositions
  } = useTradingStore();
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Load initial data
    loadDashboardData();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadDashboardData, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  const loadDashboardData = async () => {
    try {
      // Load bot status
      const statusResponse = await botAPI.getStatus();
      setBotStatus(statusResponse.data.status);
      
      // Load account balance
      const balanceResponse = await tradingAPI.getAccountBalance();
      setAccountBalance(balanceResponse.data);
      
      // Load positions
      const positionsResponse = await tradingAPI.getPositions();
      setPositions(positionsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleStartBot = async () => {
    setLoading(true);
    try {
      await botAPI.start();
      setBotStatus('running');
      toast({
        title: "Success",
        description: "Bot started successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to start bot',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStopBot = async () => {
    setLoading(true);
    try {
      await botAPI.stop();
      setBotStatus('stopped');
      toast({
        title: "Success",
        description: "Bot stopped successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to stop bot',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">
                BTC Trading Bot
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="lnmarkets" className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>LN Markets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Bot Control */}
            <Card>
              <CardHeader>
                <CardTitle>Bot Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <BotStatus status={botStatus} />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleStartBot}
                      disabled={loading || botStatus === 'running'}
                      className="flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Bot</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleStopBot}
                      disabled={loading || botStatus === 'stopped'}
                      className="flex items-center space-x-2"
                    >
                      <Square className="h-4 w-4" />
                      <span>Stop Bot</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Account Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountBalance balance={accountBalance} />
              </CardContent>
            </Card>

            {/* Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <PositionsList positions={positions} onUpdate={loadDashboardData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config">
            <TradingConfig />
          </TabsContent>

          <TabsContent value="lnmarkets">
            <LNMarketsConfig />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

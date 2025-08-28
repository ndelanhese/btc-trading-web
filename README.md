# BTC Trading Bot Web Interface

A modern, responsive web interface for the BTC Trading Bot that provides comprehensive control over all trading features through an intuitive dashboard.

## 🚀 Features

### Authentication
- **User Registration**: Create new accounts with email verification
- **User Login**: Secure JWT-based authentication
- **Session Management**: Persistent login sessions

### Dashboard Overview
- **Real-time Bot Status**: Monitor bot running/stopped status
- **Account Balance**: View total, available, and margin balances
- **Active Positions**: Manage and monitor all trading positions
- **Profit/Loss Tracking**: Real-time P&L calculations
- **Live Bitcoin Price**: Real-time BTC price from multiple exchanges via WebSocket

### Trading Configuration
- **Margin Protection**: Configure automatic margin protection settings
- **Take Profit Automation**: Set up daily percentage-based take profit adjustments
- **Entry Automation (DCA)**: Configure dollar-cost averaging with multiple parameters
- **Price Alerts**: Set up custom price range monitoring

### LN Markets Integration
- **API Configuration**: Secure storage of LN Markets API credentials
- **Testnet Support**: Toggle between mainnet and testnet environments
- **Connection Status**: Monitor API connectivity

### Position Management
- **Position Overview**: View all active positions with key metrics
- **Take Profit/Stop Loss**: Update position exit prices
- **Position Closing**: Close positions manually
- **Real-time Updates**: Live position data updates

### Real-time Price Data
- **WebSocket Connection**: Direct connection to backend's aggregated price feed
- **Multiple Sources**: Real-time prices from Binance, Coinbase, and Kraken
- **Automatic Reconnection**: Robust WebSocket connection with exponential backoff
- **Price Aggregation**: Weighted average from multiple exchange sources

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Ky (lightweight HTTP client)
- **WebSocket**: Native WebSocket API for real-time data
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Package Manager**: Bun

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd btc-trading-web
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. **Run the development server**
```bash
bun dev
```

The application will be available at `http://localhost:3000`.

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8080)
- `NEXT_PUBLIC_WS_API_URL`: WebSocket API URL (optional, auto-derived from API_URL)

### WebSocket Configuration

The application automatically connects to the backend's WebSocket endpoint for real-time BTC price data. The WebSocket connection:

- Uses JWT authentication from secure cookies
- Automatically reconnects on disconnection
- Provides real-time price updates from multiple exchanges
- Falls back to API calls if WebSocket is unavailable

## 🚀 Development

### Available Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run linting

### Architecture

The application uses a WebSocket-based approach for real-time BTC price data:

1. **WebSocket Connection**: Connects to `/api/ws/btc-price` endpoint
2. **Authentication**: Uses JWT tokens from secure cookies
3. **Price Aggregation**: Receives aggregated prices from multiple exchanges
4. **Real-time Updates**: Updates UI components with live price data
5. **Fallback**: Falls back to API calls if WebSocket is unavailable

### Key Components

- `BitcoinPriceDisplay`: Real-time BTC price display with WebSocket connection
- `useBitcoinPriceWebSocket`: Hook for WebSocket price data
- `cryptoApi`: WebSocket-based crypto API client
- `useBitcoinPrice`: Combined hook with WebSocket + API fallback

## 🔒 Security

- JWT-based authentication with secure cookie storage
- HTTPS/WSS for production deployments
- CORS configuration for API endpoints
- Input validation and sanitization
- Rate limiting on backend API

## 📱 Responsive Design

The interface is fully responsive and works on:
- Desktop browsers
- Tablet devices
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

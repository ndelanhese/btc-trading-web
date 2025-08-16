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

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: Headless UI + Heroicons
- **Notifications**: React Hot Toast
- **Charts**: Recharts (for future P&L visualization)

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd btc-trading-web
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. **Run the development server**
```bash
bun dev
# or
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Endpoint
Set the `NEXT_PUBLIC_API_URL` environment variable to point to your BTC Trading Bot backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend Requirements
Make sure your BTC Trading Bot backend is running and accessible at the configured API URL. The web interface expects the following endpoints:

- Authentication: `/api/auth/*`
- LN Markets Config: `/api/lnmarkets/*`
- Trading Config: `/api/trading/*`
- Bot Management: `/api/trading/bot/*`
- Trading Operations: `/api/trading/*`

## 📱 Usage

### Getting Started
1. **Register/Login**: Create an account or sign in with existing credentials
2. **Configure LN Markets**: Set up your API credentials in the LN Markets tab
3. **Configure Trading**: Set up your trading parameters in the Configuration tab
4. **Start Trading**: Use the bot controls to start automated trading

### Dashboard Navigation
- **Overview**: Main dashboard with bot status, balance, and positions
- **Configuration**: Trading strategy settings and automation rules
- **LN Markets**: API credential management

### Key Features
- **Real-time Updates**: Dashboard refreshes automatically every 30 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Secure Storage**: API credentials are stored securely
- **Error Handling**: Comprehensive error messages and validation

## 🎨 UI Components

The interface uses a modern, clean design with:
- **Card-based Layout**: Organized information in clear sections
- **Color-coded Status**: Visual indicators for bot status and P&L
- **Interactive Forms**: Real-time validation and error feedback
- **Loading States**: Clear feedback during API operations
- **Toast Notifications**: Success and error messages

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Protection**: API credentials are masked in the UI
- **HTTPS Support**: Secure communication with the backend
- **Session Management**: Automatic logout on token expiration
- **Input Validation**: Client-side and server-side validation

## 📊 Data Visualization

The dashboard provides comprehensive data visualization:
- **Account Balance Cards**: Color-coded balance information
- **Position Tables**: Detailed position information with inline editing
- **Status Indicators**: Visual bot status and health indicators
- **Real-time Updates**: Live data refresh without page reload

## 🚀 Deployment

### Production Build
```bash
bun run build
bun run start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Docker Deployment
```bash
docker build -t btc-trading-web .
docker run -p 3000:3000 btc-trading-web
```

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # Reusable UI components
├── lib/                # Utilities and configurations
│   ├── api.ts          # API client configuration
│   └── store.ts        # Zustand state management
└── styles/             # Global styles
```

### Available Scripts
- `bun dev`: Start development server
- `bun build`: Build for production
- `bun start`: Start production server
- `bun lint`: Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is for educational and research purposes. Trading cryptocurrencies involves significant risk. Use at your own risk and never invest more than you can afford to lose.

## 🆘 Support

For support and questions:
- Check the [documentation](https://github.com/your-repo/docs)
- Open an [issue](https://github.com/your-repo/issues)
- Contact the development team

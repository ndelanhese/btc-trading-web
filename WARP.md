# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 web interface for a Bitcoin trading bot that provides comprehensive control over trading operations through an intuitive dashboard. The application manages authentication, trading configurations, position monitoring, and bot control for automated Bitcoin trading via LN Markets API.

## Development Commands

### Package Manager
This project uses **Bun** as the primary package manager. Always use Bun commands for consistency.

### Common Commands
```bash
# Development
bun dev                 # Start development server with Turbopack
bun run build          # Build for production
bun run start          # Start production server
bun run lint           # Run ESLint

# Package management
bun install            # Install dependencies
bun add <package>      # Add new dependency
bun add -D <package>   # Add dev dependency
```

### Development Server
The development server runs on `http://localhost:3000` and uses Turbopack for faster builds.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Package Manager**: Bun

### Key Architectural Patterns

#### 1. State Management Architecture
- **Zustand Stores**: Two main stores handle different domains
  - `useAuthStore`: Handles user authentication and session persistence
  - `useTradingStore`: Manages trading data, bot status, and configurations
- **Persistence**: Auth state is persisted to localStorage for session management
- **Real-time Updates**: Dashboard polls API every 30 seconds for live data

#### 2. API Layer Organization
- **Centralized API Client**: `src/lib/api.ts` contains all API endpoints
- **Domain-Specific APIs**: Organized by functionality (auth, trading, bot management)
- **Interceptors**: Automatic JWT token injection and 401 error handling
- **Error Handling**: Automatic redirect to login on authentication failures

#### 3. Component Structure
- **Page Components**: Located in `src/app/` using App Router
- **Feature Components**: Domain-specific components in `src/components/`
- **UI Components**: Reusable components in `src/components/ui/` (shadcn/ui)
- **Composition Pattern**: Dashboard uses composition with feature-specific components

### Critical Configuration Files

#### 1. Environment Variables
Required environment variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080  # Backend API endpoint
```

#### 2. shadcn/ui Configuration
- **Style**: "new-york" variant
- **Base Color**: zinc
- **CSS Variables**: Enabled for theme customization
- **Icon Library**: Lucide React

#### 3. TypeScript Path Aliases
```typescript
"@/*": ["./src/*"]  # Main source alias
```

### Backend Integration

#### API Endpoints Structure
The frontend expects these backend endpoints:
- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **LN Markets**: `/api/lnmarkets/config`
- **Trading Config**: `/api/trading/margin-protection`, `/api/trading/take-profit`, etc.
- **Bot Control**: `/api/trading/bot/start`, `/api/trading/bot/stop`, `/api/trading/bot/status`
- **Trading Data**: `/api/trading/account/balance`, `/api/trading/positions`

#### Authentication Flow
1. JWT tokens stored in localStorage
2. Automatic token injection via Axios interceptors
3. 401 responses trigger automatic logout and redirect
4. Persistent auth state via Zustand persistence

### UI Component System

#### Design System
- **Theme**: Uses CSS variables for consistent theming
- **Components**: Built on Radix UI primitives
- **Styling**: Tailwind with custom utility classes
- **Responsive**: Mobile-first responsive design

#### Key UI Patterns
- **Card Layout**: All major sections use Card components
- **Tab Navigation**: Main dashboard uses tabbed interface
- **Form Handling**: React Hook Form with validation
- **Toast Notifications**: Success/error feedback via react-hot-toast
- **Loading States**: Disabled buttons and loading indicators

### Development Guidelines

#### File Organization
```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── auth/        # Authentication forms
│   ├── dashboard/   # Trading dashboard components
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
└── lib/             # Utilities, API, and stores
```

#### State Management Patterns
- **Local State**: Use React's useState for component-specific state
- **Global State**: Use Zustand stores for shared state
- **API State**: Load data in useEffect, store in Zustand
- **Form State**: Use React Hook Form for complex forms

#### API Integration Patterns
- **Error Handling**: All API calls wrapped in try-catch
- **Loading States**: Set loading state before API calls
- **Toast Feedback**: Show success/error messages for user actions
- **Data Refresh**: Manual refresh after mutations, automatic polling for dashboard

#### Component Development
- **TypeScript**: All components must be fully typed
- **Props Interface**: Define clear interfaces for component props
- **Error Boundaries**: Handle errors gracefully
- **Accessibility**: Use semantic HTML and ARIA attributes where needed

### Testing Considerations

#### Development Testing
- **Manual Testing**: Use development server with hot reload
- **API Testing**: Ensure backend is running on configured port
- **Error Testing**: Test error states and network failures
- **Authentication**: Test login/logout flows and token expiration

### Performance Notes

#### Optimization Features
- **Turbopack**: Development server uses Turbopack for faster builds
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Bundle Analysis**: Use `bun run build` to analyze bundle size

#### Real-time Updates
- **Polling Strategy**: 30-second intervals for dashboard updates
- **Efficient Updates**: Only update changed data in Zustand stores
- **Loading States**: Show loading only for user-initiated actions

### Security Considerations

#### Authentication Security
- **JWT Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **Token Expiration**: Automatic handling of expired tokens
- **API Credentials**: LN Markets credentials stored securely on backend

#### Input Validation
- **Client Validation**: React Hook Form validation
- **Server Validation**: Backend validates all inputs
- **Type Safety**: TypeScript prevents type-related errors

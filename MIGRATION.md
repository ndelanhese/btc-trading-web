# API Migration Guide: Axios → Ky.js + Orval + TanStack Query

This document outlines the migration from axios-based API calls to a modern stack using ky.js, orval for OpenAPI client generation, and TanStack Query for client-side data management.

## What Changed

### 1. HTTP Client: Axios → Ky.js
- **Before**: Used axios with interceptors for authentication and error handling
- **After**: Using ky.js, a tiny and elegant HTTP client based on the Fetch API
- **Benefits**: Smaller bundle size, better browser support, simpler API

### 2. API Client Generation: Manual → Orval
- **Before**: Manually written API functions with axios
- **After**: Automatically generated TypeScript API client from OpenAPI spec
- **Benefits**: Type-safe API calls, automatic updates when API changes, less boilerplate

### 3. Data Management: Manual → TanStack Query
- **Before**: Manual state management and API calls
- **After**: TanStack Query for caching, background updates, and optimistic updates
- **Benefits**: Automatic caching, background refetching, loading states, error handling

## New File Structure

```
src/lib/
├── api-client.ts          # Ky.js client configuration
├── api.ts                 # Legacy exports (deprecated)
├── hooks.ts              # Custom hooks with error handling
├── query-client.ts       # TanStack Query configuration
└── generated/
    └── api.ts            # Auto-generated API client (from orval)
```

## Usage Examples

### Before (Axios)
```typescript
import { authAPI } from '@/lib/api';

const response = await authAPI.login(data);
const { token, user } = response.data;
```

### After (Generated Hooks)
```typescript
import { useAuth } from '@/lib/hooks';

const { login, isLoggingIn } = useAuth();

const onSubmit = (data) => {
  login(data, {
    onSuccess: (response) => {
      // Handle success
    },
  });
};
```

## Available Hooks

### Authentication
- `useAuth()` - Login and registration with error handling

### Configuration
- `useLNMarketsConfig()` - LN Markets configuration management
- `useMarginProtection()` - Margin protection settings
- `useTakeProfit()` - Take profit configuration
- `useEntryAutomation()` - Entry automation settings
- `usePriceAlert()` - Price alert configuration

### Bot Management
- `useBotManagement()` - Start/stop bot and get status

### Trading Operations
- `useAccountBalance()` - Get account balance
- `usePositions()` - Get all positions
- `usePosition(id)` - Get specific position
- `usePositionOperations()` - Close positions, update take profit/stop loss

## Migration Steps for Components

1. **Replace imports**:
   ```typescript
   // Old
   import { authAPI } from '@/lib/api';
   
   // New
   import { useAuth } from '@/lib/hooks';
   ```

2. **Replace API calls**:
   ```typescript
   // Old
   const response = await authAPI.login(data);
   
   // New
   const { login } = useAuth();
   login(data, { onSuccess: handleSuccess });
   ```

3. **Use loading states**:
   ```typescript
   // Old
   const [loading, setLoading] = useState(false);
   
   // New
   const { isLoggingIn } = useAuth();
   ```

## Development Commands

```bash
# Generate API client from OpenAPI spec
bun run generate:api

# Start development server
bun run dev
```

## Benefits of the New Stack

1. **Type Safety**: Full TypeScript support with generated types
2. **Better Performance**: Automatic caching and background updates
3. **Developer Experience**: Better error handling, loading states, and devtools
4. **Maintainability**: Less boilerplate code, automatic API updates
5. **Modern Standards**: Uses Fetch API, better browser support

## Backward Compatibility

The old API exports are still available in `src/lib/api.ts` but are deprecated. Components should be migrated to use the new hooks for better performance and developer experience.

## Troubleshooting

### API Generation Issues
If the API client generation fails:
1. Check that the OpenAPI spec is valid
2. Ensure the backend is running and accessible
3. Run `bun run generate:api` to regenerate

### Type Errors
If you encounter type errors:
1. Regenerate the API client: `bun run generate:api`
2. Check that all required fields are provided in API calls
3. Use the generated types from `src/lib/generated/api.ts`

### Query Issues
If TanStack Query is not working:
1. Ensure the QueryProvider is wrapping your app
2. Check that the query keys are unique
3. Use the React Query DevTools for debugging

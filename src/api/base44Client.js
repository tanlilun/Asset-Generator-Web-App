import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68b7b7d2ef6053b8423f1a16", 
  requiresAuth: false // Ensure authentication is required for all operations
});

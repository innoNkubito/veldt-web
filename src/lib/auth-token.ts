"use client";

import { useAuth } from "@clerk/nextjs";

// Returns a function that resolves the current Clerk session token.
// Used by Apollo's auth link to attach Bearer tokens to every request.
// Must be called inside a React component (uses Clerk's useAuth hook).
export function useAuthToken() {
  const { getToken } = useAuth();

  return async () => {
    const token = await getToken();
    return token;
  };
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useClientStore } from "@/stores/clientStore";

// Syncs the Clerk session token into the Zustand client store.
// Runs on mount and whenever the Clerk auth state changes
// (sign in, sign out, token refresh).
// Must be rendered inside ClerkProvider.
export default function TokenSync() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const setToken = useClientStore((s) => s.setToken);

  useEffect(() => {
    if (!isLoaded) return;

    async function sync() {
      if (!isSignedIn) {
        setToken(null);
        return;
      }
      const token = await getToken();
      console.log("token", token);
      setToken(token);
    }

    sync();
  }, [isLoaded, isSignedIn, getToken, setToken]);

  // Renders nothing — purely a side-effect component
  return null;
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useClientStore } from "@/stores/clientStore";

export default function TokenSync() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const setGetToken = useClientStore((s) => s.setGetToken);
  const clearClient = useClientStore((s) => s.clearClient);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      clearClient();
      return;
    }
    // Hand Clerk's getToken to the GQL client — called fresh on every
    // request via middleware so tokens never go stale after navigation.
    setGetToken(() => getToken());
  }, [isLoaded, isSignedIn, getToken, setGetToken, clearClient]);

  return null;
}

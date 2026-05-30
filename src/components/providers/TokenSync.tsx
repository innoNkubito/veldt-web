"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useClientStore } from "@/stores/clientStore";

// Hands Clerk's getToken function to the GQL client store.
// The GQL client calls it fresh on every request via middleware,
// so tokens are always current after navigation — no stale string caching.
export default function TokenSync() {
  const { getToken } = useAuth();
  const setGetToken = useClientStore((s) => s.setGetToken);

  useEffect(() => {
    // Pass a stable wrapper so Clerk can internally refresh when needed.
    setGetToken(() => getToken());
  }, [getToken, setGetToken]);

  return null;
}

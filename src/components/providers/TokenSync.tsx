"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useClientStore } from "@/stores/clientStore";
import { useProfileStore } from "@/stores/profileStore";

export default function TokenSync() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const setGetToken = useClientStore((s) => s.setGetToken);
  const clearClient = useClientStore((s) => s.clearClient);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const clearProfile = useProfileStore((s) => s.clearProfile);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      clearClient();
      clearProfile();
      return;
    }
    // Hand Clerk's getToken to the GQL client — called fresh on every
    // request via middleware so tokens never go stale after navigation.
    setGetToken(() => getToken());
    // Fetch the current user's profile now that we have an auth'd client.
    fetchProfile();
  }, [isLoaded, isSignedIn, getToken, setGetToken, clearClient, fetchProfile, clearProfile]);

  return null;
}

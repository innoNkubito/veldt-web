"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useItineraryStore } from "@/stores/itineraryStore";
import { useClientStore } from "@/stores/clientStore";
import { T } from "@/lib/theme";

export default function DashboardPage() {
  const { signOut } = useClerk();
  const client = useClientStore((s) => s.client);
  const { itineraries, loading, error, fetchItineraries } = useItineraryStore();

  // Fetch when client is ready
  useEffect(() => {
    if (client) fetchItineraries();
  }, [client]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box
        sx={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: "10px",
          p: 3,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: T.muted,
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          GraphQL Connection Test
        </Typography>

        {!client && (
          <Typography sx={{ fontSize: 13, color: T.muted }}>
            Waiting for auth token...
          </Typography>
        )}

        {loading && <CircularProgress size={20} sx={{ color: T.terra }} />}

        {error && (
          <Typography sx={{ fontSize: 13, color: "red" }}>
            Error: {error}
          </Typography>
        )}

        {!loading && !error && client && (
          <Typography sx={{ fontSize: 13, color: T.sage, fontWeight: 500 }}>
            ✅ Connected — {itineraries.length} itinerary/ies found
          </Typography>
        )}
      </Box>

      <Button
        variant="outlined"
        size="small"
        onClick={() => signOut({ redirectUrl: "/sign-in" })}
      >
        Sign out
      </Button>
    </Box>
  );
}

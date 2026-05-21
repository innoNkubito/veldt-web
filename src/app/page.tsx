"use client";

import { Button, Typography, Box } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1">Good morning, Eric!</Typography>
      <Typography variant="overline" component="div" sx={{ mt: 1 }}>
        WORKSPACE
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }}>
        + New Itinerary
      </Button>
      <Button variant="outlined" sx={{ mt: 2, ml: 1 }}>
        View all
      </Button>
    </Box>
  );
}

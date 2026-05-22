"use client";

import { styled, Box } from "@mui/material";

export const AuthRoot = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
}));

export const WordmarkWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(1),
}));

export const WordmarkTitle = styled("span")(({ theme }) => ({
  fontFamily: "var(--font-playfair)",
  fontSize: 28,
  fontWeight: 700,
  color: theme.palette.text.primary,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  lineHeight: 1.1,
  display: "block",
}));

export const WordmarkSubtitle = styled("span")(({ theme }) => ({
  fontSize: 8.5,
  fontWeight: 700,
  color: theme.palette.text.disabled,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  display: "block",
  marginTop: theme.spacing(0.5),
}));

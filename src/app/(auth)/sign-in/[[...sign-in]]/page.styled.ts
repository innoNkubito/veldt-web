
import { T } from "@/lib/theme";

export const signInAppearance = {
  variables: {
    colorPrimary: T.terra,
    colorBackground: T.card,
    colorText: T.text,
    colorTextSecondary: T.muted,
    colorInputBackground: T.card,
    colorInputText: T.text,
    borderRadius: "7px",
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "13px",
  },
  elements: {
    card: {
      border: `1px solid ${T.border}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    },
    headerTitle: {
      fontFamily: '"Playfair Display", serif',
      fontSize: 22,
      fontWeight: 500,
    },
    formButtonPrimary: {
      backgroundColor: T.terra,
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: 13,
      textTransform: "none",
      "&:hover": {
        backgroundColor: "#AE6341",
      },
    },
    footerActionLink: {
      color: T.terra,
    },
  },
};

import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import EmotionRegistry from "@/components/providers/EmotionRegistry";
import TokenSync from "@/components/providers/TokenSync";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Veldt — Safari Itinerary Platform",
  description: "Build beautiful itineraries for your clients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
        <body>
          <EmotionRegistry>
            <TokenSync />
            {children}
          </EmotionRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}

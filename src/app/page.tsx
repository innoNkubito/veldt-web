import { redirect } from "next/navigation";

// Root redirects authenticated users to dashboard.
// Unauthenticated users are caught by middleware → /sign-in.
export default function RootPage() {
  redirect("/dashboard");
}

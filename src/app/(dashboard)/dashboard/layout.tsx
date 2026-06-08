// Shell is provided by the parent (dashboard) group layout.
// This file is kept as a passthrough so the route group nesting is explicit.
export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

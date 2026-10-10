import type { Metadata } from "next";

// The admin area reads the signed-in session on every request, so it is allowed to block on the server.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Anoka Advisors admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="admin min-h-dvh bg-mist">{children}</div>;
}

import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = {
  title: {
    default: "Free For Friendlies",
    template: "%s | Free For Friendlies",
  },
  description:
    "Build a grassroots football club profile, post fixture needs, and find better local opposition faster.",
  icons: {
    icon: [
      {
        url: "/brand/favicon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono, Poppins, Bricolage_Grotesque, Dancing_Script, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cortexa AI Intern Portal — Internship Dashboard & Leaderboard",
  description: "Empowering interns with AI career tools, real-time leaderboard rankings, CV & LinkedIn audits, project submissions, and top job opportunities.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};


const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${bricolageGrotesque.variable} ${dancingScript.variable} ${playfairDisplay.variable} h-full antialiased`}
      >
        {/* suppressHydrationWarning covers only <body>'s own attributes, not
            its children. Browser extensions (ColorZilla adds
            cz-shortcut-listen, password managers add their own) stamp
            attributes on <body> before React hydrates, which React reports as
            a mismatch even though nothing in this app is at fault. */}
        <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  );
}

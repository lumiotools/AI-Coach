import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from '@next/third-parties/google'

import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "@/components/theme-provider";;;k
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AgentCoach.AI",
  description: "Generated by AgentCoach.AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.classList.add(theme);
                  }
                  document.documentElement.classList.add('no-transition');
                  document.addEventListener('DOMContentLoaded', function() {
                    document.documentElement.classList.remove('no-transition');
                  });
                })();
              `,
            }}
          />
        </head>
        <body>
          {children}
          <ToastContainer
            toastStyle={{
              backgroundColor: "#1E2A5E",
              color: "white",
            }}
          />
        </body>
        <GoogleAnalytics gaId="G-QBCXEMLQXS" />
      </html>
    </ClerkProvider>
  );
}

//hqqq

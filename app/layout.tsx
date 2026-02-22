import type { Metadata } from "next";
import { Poppins } from "next/font/google"
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import NavigationEvents from "@/components/shared/NavigationEvents";
import { ThemeProvider } from "@/components/ThemeProvider";

const poppins = Poppins({
  subsets:['latin'],
  weight:['400','500','600','700'],
  variable:'--font-poppins'
})

export const metadata: Metadata = {
  title: "PremiumSolutions",
  description: "Premium Solutions subscription selling platform",
  icons:{
    icon:'/assets/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <ClerkProvider appearance={{
      layout: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
    }}
    >
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          #nprogress {
            pointer-events: none;
          }
          #nprogress .bar {
            background: hsl(var(--primary));
            position: fixed;
            z-index: 9999;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
          }
          #nprogress .peg {
            display: block;
            position: absolute;
            right: 0px;
            width: 100px;
            height: 100%;
            box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
            opacity: 1.0;
            transform: rotate(3deg) translate(0px, -4px);
          }
        `}</style>
      </head>
      <body className={poppins.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <NavigationEvents />
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

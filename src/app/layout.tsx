import { Montserrat, Geist, Jost } from "next/font/google";
import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";

// const customFont = Montserrat({ subsets: ["latin"], weight: "500" });
const customFont = Geist({ subsets: ["latin"], weight: "400" });
// const customFont = Jost({ subsets: ["latin"], weight: "400" });

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "AVA Roasteria",
  description: "Ava Roasteria application for managing stores and bakeries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
        <body className={`${customFont.className}`}>
        {/* <body className={`${montserrat.className} h-full`}> */}
        {/* <body className={montserrat.className}> */}
          {children}
      </body>
    </html>
  );
}

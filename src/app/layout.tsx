"use client";
import { Outfit, Lilita_One, Signika } from "next/font/google";
import "./globals.css";
import { MyContextProvider } from "./components/ColorContext";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
export const lilita_one = Lilita_One({ subsets: ["latin"], weight: "400" });
export const signika = Signika({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Music In Color</title>
      </head>
      <body className={`${outfit.variable} font-sans`}>
        <MyContextProvider>{children}</MyContextProvider>
      </body>
    </html>
  );
}

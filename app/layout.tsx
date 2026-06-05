import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeckenBro",
  description: "A Swedish Sign Language learning aid for Swedish and English text."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}

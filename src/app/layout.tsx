import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/provider";

const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Excel Data Viewer",
  description: "View and filter Excel data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

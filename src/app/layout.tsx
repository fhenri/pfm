import './globals.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster"

//import dbConnect from '@/lib/mongo';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance Manager",
  description: "Managed Your banking transaction and your personal finance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <div className="mx-2 md:mx-5 mt-20 mb-10">
            {children}
        </div>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}

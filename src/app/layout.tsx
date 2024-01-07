import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer";
import { AuthSessionProvider } from "./providers/AuthProvider";
import { getServerSession } from "next-auth";
import { Toaster } from "react-hot-toast";
import ToasterClient from "./components/utils/ToasterClient";
import { CartProvider } from "./providers/CartProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Feedr",
  description: "Feedr is a food delivery service",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className="">
      <AuthSessionProvider session={session}>
        <CartProvider>
          <body
            className={`${roboto.className} h-screen scroll-smooth flex flex-col items-stretch`}
          >
            <ToasterClient />
            <Header />
            {children}
            <Footer />
          </body>
        </CartProvider>
      </AuthSessionProvider>
    </html>
  );
}

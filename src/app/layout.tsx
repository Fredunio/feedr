import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer";
import { AuthSessionProvider } from "./providers";
import { getServerSession } from "next-auth";
import { Toaster } from "react-hot-toast";
import ToasterClient from "./components/utils/ToasterClient";

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
        <body
          className={`${roboto.className} h-screen flex flex-col items-stretch`}
        >
          <ToasterClient />

          <Header />
          {children}
          <Footer />
        </body>
      </AuthSessionProvider>
    </html>
  );
}

import { Poppins } from "next/font/google";

import Footer from "@/shared/Footer/Footer";
import SiteHeader from "@/app/SiteHeader";
import CommonClient from "../CommonClient";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const session = await getServerSession(authOptions); // ✅ Get session
  console.log("🚀 ~ RootLayout ~ session:", session);
  return (
    <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <SiteHeader user={session?.user || null} />
      {children}
      <CommonClient />
      <Footer />
    </body>
  );
}

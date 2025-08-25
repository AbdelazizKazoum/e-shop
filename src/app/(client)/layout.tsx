import { Poppins } from "next/font/google";

import Footer from "@/shared/Footer/Footer";
import SiteHeader from "@/app/SiteHeader";
import CommonClient from "../CommonClient";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <SiteHeader />
      {children}
      <CommonClient />
      <Footer />
    </body>
  );
}

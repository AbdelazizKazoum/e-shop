"use client";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
// app/(dashboard)/layout.tsx
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <body className="bg-white  dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - hidden on mobile */}
        <Sidebar />

        {/* Main content */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">{children}</div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </main>
        </div>
      </div>
    </body>
  );
}

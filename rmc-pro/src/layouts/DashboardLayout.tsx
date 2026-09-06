import type { ReactNode } from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import PageTransition from "../components/layout/PageTransition";

type Props = {
  children: ReactNode;
  hideNavbar?: boolean;
};

export default function DashboardLayout({
  children,
  hideNavbar = false,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        {!hideNavbar && (
          <header className="sticky top-0 z-40 bg-white shadow-sm">
            <Navbar />
          </header>
        )}

       <main className="p-6 md:p-8 lg:p-10 pt-0">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
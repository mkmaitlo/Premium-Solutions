import React from "react";
import AdminSidebar from "@/components/shared/AdminSidebar";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.isAdmin === true;

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground relative selection:bg-primary/20">
      {/* Background blobs for the Admin Panel giving it the aesthetic feel */}
      <div className="fixed top-0 right-0 w-full h-full flex justify-center z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 relative z-10 min-h-screen pt-24 lg:pt-0 p-4 sm:p-8 lg:p-12 pb-32 w-full overflow-hidden">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 w-full max-w-6xl mx-auto rounded-3xl bg-card/40 backdrop-blur-xl border border-primary/20 shadow-xl overflow-hidden min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-6rem)] relative">
          {/* Subtle noise texture over the glass panel */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
          />
          <div className="relative z-10 h-full p-2 sm:p-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

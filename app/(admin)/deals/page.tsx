import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAllDeals } from "@/lib/actions/deal.actions";
import AdminDealsClient from "@/components/shared/AdminDealsClient";
import { Tag, TrendingUp, DollarSign } from "lucide-react";

export default async function AdminDealsPage() {
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.isAdmin ?? false;
  if (!isAdmin) redirect("/");

  const deals = await getAllDeals();
  const totalDeals = deals.length;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-tight">
                Hero Deals
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary/70" />
                Manage what visitors see on the homepage hero section
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/80 border border-border/50 shadow-sm">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-black text-foreground">{totalDeals}</span>
              <span className="text-xs text-muted-foreground">active deals</span>
            </div>
          </div>
        </div>
      </div>

      <AdminDealsClient initialDeals={deals} />
    </div>
  );
}

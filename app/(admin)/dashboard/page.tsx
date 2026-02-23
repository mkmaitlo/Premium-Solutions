import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAllUsers, getDashboardStats } from "@/lib/actions/user.actions";
import DashboardUsersTable from "@/components/shared/DashboardUsersTable";
import {
  Users, ShieldCheck, Star, TrendingUp, LayoutDashboard, MessageSquare,
} from "lucide-react";

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  sub?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: gradient.replace(")", " / 0.05)").replace("linear-gradient(", "linear-gradient(") }}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-black text-foreground leading-none">
            {typeof value === "number"
              ? value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })
              : value}
          </p>
          {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
        </div>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ background: gradient }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-60" style={{ background: gradient }} />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.isAdmin ?? false;
  if (!isAdmin) redirect("/");

  const [stats, initialData] = await Promise.all([
    getDashboardStats(),
    getAllUsers({ page: 1, limit: 10 }),
  ]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
      sub: `${stats.regularUsers} regular · ${stats.totalAdmins} admin`,
    },
    {
      label: "Regular Users",
      value: stats.regularUsers,
      icon: ShieldCheck,
      gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
      sub: "Customers & subscribers",
    },
    {
      label: "Total Reviews",
      value: stats.totalReviews,
      icon: MessageSquare,
      gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
      sub: "All-time submitted",
    },
    {
      label: "Avg. Rating",
      value: stats.averageRating > 0 ? `${stats.averageRating} ★` : "—",
      icon: Star,
      gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
      sub: "Across all subscriptions",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
          >
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary/70" />
              Real-time overview of your platform
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Users Table Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-black text-foreground leading-tight">Registered Users</h2>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers.toLocaleString()} total · search, filter & sort below
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-6">
            <DashboardUsersTable
              initialUsers={initialData.users}
              initialTotalPages={initialData.totalPages}
              initialTotalCount={initialData.totalCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

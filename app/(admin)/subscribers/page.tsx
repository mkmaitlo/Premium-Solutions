import { getAllSubscribers } from "@/lib/actions/subscriber.actions";
import { Mail, Users, Download, Calendar } from "lucide-react";
import SubscribersTable from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic"; // always fresh data

export default async function SubscribersPage() {
  const { subscribers, total } = await getAllSubscribers();

  const csvContent =
    "Email,Subscribed At\n" +
    subscribers
      .map((s) => {
        // Wrap date in quotes — "February 23, 2026" contains a comma which
        // would break the CSV column without quoting.
        const date = new Date(s.subscribedAt).toLocaleDateString("en-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return `${s.email},"${date}"`;
      })
      .join("\n");

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-muted-foreground">
            Emails collected from the footer subscription form.
          </p>
        </div>

        {/* Export CSV button */}
        <SubscribersTable
          subscribers={subscribers}
          csvContent={csvContent}
          headerOnly
        />
      </div>

      {/* Stats card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Users,
            label: "Total Subscribers",
            value: total.toLocaleString(),
            color: "from-primary to-secondary",
          },
          {
            icon: Mail,
            label: "This Month",
            value: subscribers
              .filter((s) => {
                const d = new Date(s.subscribedAt);
                const now = new Date();
                return (
                  d.getMonth() === now.getMonth() &&
                  d.getFullYear() === now.getFullYear()
                );
              })
              .length.toLocaleString(),
            color: "from-violet-500 to-purple-600",
          },
          {
            icon: Calendar,
            label: "Latest Subscriber",
            value:
              subscribers[0]?.subscribedAt
                ? new Date(subscribers[0].subscribedAt).toLocaleDateString(
                    "en-PK",
                    { month: "short", day: "numeric", year: "numeric" }
                  )
                : "—",
            color: "from-emerald-500 to-teal-600",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${color}`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <p className="text-xl font-extrabold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <SubscribersTable subscribers={subscribers} csvContent={csvContent} />
    </div>
  );
}

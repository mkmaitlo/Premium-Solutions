import SubscriptionForm from "@/components/shared/SubscriptionForm";
import { getSubscriptionById } from "@/lib/actions/subscription.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Pencil, Sparkles } from "lucide-react";

type UpdateSubscriptionProps = {
  params: Promise<{ id: string }>;
};

const UpdateSubscription = async ({ params }: UpdateSubscriptionProps) => {
  const { id } = await params;

  const { sessionClaims, userId: clerkId } = await auth();
  const userId = (sessionClaims?.userId as string) || (clerkId as string);
  const subscription = await getSubscriptionById(id);
  const isAdmin = sessionClaims?.isAdmin ?? false;

  if (!isAdmin) redirect("/");

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-secondary/10 via-card to-primary/10 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))" }}
          >
            <Pencil className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary leading-tight">
              Update Subscription
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary/70" />
              {subscription?.title ? (
                <>Editing: <span className="font-semibold text-foreground ml-1">{subscription.title}</span></>
              ) : (
                "Modify the details of this subscription plan"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <SubscriptionForm
            userId={userId}
            type="Update"
            subscription={subscription}
            subscriptionId={subscription._id}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateSubscription;
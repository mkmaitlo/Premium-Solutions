"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { subscriptionDefaultValues } from "@/constants";
import { subscriptionFormSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/subscription.actions";
import { ISubscription } from "@/lib/database/models/subscription.model";
import { Type, AlignLeft, Image as ImageIcon, DollarSign, Loader2, Sparkles } from "lucide-react";

type SubscriptionFormProps = {
  userId: string;
  type: "Create" | "Update";
  subscription?: ISubscription;
  subscriptionId?: string;
};

const SubscriptionForm = ({
  userId,
  type,
  subscription,
  subscriptionId,
}: SubscriptionFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const initialValues =
    subscription && type === "Update"
      ? { ...subscription }
      : subscriptionDefaultValues;

  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof subscriptionFormSchema>>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof subscriptionFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (!uploadedImages) return;
      uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          subscription: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: "/my-subscriptions",
        });
        if (newEvent) {
          form.reset();
          router.push(`/subscriptions/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      try {
        const updatedEvent = await updateEvent({
          userId,
          subscription: {
            ...values,
            imageUrl: uploadedImageUrl,
            _id: subscriptionId!,
          },
          path: `/subscriptions/${subscriptionId}`,
        });
        if (updatedEvent) {
          form.reset();
          router.push(`/subscriptions/${updatedEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

        {/* Section: Basic Info */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-1 border-b border-border/40">
            <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Type className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.12em]">
              Basic Information
            </p>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground/80">
                  Subscription Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Microsoft 365 Personal"
                    {...field}
                    className="h-12 rounded-xl border-border/60 bg-background/60 placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 focus-visible:border-primary/60 transition-all duration-200 text-sm font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section: Details */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-1 border-b border-border/40">
            <div className="w-6 h-6 rounded-lg bg-secondary/15 flex items-center justify-center flex-shrink-0">
              <AlignLeft className="w-3.5 h-3.5 text-secondary" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.12em]">
              Details & Media
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground/80">
                    Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this subscription includes, features, and benefits..."
                      {...field}
                      className="min-h-[200px] rounded-xl border-border/60 bg-background/60 placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 focus-visible:border-primary/60 transition-all duration-200 text-sm resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground/80 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    Cover Image <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="min-h-[200px] rounded-xl border border-dashed border-border/60 overflow-hidden bg-background/40 hover:border-primary/40 transition-colors duration-200">
                      <FileUploader
                        onFieldChange={field.onChange}
                        imageUrl={field.value}
                        setFiles={setFiles}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section: Pricing */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-1 border-b border-border/40">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.12em]">
              Pricing
            </p>
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel className="text-sm font-semibold text-foreground/80">
                  Price (PKR) <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm pointer-events-none">
                      PKR
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="h-12 pl-14 rounded-xl border-border/60 bg-background/60 placeholder:text-muted-foreground/50 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500/60 transition-all duration-200 text-sm font-semibold"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <div className="pt-2 border-t border-border/30">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full h-13 rounded-2xl text-base font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
          >
            {/* shimmer */}
            <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12 pointer-events-none" />

            <span className="relative z-10 flex items-center justify-center gap-2.5">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{type === "Create" ? "Creating..." : "Updating..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{type === "Create" ? "Create Subscription" : "Save Changes"}</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubscriptionForm;

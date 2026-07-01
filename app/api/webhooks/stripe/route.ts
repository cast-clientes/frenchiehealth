import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import {
  sendMetaServerEvent,
  sendTikTokServerEvent,
} from "@/lib/analytics/server-events";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia" as const,
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const planType = session.metadata?.plan_type ?? "monthly";
      if (!userId) break;
      const purchaseValue = (session.amount_total ?? 0) / 100;
      const isFounderPlan =
        planType === "founder_monthly" || planType === "founder_annual";

      await Promise.allSettled([
        sendMetaServerEvent(
          "Purchase",
          { email: session.customer_email },
          {
            currency: "USD",
            value: purchaseValue,
            content_name: "Frenchie Care Premium",
            content_type: "subscription",
            order_id: session.id,
            plan_type: planType,
          },
        ),
        sendTikTokServerEvent(
          "CompletePayment",
          { email: session.customer_email },
          {
            value: purchaseValue,
            currency: "USD",
            order_id: session.id,
            plan_type: planType,
          },
        ),
        isFounderPlan
          ? sendMetaServerEvent(
              "FoundingMemberPurchase",
              { email: session.customer_email },
              {
                currency: "USD",
                value: purchaseValue,
                order_id: session.id,
                plan_type: planType,
              },
            )
          : Promise.resolve(),
      ]);

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan: "paid",
        status: "active",
        plan_type: planType,
      });

      // Founding member logic - single atomic UPDATE prevents TOCTOU race condition.
      // The DB function executes:
      //   UPDATE founding_members_counter
      //   SET spots_taken = spots_taken + 1,
      //       offer_active = (spots_taken + 1 < total_spots),
      //       updated_at = now()
      //   WHERE id = 1 AND offer_active = true
      //     AND spots_taken < total_spots AND offer_ends_at > now()
      //   RETURNING spots_taken
      // Returns the claimed spot number, or null if no spot was available.
      if (isFounderPlan) {
        const { data: claimedSpot } = await supabase.rpc(
          "claim_founding_member_spot"
        );

        if (claimedSpot !== null && claimedSpot !== undefined) {
          await supabase
            .from("profiles")
            .update({
              is_founding_member: true,
              founding_member_number: claimedSpot,
            })
            .eq("id", userId);
        }
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const status =
        event.type === "customer.subscription.deleted"
          ? "canceled"
          : (subscription.status as
              | "active"
              | "canceled"
              | "past_due"
              | "trialing"
              | "incomplete");

      const plan =
        status === "active" || status === "trialing" ? "paid" : "free";

      const sub = subscription as Stripe.Subscription & {
        current_period_end?: number;
      };
      const renewalDate = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;

      await supabase
        .from("subscriptions")
        .update({
          status,
          plan,
          stripe_subscription_id: subscription.id,
          renewal_date: renewalDate,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

export interface SubscriptionLike {
  plan: "free" | "paid" | null;
  plan_type:
    | "basic"
    | "monthly"
    | "annual"
    | "founder_monthly"
    | "founder_annual"
    | null;
}

/** True only for a plan with no basic-tier limits (old free-tier caps). */
export function isFullPlan(sub?: SubscriptionLike | null): boolean {
  return sub?.plan === "paid" && sub?.plan_type !== "basic";
}

/** True if the user has completed any paid Stripe checkout (basic included). */
export function hasAnyPaidPlan(sub?: SubscriptionLike | null): boolean {
  return sub?.plan === "paid";
}

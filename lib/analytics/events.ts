type AnalyticsEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[];
  }
}

function push(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export const analytics = {
  pageView: (pageName: string, pageUrl: string) =>
    push({
      event: "page_view",
      page_name: pageName,
      page_url: pageUrl,
    }),

  landingCtaClicked: (landingPage: string, ctaId: string) =>
    push({
      event: "landing_cta_clicked",
      landing_page: landingPage,
      cta_id: ctaId,
    }),

  onboardingStarted: () => push({ event: "onboarding_started" }),

  onboardingStepCompleted: (step: number, stepName: string) =>
    push({
      event: "onboarding_step_completed",
      step_number: step,
      step_name: stepName,
    }),

  onboardingCompleted: (dogName: string, parentRole: string) =>
    push({
      event: "onboarding_completed",
      dog_name: dogName,
      parent_role: parentRole,
    }),

  signUpStarted: (method: "email" | "google") =>
    push({
      event: "sign_up_started",
      method,
    }),

  signUpCompleted: (method: "email" | "google") =>
    push({
      event: "sign_up_completed",
      method,
    }),

  loginCompleted: (method: "email" | "google" | "magic_link") =>
    push({
      event: "login",
      method,
    }),

  paywallViewed: (trigger: string) =>
    push({
      event: "paywall_viewed",
      trigger,
    }),

  paywallCTAClicked: (
    plan: "founding_monthly" | "founding_annual" | "monthly" | "annual",
  ) =>
    push({
      event: "paywall_cta_clicked",
      plan,
    }),

  checkoutStarted: (plan: string, price: number) =>
    push({
      event: "begin_checkout",
      currency: "USD",
      value: price,
      items: [{ item_name: `Frenchie Care ${plan}`, price, quantity: 1 }],
    }),

  purchaseCompleted: (
    orderId: string,
    plan: string,
    price: number,
    isFounder: boolean,
  ) =>
    push({
      event: "purchase",
      transaction_id: orderId,
      currency: "USD",
      value: price,
      is_founding_member: isFounder,
      items: [{ item_name: `Frenchie Care ${plan}`, price, quantity: 1 }],
    }),

  subscriptionCancelled: (plan: string, reason?: string) =>
    push({
      event: "subscription_cancelled",
      plan,
      cancellation_reason: reason,
    }),

  skinEntryCreated: (entryNumber: number, hasPhoto: boolean) =>
    push({
      event: "skin_entry_created",
      entry_number: entryNumber,
      has_photo: hasPhoto,
    }),

  pdfExported: () => push({ event: "pdf_exported" }),

  passportShared: () => push({ event: "passport_shared" }),

  chatMessageSent: (messageNumber: number, isPaid: boolean) =>
    push({
      event: "chat_message_sent",
      message_number: messageNumber,
      is_paid_user: isPaid,
    }),

  chatFeedback: (helpful: boolean) =>
    push({
      event: "chat_feedback",
      was_helpful: helpful,
    }),

  communityPostCreated: (category: string) =>
    push({
      event: "community_post_created",
      post_category: category,
    }),

  communityReactionAdded: () => push({ event: "community_reaction_added" }),

  moduleWaitlistJoined: (module: string) =>
    push({
      event: "module_waitlist_joined",
      module_name: module,
    }),

  moduleEntryCreated: (module: string) =>
    push({
      event: "module_entry_created",
      module_name: module,
    }),

  milestoneAdded: (milestoneType: string) =>
    push({
      event: "milestone_added",
      milestone_type: milestoneType,
    }),

  albumPhotoAdded: () => push({ event: "album_photo_added" }),
};

# Tracking setup

This project sends one client-side stream into Google Tag Manager through `window.dataLayer`.
GTM should own Meta Pixel, TikTok Pixel, GA4, and Google Ads tags.

## Environment variables

Set these public variables for browser/GTM usage:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

Set these server-only variables for server-side purchase events:

```env
META_PIXEL_ID=
META_CONVERSIONS_API_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_EVENTS_API_TOKEN=
GOOGLE_ADS_CONVERSION_ID=
GOOGLE_ADS_CONVERSION_LABEL=
```

## Google Tag Manager

1. Create or open the web container for Frenchie Skin Tracker.
2. Copy the GTM container ID into `NEXT_PUBLIC_GTM_ID`.
3. In GTM, create Data Layer Variables for the parameters used by the app:
   `page_name`, `page_url`, `method`, `trigger`, `plan`, `currency`, `value`,
   `transaction_id`, `is_founding_member`, `step_number`, `step_name`,
   `entry_number`, `has_photo`, `message_number`, `is_paid_user`,
   `post_category`, `module_name`, and `milestone_type`.
4. Create Custom Event triggers for:
   `page_view`, `consent_given`, `consent_declined`, `onboarding_started`,
   `onboarding_step_completed`, `onboarding_completed`, `sign_up_started`,
   `sign_up_completed`, `login`, `paywall_viewed`, `paywall_cta_clicked`,
   `begin_checkout`, `purchase`, `subscription_cancelled`,
   `skin_entry_created`, `pdf_exported`, `passport_shared`,
   `chat_message_sent`, `chat_feedback`, `community_post_created`,
   `community_reaction_added`, `module_waitlist_joined`, `milestone_added`,
   and `album_photo_added`.
5. Use Consent Initialization or trigger rules so advertising tags fire only after
   `consent_given` when required by the target market.
6. Preview the container, complete the core flows, confirm events appear in
   Tag Assistant, then publish.

## Meta Pixel

1. Create a Pixel in Meta Events Manager.
2. Add the Pixel ID to GTM as a constant variable and to `NEXT_PUBLIC_META_PIXEL_ID`.
3. In GTM, install a Meta Pixel base tag and trigger it after consent.
4. Map app events to Meta events:
   - `page_view` -> `PageView`
   - `sign_up_completed` -> `Lead`
   - `begin_checkout` or `paywall_cta_clicked` -> `InitiateCheckout`
   - `purchase` -> `Purchase`
   - `FoundingMemberPurchase` is sent server-side from the Stripe webhook.
5. In Meta Events Manager, enable and verify Conversions API with
   `META_PIXEL_ID` and `META_CONVERSIONS_API_TOKEN`.
6. Use Meta Test Events to confirm browser and server purchase events arrive.

## TikTok Pixel

1. Create a Web Event Set and Pixel in TikTok Events Manager.
2. Add the Pixel ID to GTM as a constant variable and to `NEXT_PUBLIC_TIKTOK_PIXEL_ID`.
3. Install the TikTok Pixel base tag in GTM and trigger it after consent.
4. Map app events to TikTok events:
   - `page_view` -> `ViewContent`
   - `paywall_cta_clicked` -> `ClickButton`
   - `sign_up_completed` -> `CompleteRegistration`
   - `begin_checkout` -> `InitiateCheckout`
   - `CompletePayment` is sent server-side from the Stripe webhook.
5. Add `TIKTOK_PIXEL_ID` and `TIKTOK_EVENTS_API_TOKEN` for Events API.
6. Use TikTok test events to confirm browser and server events.

## GA4

1. Create or open a GA4 Web Data Stream.
2. Add the Measurement ID to GTM and to `NEXT_PUBLIC_GA4_ID`.
3. In GTM, create a GA4 Configuration tag that fires after consent.
4. Create a GA4 Event tag for each Custom Event trigger, passing through the
   matching Data Layer Variables as event parameters.
5. Mark these GA4 events as conversions:
   `sign_up_completed`, `purchase`, and `paywall_cta_clicked`.
6. Create a remarketing audience for users with `paywall_viewed` but no
   `purchase`.

## Google Ads

1. Create a conversion action in Google Ads.
2. Add `GOOGLE_ADS_CONVERSION_ID` and `GOOGLE_ADS_CONVERSION_LABEL`.
3. In GTM, add Google Ads Conversion Tracking tags for checkout and purchase.
4. Trigger checkout conversion on `begin_checkout`.
5. Trigger purchase conversion on `purchase`, passing `value`, `currency`, and
   `transaction_id`.
6. Use Google Tag Assistant and Google Ads diagnostics to verify the conversion
   action.

## Validation checklist

1. `NEXT_PUBLIC_GTM_ID` is set and GTM loads on every locale route.
2. Cookie acceptance pushes `consent_given`; necessary-only pushes
   `consent_declined`.
3. Route changes push `page_view`.
4. Signup, login, onboarding, paywall, checkout, chat, skin entry, and waitlist
   flows push their expected dataLayer events.
5. A Stripe test checkout triggers Meta `Purchase`, Meta
   `FoundingMemberPurchase` for founder plans, and TikTok `CompletePayment`
   from the webhook.

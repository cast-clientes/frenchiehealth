import { createHash } from "crypto";

type MetaUserData = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
};

type TikTokUserData = {
  email?: string | null;
};

function hashSHA256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export async function sendMetaServerEvent(
  eventName: string,
  userData: MetaUserData,
  customData?: Record<string, unknown>,
) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !accessToken) return;

  const hashedEmail = userData.email
    ? hashSHA256(normalize(userData.email))
    : undefined;
  const hashedPhone = userData.phone
    ? hashSHA256(normalize(userData.phone))
    : undefined;
  const hashedFirstName = userData.firstName
    ? hashSHA256(normalize(userData.firstName))
    : undefined;

  await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data: {
            em: hashedEmail ? [hashedEmail] : undefined,
            ph: hashedPhone ? [hashedPhone] : undefined,
            fn: hashedFirstName ? [hashedFirstName] : undefined,
          },
          custom_data: customData,
        },
      ],
      access_token: accessToken,
    }),
  });
}

export async function sendTikTokServerEvent(
  eventName: string,
  userData: TikTokUserData,
  customData?: Record<string, unknown>,
) {
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_EVENTS_API_TOKEN;

  if (!pixelId || !accessToken) return;

  const hashedEmail = userData.email
    ? hashSHA256(normalize(userData.email))
    : undefined;

  await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
    body: JSON.stringify({
      pixel_code: pixelId,
      event: eventName,
      timestamp: new Date().toISOString(),
      context: {
        user: { email: hashedEmail },
      },
      properties: customData,
    }),
  });
}

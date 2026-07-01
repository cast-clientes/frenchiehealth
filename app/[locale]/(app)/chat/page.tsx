"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Send, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import PaywallModal from "@/components/PaywallModal";
import { analytics } from "@/lib/analytics/events";

// ─── Typing channel names follow the pattern chat-typing-{userId}
// Admin dashboards or multi-tab sessions can subscribe to the same channel
// to see when that user is actively typing.

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Red de seguridad: el modelo a veces igual manda Markdown crudo pese al
// system prompt. Lo limpiamos acá para que nunca se vea código en pantalla.
function stripMarkdown(text: string): string {
  let out = text;
  out = out.replace(/^\s*[-_*]{3,}\s*$/gm, ""); // líneas horizontales ---
  out = out.replace(/^#{1,6}\s*/gm, ""); // ### títulos
  out = out.replace(/^[ \t]*[-*]\s+/gm, "• "); // - item / * item
  out = out.replace(/\*\*(.+?)\*\*/g, "$1"); // **negrita**
  out = out.replace(/__(.+?)__/g, "$1"); // __negrita__
  out = out.replace(/\*(\S(?:.*?\S)?)\*/g, "$1"); // *cursiva*
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim();
}

function renderChatMessage(text: string) {
  const lines = stripMarkdown(text).split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

const FREE_LIMIT = 5;

export default function ChatPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) ?? "en";

  const [initLoading, setInitLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [dogId, setDogId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [dogInfo, setDogInfo] = useState<{ name: string; photoUrl: string | null } | null>(null);
  // Realtime typing state
  const [userId, setUserId] = useState<string | null>(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remoteTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();

      setIsPaid(sub?.plan === "paid");

      const { data: dogs } = await supabase
        .from("dogs")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (dogs?.[0]) {
        setDogId(dogs[0].id);
        const { data: dogDetails } = await supabase
          .from("dogs")
          .select("name, photo_url")
          .eq("id", dogs[0].id)
          .single();
        if (dogDetails) {
          setDogInfo({ name: dogDetails.name, photoUrl: dogDetails.photo_url });
        }
      }

      if (sub?.plan !== "paid") {
        const { count } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("role", "user");

        const used = count ?? 0;
        setRemaining(Math.max(0, FREE_LIMIT - used));
        if (used >= FREE_LIMIT) setLimitReached(true);
      }

      // Load recent chat history
      const { data: history } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (history) {
        setMessages(history.reverse() as Message[]);
      }
    }

    init().finally(() => setInitLoading(false));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Realtime: subscribe to the user's typing channel.
  // Receives broadcasts from any other session (second tab, admin dashboard, etc.)
  // that also subscribes to `chat-typing-{userId}`.
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`chat-typing-${userId}`)
      .on(
        "broadcast",
        { event: "typing" },
        ({ payload }: { payload: { isTyping: boolean } }) => {
          if (payload?.isTyping) {
            setRemoteTyping(true);
            if (remoteTypingTimeoutRef.current)
              clearTimeout(remoteTypingTimeoutRef.current);
            remoteTypingTimeoutRef.current = setTimeout(
              () => setRemoteTyping(false),
              3000
            );
          } else {
            setRemoteTyping(false);
            if (remoteTypingTimeoutRef.current)
              clearTimeout(remoteTypingTimeoutRef.current);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (remoteTypingTimeoutRef.current)
        clearTimeout(remoteTypingTimeoutRef.current);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [userId]);

  // ── Realtime: broadcast typing status whenever the input changes.
  // Sends `isTyping: true` immediately; schedules `isTyping: false` 2 s later.
  // Admin sessions subscribed to the same channel receive these events.
  useEffect(() => {
    if (!userId || !channelRef.current || !input.trim()) return;

    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { isTyping: true },
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      channelRef.current?.send({
        type: "broadcast",
        event: "typing",
        payload: { isTyping: false },
      });
    }, 2000);
  }, [input, userId]);

  async function handleSend() {
    const msg = input.trim();
    if (!msg || loading || limitReached) return;

    analytics.chatMessageSent(messages.filter((m) => m.role === "user").length + 1, isPaid);

    setInput("");
    setLoading(true);
    setError("");

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        dogId,
        history: messages.slice(-10),
        locale,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === "limit_reached" || data.error === "daily_limit_reached") {
        setLimitReached(true);
        setRemaining(0);
        setShowPaywall(true);
      } else {
        setError(data.error ?? t("chat.errorMessage"));
      }
      setLoading(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.message },
    ]);

    if (!isPaid && remaining !== null) {
      setRemaining((prev) => Math.max(0, (prev ?? 0) - 1));
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen pt-6">
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        dogName={dogInfo?.name}
        dogPhotoUrl={dogInfo?.photoUrl ?? undefined}
        triggerReason="chat"
        locale={locale}
        freeLimit={FREE_LIMIT}
      />

      {/* Header */}
      <div className="px-4 pb-3 border-b border-[var(--brown-100)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          <h1 className="text-xl font-bold text-[var(--brown-800)]">
            {t("chat.title")}
          </h1>
        </div>
        <p className="text-xs text-[var(--brown-400)] mt-0.5">
          {t("chat.disclaimer")}
        </p>

        {!isPaid && remaining !== null && !limitReached && (
          <p className="text-xs text-amber-600 mt-1">
            {locale === "es"
              ? `${FREE_LIMIT - remaining} de ${FREE_LIMIT} mensajes usados`
              : `${FREE_LIMIT - remaining} of ${FREE_LIMIT} messages used`}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {initLoading ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-pulse">🐾</div>
          </div>
        ) : messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🐾</div>
            <p className="text-sm text-[var(--brown-400)]">
              {t("chat.emptyState")}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-[var(--accent)] text-white rounded-br-sm"
                  : "bg-white border border-[var(--brown-100)] text-[var(--brown-800)] rounded-bl-sm"
              )}
            >
              {renderChatMessage(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[var(--brown-100)] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[var(--brown-200)] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Multi-tab / admin typing indicator */}
        {remoteTyping && (
          <div className="flex justify-end pr-1">
            <p className="text-xs text-[var(--brown-400)] italic">
              {locale === "es"
                ? "Escribiendo desde otro dispositivo…"
                : "Typing from another device…"}
            </p>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input / limit wall */}
      <div
        className="px-4 pt-3 border-t border-[var(--brown-100)] bg-[var(--cream)]"
        style={{ paddingBottom: "calc(var(--bottom-nav-h, 56px) + env(safe-area-inset-bottom, 0px))" }}
      >
        {limitReached ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-[var(--brown-600)]">
              {t("chat.limitReached")}
            </p>
            <Link
              href="/upgrade"
              className="inline-block bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[var(--accent-dark)] transition-colors"
            >
              {t("subscription.upgrade")} →
            </Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={t("chat.placeholder")}
              aria-label={t("chat.placeholder")}
              className="flex-1 rounded-xl border border-[var(--brown-200)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              disabled={loading || limitReached}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading || limitReached}
              loading={loading}
              aria-label={t("chat.sendMessage")}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

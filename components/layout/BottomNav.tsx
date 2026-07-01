"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Activity, FileHeart, UtensilsCrossed, MessageCircle, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, key: "nav.home" },
  { href: "/tracker", icon: Activity, key: "nav.tracker" },
  { href: "/passport", icon: FileHeart, key: "nav.passport" },
  { href: "/feeding", icon: UtensilsCrossed, key: "nav.feeding" },
  { href: "/chat", icon: MessageCircle, key: "nav.chat" },
  { href: "/community", icon: Users, key: "nav.community" },
  { href: "/profile", icon: User, key: "nav.profile" },
] as const;

export function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--brown-100)] px-2 pb-safe z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-label={t(key)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-3 px-1 sm:py-3 transition-colors min-w-0",
                active
                  ? "text-[var(--accent)]"
                  : "text-[var(--brown-400)] hover:text-[var(--brown-600)]"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 flex-shrink-0",
                  active ? "text-[var(--accent)]" : "text-current"
                )}
              />
              <span className="hidden sm:block truncate text-xs max-w-full font-medium">{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

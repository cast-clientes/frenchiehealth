import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <main className="max-w-lg mx-auto pb-24 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

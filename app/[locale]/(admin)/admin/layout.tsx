import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "jacsolucionesgraficas@gmail.com";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");
  if (user.email !== ADMIN_EMAIL) redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white" }}>
      <header style={{ borderBottom: "1px solid #1e293b", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>🐾 Frenchie Admin</span>
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#64748b" }}>{ADMIN_EMAIL}</span>
      </header>
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {children}
      </main>
    </div>
  );
}

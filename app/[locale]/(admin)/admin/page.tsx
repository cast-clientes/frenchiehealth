import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function StatCard({ label, value, sub, color = "#e8714a" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: "1rem", padding: "1.25rem 1.5rem", borderLeft: `4px solid ${color}` }}>
      <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>{label}</p>
      <p style={{ fontSize: "2rem", fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.375rem" }}>{sub}</p>}
    </div>
  );
}

export default async function AdminPage() {
  // --- Auth guard: verify the caller is an allowed admin before using the service role key ---
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  const adminEmails = (process.env.ADMIN_EMAILS ?? "jacsolucionesgraficas@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  if (!user?.email || !adminEmails.includes(user.email.toLowerCase())) {
    redirect("/auth/login");
  }
  // --- End auth guard ---

  const service = await createServiceClient();

  const [
    { count: totalUsers },
    { count: totalDogs },
    { count: paidSubs },
    { count: foundingSubs },
    { count: totalSkinEntries },
    { count: totalChatMessages },
    { count: totalWeightEntries },
    { count: totalRespEntries },
    { data: foundingCounter },
    { data: recentSubs },
    { data: recentUsers },
  ] = await Promise.all([
    service.from("profiles").select("*", { count: "exact", head: true }),
    service.from("dogs").select("*", { count: "exact", head: true }),
    service.from("subscriptions").select("*", { count: "exact", head: true }).eq("plan", "paid").eq("status", "active"),
    service.from("subscriptions").select("*", { count: "exact", head: true }).in("plan_type", ["founder_monthly", "founder_annual"]).eq("status", "active"),
    service.from("skin_entries").select("*", { count: "exact", head: true }),
    service.from("chat_messages").select("*", { count: "exact", head: true }).eq("role", "user"),
    service.from("weight_entries").select("*", { count: "exact", head: true }),
    service.from("respiratory_entries").select("*", { count: "exact", head: true }),
    service.from("founding_members_counter").select("*").single(),
    service.from("subscriptions").select("id, user_id, plan, plan_type, status, created_at").eq("plan", "paid").order("created_at", { ascending: false }).limit(10),
    service.from("profiles").select("id, full_name, parent_role, created_at").order("created_at", { ascending: false }).limit(10),
  ]);

  const totalEntries = (totalSkinEntries ?? 0) + (totalWeightEntries ?? 0) + (totalRespEntries ?? 0);
  const freeUsers = (totalUsers ?? 0) - (paidSubs ?? 0);
  const conversionRate = totalUsers ? (((paidSubs ?? 0) / totalUsers) * 100).toFixed(1) : "0";

  const monthlyRevEst = (paidSubs ?? 0) * 8.99;

  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [
    { count: newUsersMonth },
    { count: newEntriesMonth },
    { count: newChatsMonth },
  ] = await Promise.all([
    service.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", `${thirtyDaysAgo}T00:00:00Z`),
    service.from("skin_entries").select("*", { count: "exact", head: true }).gte("created_at", `${thirtyDaysAgo}T00:00:00Z`),
    service.from("chat_messages").select("*", { count: "exact", head: true }).eq("role", "user").gte("created_at", `${thirtyDaysAgo}T00:00:00Z`),
  ]);

  const spotsLeft = foundingCounter ? foundingCounter.total_spots - foundingCounter.spots_taken : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>Panel de Control</h1>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Actualizado: {today}</p>
      </div>

      {/* Core KPIs */}
      <section>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Usuarios</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <StatCard label="Total usuarios" value={totalUsers ?? 0} sub={`+${newUsersMonth ?? 0} últimos 30 días`} color="#e8714a" />
          <StatCard label="Usuarios pagos" value={paidSubs ?? 0} sub={`${conversionRate}% conversión`} color="#22c55e" />
          <StatCard label="Usuarios free" value={freeUsers} sub="Sin suscripción activa" color="#64748b" />
          <StatCard label="Founding members" value={foundingSubs ?? 0} sub={`${spotsLeft} spots restantes`} color="#f59e0b" />
        </div>
      </section>

      {/* Revenue */}
      <section>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Revenue (estimado)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <StatCard label="MRR estimado" value={`$${monthlyRevEst.toFixed(0)}`} sub="Basado en $8.99/mes × pagos" color="#a855f7" />
          <StatCard label="ARR estimado" value={`$${(monthlyRevEst * 12).toFixed(0)}`} sub="Anualizado" color="#7c3aed" />
        </div>
      </section>

      {/* Content */}
      <section>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Contenido</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <StatCard label="Total perros" value={totalDogs ?? 0} color="#7bb8d4" />
          <StatCard label="Entradas totales" value={totalEntries} sub={`+${newEntriesMonth ?? 0} en 30 días`} color="#7bb8d4" />
          <StatCard label="Mensajes de chat" value={totalChatMessages ?? 0} sub={`+${newChatsMonth ?? 0} en 30 días`} color="#7bb8d4" />
          <StatCard label="Entradas de piel" value={totalSkinEntries ?? 0} color="#7bb8d4" />
          <StatCard label="Entradas de peso" value={totalWeightEntries ?? 0} color="#7bb8d4" />
          <StatCard label="Episodios resp." value={totalRespEntries ?? 0} color="#7bb8d4" />
        </div>
      </section>

      {/* Founding members bar */}
      {foundingCounter && (
        <section>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Founding Members</h2>
          <div style={{ background: "#1e293b", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: 700 }}>{foundingCounter.spots_taken} / {foundingCounter.total_spots} spots tomados</span>
              <span style={{ color: foundingCounter.offer_active ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: "0.875rem" }}>
                {foundingCounter.offer_active ? "✅ Activo" : "❌ Cerrado"}
              </span>
            </div>
            <div style={{ background: "#0f172a", borderRadius: "999px", height: "12px" }}>
              <div style={{ background: "#f59e0b", borderRadius: "999px", height: "12px", width: `${(foundingCounter.spots_taken / foundingCounter.total_spots) * 100}%`, transition: "width 0.4s" }} />
            </div>
            <p style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              Cierra: {new Date(foundingCounter.offer_ends_at).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </section>
      )}

      {/* Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent paid subs */}
        <section>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Últimas suscripciones</h2>
          <div style={{ background: "#1e293b", borderRadius: "1rem", overflow: "hidden" }}>
            {recentSubs && recentSubs.length > 0 ? recentSubs.map((sub, i) => (
              <div key={sub.id} style={{ padding: "0.75rem 1rem", borderBottom: i < recentSubs.length - 1 ? "1px solid #0f172a" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{sub.plan_type ?? sub.plan}</span>
                  <p style={{ color: "#64748b", fontSize: "0.7rem", marginTop: "0.125rem" }}>
                    {new Date(sub.created_at).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.625rem", borderRadius: "999px", background: sub.status === "active" ? "#14532d" : "#450a0a", color: sub.status === "active" ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
                  {sub.status}
                </span>
              </div>
            )) : (
              <p style={{ padding: "1rem", color: "#64748b", fontSize: "0.875rem" }}>Sin suscripciones aún.</p>
            )}
          </div>
        </section>

        {/* Recent users */}
        <section>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Usuarios recientes</h2>
          <div style={{ background: "#1e293b", borderRadius: "1rem", overflow: "hidden" }}>
            {recentUsers && recentUsers.length > 0 ? recentUsers.map((u, i) => (
              <div key={u.id} style={{ padding: "0.75rem 1rem", borderBottom: i < recentUsers.length - 1 ? "1px solid #0f172a" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{u.full_name ?? "Sin nombre"}</span>
                  <p style={{ color: "#64748b", fontSize: "0.7rem", marginTop: "0.125rem" }}>
                    {u.parent_role ?? "parent"} · {new Date(u.created_at).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#475569" }}>{u.id.slice(0, 8)}</span>
              </div>
            )) : (
              <p style={{ padding: "1rem", color: "#64748b", fontSize: "0.875rem" }}>Sin usuarios aún.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

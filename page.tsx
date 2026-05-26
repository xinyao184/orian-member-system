"use client";
import { Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { GlassCard, Spinner } from "@/components/ui";
import { useLang } from "@/i18n/LangProvider";
import { api } from "@/lib/client";
import type { Staff } from "@/lib/types";

export default function StaffPage() {
  return <AdminShell ownerOnly><StaffMgmt /></AdminShell>;
}

function StaffMgmt() {
  const { t } = useLang();
  const [staff, setStaff] = useState<Staff[] | null>(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"owner" | "staff">("staff");
  const [busy, setBusy] = useState(false);

  const load = () => api<Staff[]>("/api/admin?view=staff").then(setStaff).catch(() => {});
  useEffect(() => { load(); }, []);
  if (!staff) return <Spinner />;

  async function add() {
    if (!username.trim()) return; setBusy(true);
    try { await api("/api/admin", { method: "POST", body: JSON.stringify({ username, role }) }); setUsername(""); load(); }
    catch (e: any) { alert((t as any)[e.message] ?? t.err_generic); } finally { setBusy(false); }
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return;
    await api("/api/admin", { method: "DELETE", body: JSON.stringify({ id }) }); load();
  }

  return (
    <div>
      <h1 className="serif text-3xl text-rose-light mb-1">{t.a_staff}</h1>
      <p className="text-cream/50 text-sm mb-5">{t.a_password}: 0809</p>

      <GlassCard className="p-5 mb-5">
        <p className="text-cream/70 text-sm mb-3 flex items-center gap-2"><UserPlus size={16} />{t.s_add}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.a_username}
            className="flex-1 px-3 py-2.5 rounded-xl bg-cream/10 border border-cream/15 text-cream placeholder-cream/30 outline-none focus:border-rose/60 text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-cream/10 border border-cream/15 text-cream outline-none text-sm">
            <option value="staff" className="bg-cocoa">{t.s_role_staff}</option>
            <option value="owner" className="bg-cocoa">{t.s_role_owner}</option>
          </select>
          <button onClick={add} disabled={busy} className="px-5 py-2.5 rounded-xl bg-rose text-cocoa-dark font-medium text-sm tap active:scale-95">{t.confirm}</button>
        </div>
      </GlassCard>

      <div className="space-y-2">
        {staff.map((s) => (
          <GlassCard key={s.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-cream">{s.username}</p>
              <p className="text-cream/40 text-xs">{s.role === "owner" ? t.s_role_owner : t.s_role_staff}</p>
            </div>
            <button onClick={() => del(s.id)} className="text-cream/40 hover:text-strawberry transition p-2"><Trash2 size={18} /></button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

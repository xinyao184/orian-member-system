"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Store, Users, UserCog, Settings as Cog, LogOut } from "lucide-react";
import { Logo, LangToggle, Spinner } from "@/components/ui";
import { useLang } from "@/i18n/LangProvider";
import { api } from "@/lib/client";
import type { Session } from "@/lib/auth";

export function AdminShell({ children, ownerOnly = false }: { children: React.ReactNode; ownerOnly?: boolean }) {
  const { t } = useLang();
  const router = useRouter();
  const path = usePathname();
  const [session, setSession] = useState<Session | null | "loading">("loading");

  useEffect(() => {
    api<Session>("/api/admin?view=session")
      .then((s) => {
        if (ownerOnly && s.role !== "owner") { router.replace("/admin/dashboard"); return; }
        setSession(s);
      })
      .catch(() => router.replace("/admin/login"));
  }, [ownerOnly, router]);

  if (session === "loading") return <main className="min-h-screen bg-cocoa-atmos pt-20"><Spinner /></main>;
  if (!session) return null;

  const items = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: t.a_dashboard, owner: false },
    { href: "/admin/market", icon: Store, label: t.a_market_mode, owner: false },
    { href: "/admin/customers", icon: Users, label: t.a_customers, owner: false },
    { href: "/admin/staff", icon: UserCog, label: t.a_staff, owner: true },
    { href: "/admin/settings", icon: Cog, label: t.a_settings, owner: true },
  ].filter((i) => !i.owner || session.role === "owner");

  async function logout() { await api("/api/auth", { method: "DELETE" }); router.replace("/admin/login"); }

  return (
    <div className="min-h-screen bg-cocoa-atmos flex flex-col md:flex-row">
      {/* Sidebar (desktop) / bottom bar (mobile) */}
      <aside className="md:w-60 md:min-h-screen glass md:border-r border-cream/10 flex md:flex-col">
        <div className="hidden md:block p-5 border-b border-cream/10">
          <Logo size={40} withText />
          <p className="text-cream/40 text-xs mt-2">{session.username} · {session.role === "owner" ? t.s_role_owner : t.s_role_staff}</p>
        </div>
        <nav className="flex md:flex-col flex-1 md:p-3 overflow-x-auto no-scrollbar">
          {items.map((i) => {
            const active = path === i.href;
            const Icon = i.icon;
            return (
              <Link key={i.href} href={i.href}
                className={`flex flex-col md:flex-row items-center md:gap-3 gap-1 px-4 py-3 md:rounded-xl text-xs md:text-sm whitespace-nowrap transition ${active ? "md:bg-rose/20 text-rose-light" : "text-cream/60 hover:text-cream"}`}>
                <Icon size={20} /><span>{i.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex flex-col gap-3 p-3">
          <LangToggle />
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/60 hover:text-strawberry transition text-sm">
            <LogOut size={20} />{t.a_logout}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">{children}</main>
      <button onClick={logout} className="md:hidden fixed top-4 right-4 glass rounded-full p-2 text-cream/60 z-40"><LogOut size={18} /></button>
    </div>
  );
}

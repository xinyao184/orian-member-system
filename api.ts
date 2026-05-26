import { supabaseAdmin } from "./supabase";
import type { RewardRule } from "./types";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function logAudit(entry: {
  staff_username: string;
  member_phone?: string | null;
  member_ig?: string | null;
  action: string;
  notes?: string | null;
}) {
  const db = supabaseAdmin();
  await db.from("audit_log").insert({
    staff_username: entry.staff_username,
    member_phone: entry.member_phone ?? null,
    member_ig: entry.member_ig ?? null,
    action: entry.action,
    notes: entry.notes ?? null,
  });
}

// Basic phone normalisation/validation (Malaysian-friendly, lenient).
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-()]/g, "");
  if (!/^\+?\d{7,15}$/.test(cleaned)) return null;
  return cleaned;
}

export async function getRewardRules(): Promise<RewardRule[]> {
  const db = supabaseAdmin();
  const { data } = await db.from("settings").select("reward_rules").eq("id", 1).single();
  return (data?.reward_rules as RewardRule[]) ?? [];
}

// Today's birthday check in the venue's local sense (date-only compare).
export function isBirthdayToday(birthday: string | null): boolean {
  if (!birthday) return false;
  const b = new Date(birthday);
  const now = new Date();
  return b.getMonth() === now.getMonth() && b.getDate() === now.getDate();
}

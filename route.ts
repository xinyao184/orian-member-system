import { supabaseAdmin } from "@/lib/supabase";
import { getSession, requireOwner } from "@/lib/auth";
import { jsonError, logAudit, isBirthdayToday } from "@/lib/api";

// POST /api/surprise  { member_id, content }  → Owner only
export async function POST(req: Request) {
  const session = await getSession();
  if (!requireOwner(session)) return jsonError("err_no_permission", 403);

  const { member_id, content } = await req.json().catch(() => ({}));
  if (!member_id || !content) return jsonError("err_generic");

  const db = supabaseAdmin();
  const { data: member } = await db.from("members").select("*").eq("id", member_id).single();
  if (!member) return jsonError("err_not_found", 404);

  await db.from("surprise_rewards").insert({ member_id, content, sent_by: session.username });
  await logAudit({
    staff_username: session.username, member_phone: member.phone, member_ig: member.ig_handle,
    action: "surprise_reward", notes: content,
  });
  return Response.json({ ok: true });
}

// PATCH /api/surprise  { member_id, kind: "birthday" }  → staff marks birthday gift claimed
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return jsonError("err_no_permission", 401);

  const { member_id, kind, surprise_id } = await req.json().catch(() => ({}));
  const db = supabaseAdmin();
  const { data: member } = await db.from("members").select("*").eq("id", member_id).single();
  if (!member) return jsonError("err_not_found", 404);

  if (kind === "birthday") {
    if (!isBirthdayToday(member.birthday)) return jsonError("err_generic");
    const year = new Date().getFullYear();
    await db.from("members").update({ birthday_gift_claimed_year: year }).eq("id", member_id);
    await logAudit({ staff_username: session.username, member_phone: member.phone, member_ig: member.ig_handle, action: "birthday_gift_claimed" });
    return Response.json({ ok: true });
  }
  if (surprise_id) {
    await db.from("surprise_rewards").update({ claimed: true }).eq("id", surprise_id);
    await logAudit({ staff_username: session.username, member_phone: member.phone, member_ig: member.ig_handle, action: "surprise_claimed" });
    return Response.json({ ok: true });
  }
  return jsonError("err_generic");
}

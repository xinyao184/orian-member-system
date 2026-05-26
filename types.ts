// ─── Core domain types & business rules for O'rian Dessert membership ───

export const TOTAL_STAMPS = 12;
export const STAMP_EXPIRY_DAYS = 365;

// Reward milestones. claimable once per cycle (per spec).
export interface RewardRule {
  threshold: number; // stamps required
  code: string;
  label_zh: string;
  label_en: string;
  resets: boolean; // true => redeeming clears stamps & starts a new cycle
}

// Default rules — also stored in `settings` table so Owner can edit live.
export const DEFAULT_REWARD_RULES: RewardRule[] = [
  { threshold: 3,  code: "RM5_OFF",        label_zh: "RM5 折扣",            label_en: "RM5 OFF",                resets: false },
  { threshold: 6,  code: "RM10_OFF",       label_zh: "RM10 折扣",           label_en: "RM10 OFF",               resets: false },
  { threshold: 9,  code: "FREE_2PCS",      label_zh: "免费 2 粒大福",        label_en: "FREE 2pcs Daifuku",      resets: false },
  { threshold: 12, code: "FREE_BOX_4PCS",  label_zh: "免费 1 盒 4 粒大福",   label_en: "FREE 1 Box 4pcs Daifuku", resets: true  },
];

export type StaffRole = "owner" | "staff";

export interface Staff {
  id: string;
  username: string;
  role: StaffRole;
  created_at: string;
}

export interface Member {
  id: string;            // UUID — used in public URL, never exposes phone
  phone: string;         // unique
  ig_handle: string | null;
  avatar_url: string | null;
  birthday: string | null;       // ISO date
  stamps: number;                // current cycle count (0..12)
  cycle: number;                 // increments on 12-stamp reset
  last_stamp_at: string | null;  // drives 365-day expiry
  birthday_gift_claimed_year: number | null; // year the bday gift was claimed
  created_at: string;
}

export interface StampEvent {
  id: string;
  member_id: string;
  cycle: number;
  delta: number;            // +1 normally, -1 for staff correction
  staff_username: string;
  notes: string | null;
  created_at: string;
  expired: boolean;         // archived when cycle expires
}

export interface Redemption {
  id: string;
  member_id: string;
  cycle: number;
  reward_code: string;
  reward_label: string;
  staff_username: string;
  notes: string | null;
  created_at: string;
}

export interface SurpriseReward {
  id: string;
  member_id: string;
  content: string;
  sent_by: string;
  claimed: boolean;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  staff_username: string;
  member_phone: string | null;
  member_ig: string | null;
  action: string;
  notes: string | null;
  created_at: string;
}

export interface MarketLocation {
  place: string;
  date: string;
  time: string;
  note: string;
}

export interface Settings {
  id: number;
  reward_rules: RewardRule[];
  market_location: MarketLocation | null;
  updated_at: string;
}

// ─── Derived helpers ───

export function stampsExpired(member: Pick<Member, "last_stamp_at">): boolean {
  if (!member.last_stamp_at) return false;
  const last = new Date(member.last_stamp_at).getTime();
  return Date.now() - last > STAMP_EXPIRY_DAYS * 86_400_000;
}

export function nextRewardGap(stamps: number, rules: RewardRule[]): { gap: number; rule: RewardRule } | null {
  const upcoming = rules
    .filter((r) => r.threshold > stamps)
    .sort((a, b) => a.threshold - b.threshold)[0];
  if (!upcoming) return null;
  return { gap: upcoming.threshold - stamps, rule: upcoming };
}

export function unlockedRewards(stamps: number, rules: RewardRule[]): RewardRule[] {
  return rules.filter((r) => stamps >= r.threshold);
}

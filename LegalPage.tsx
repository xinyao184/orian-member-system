"use client";
import Link from "next/link";
import { Logo, LangToggle } from "@/components/ui";
import { useLang } from "@/i18n/LangProvider";

const content = {
  privacy: {
    zh: { title: "隐私政策", body: [
      "O'rian Dessert 重视您的隐私。本系统仅收集为会员服务所必需的资料：电话号码、Instagram 名字、可选的头像与生日。",
      "您的电话号码不会显示在会员链接中。会员页面使用随机生成的会员编号（UUID）以保护您的隐私。",
      "我们使用您的资料来记录集点、发放奖励、生日礼物及通知最近市集信息。我们不会将您的资料出售给第三方。",
      "您可随时联系 @orian.dessert 要求查看或删除您的会员资料。",
    ]},
    en: { title: "Privacy Policy", body: [
      "O'rian Dessert respects your privacy. We collect only what is necessary for membership: phone number, Instagram handle, and optional avatar and birthday.",
      "Your phone number is never shown in the member link. Member pages use a randomly generated member ID (UUID) to protect your privacy.",
      "We use your data to track stamps, issue rewards, birthday gifts, and share latest market information. We do not sell your data to third parties.",
      "You may contact @orian.dessert at any time to view or delete your membership data.",
    ]},
  },
  terms: {
    zh: { title: "条款与细则", body: [
      "每购买 1 盒 4 粒装大福可获得 1 枚印章。集点卡共 12 格。",
      "奖励：3 格 RM5 折扣、6 格 RM10 折扣、9 格免费 2 粒大福、12 格免费 1 盒 4 粒大福。每个奖励每轮只能兑换一次。",
      "兑换 12 格奖励后印章自动清零并开始新一轮，过往记录将被保留。",
      "印章有效期为最后一次集点起 365 天，逾期自动清零。",
      "印章与奖励仅可由 O'rian Dessert 员工操作发放，恕不可转让或兑换现金。",
      "O'rian Dessert 保留随时修改奖励规则的权利。",
    ]},
    en: { title: "Terms & Conditions", body: [
      "Each purchase of 1 box of 4 daifuku earns 1 stamp. The card has 12 stamps total.",
      "Rewards: 3 stamps RM5 OFF, 6 stamps RM10 OFF, 9 stamps free 2pcs daifuku, 12 stamps free 1 box of 4pcs. Each reward is redeemable once per cycle.",
      "After redeeming the 12-stamp reward, stamps reset to zero and a new cycle begins; past records are preserved.",
      "Stamps are valid for 365 days from the last stamp earned, after which they expire automatically.",
      "Stamps and rewards are issued only by O'rian Dessert staff, are non-transferable and have no cash value.",
      "O'rian Dessert reserves the right to amend reward rules at any time.",
    ]},
  },
};

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const { lang, t } = useLang();
  const c = content[kind][lang];
  return (
    <main className="min-h-screen bg-cocoa-atmos px-6 py-6">
      <header className="flex items-center justify-between max-w-2xl mx-auto mb-8">
        <Link href="/"><Logo size={40} /></Link>
        <LangToggle />
      </header>
      <article className="glass rounded-3xl p-8 max-w-2xl mx-auto">
        <h1 className="serif text-4xl text-rose-light mb-6">{c.title}</h1>
        <div className="space-y-4">
          {c.body.map((p, i) => <p key={i} className="text-cream/70 leading-relaxed text-sm">{i + 1}. {p}</p>)}
        </div>
        <Link href="/" className="inline-block mt-8 text-gold text-sm hover:underline">← {t.back}</Link>
      </article>
    </main>
  );
}

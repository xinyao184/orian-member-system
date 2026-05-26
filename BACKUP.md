# Backup &amp; Data Guide / 备份与数据指南

Your customers' stamps and history are valuable. This guide covers keeping them safe and getting your data out whenever you want.

顾客的印章和历史记录非常宝贵。本指南介绍如何保证数据安全，以及随时导出数据。

---

## 1. Automatic backups (Supabase) / 自动备份

Supabase backs up your database automatically:

- **Free plan:** daily backups, retained for a rolling window. 免费版每日自动备份
- **Pro plan:** daily backups with point-in-time recovery (restore to any moment). 专业版支持时间点恢复

To view / restore: **Supabase → Project → Database → Backups**. 在 Supabase 后台查看或恢复备份。

> For a real business, the **Pro plan** ($25/mo) is strongly recommended for point-in-time recovery and longer retention. 商业使用建议升级专业版。

---

## 2. One-click export from the app / 应用内一键导出

Log in as **Owner → Settings → Export**. 用 Owner 登录到设置页导出。

- **Export CSV** — opens in Excel, Numbers, Google Sheets. 通用表格格式
- **Export Excel (.xlsx)** — formatted workbook. Excel 工作簿

Each export includes every member: name, phone, Instagram, birthday, current stamps, cycle, total stamps earned, rewards redeemed, and join date. 导出包含所有会员的完整信息。

**Do this regularly** (e.g. weekly) and keep a copy in your own Google Drive / iCloud. 建议每周导出并存到自己的云盘。

---

## 3. Full database export (advanced) / 完整数据库导出（进阶）

For a complete snapshot of everything (all tables, history, audit log):

1. **Supabase → Database → Backups → Download** (Pro), **or**
2. Use the connection string under **Project Settings → Database** with `pg_dump`:

```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  --no-owner --clean > orian-backup-$(date +%Y%m%d).sql
```

Store the `.sql` file safely. To restore, run it against a fresh database with `psql`. 保存 .sql 文件，恢复时用 psql 导入。

---

## 4. What's stored where / 数据存储位置

| Data | Location |
|---|---|
| Members, stamps, redemptions, surprises, audit log, settings | Supabase Postgres tables |
| Customer avatars | Supabase Storage `avatars` bucket (or inline data URL) |
| Staff login | `staff` table + `ADMIN_SHARED_PASSWORD` env var |

All member-facing data is readable publicly **by UUID only** (never by phone), and all writes (stamps, redemptions, edits) go through secured server routes using the service-role key. 所有写操作均通过服务端安全路由处理。

---

## 5. Privacy notes / 隐私说明

- Phone numbers are **never** placed in URLs. The member card link uses an unguessable UUID: `member.orian.com/member?id=…`. 电话号码绝不出现在网址中。
- The member page masks the phone number (shows only last digits). 会员页面对电话做掩码处理。
- Only logged-in staff can see full phone numbers and history. 仅登录员工可见完整信息。
- See the in-app **Privacy** and **Terms** pages (`/privacy`, `/terms`) for the customer-facing policy. 顾客隐私政策见应用内页面。

---

## 6. Disaster recovery checklist / 灾难恢复清单

If you ever need to rebuild from scratch:

1. Create a new Supabase project. 新建 Supabase 项目
2. Run `supabase/schema.sql`. 运行建表脚本
3. Restore data from your latest `.sql` dump or re-import members from a CSV export. 从备份恢复数据
4. Update the three Supabase keys in Vercel and **Redeploy**. 更新 Vercel 密钥并重新部署

Keep this repo (the code) on GitHub and at least one recent data export off-platform, and you can always recover. 代码存 GitHub + 定期导出数据，即可随时恢复。

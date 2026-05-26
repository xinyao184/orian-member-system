# Deployment Guide / 部署指南

This guide takes you from zero to a live site at **member.orian.com**, step by step.
No prior server experience needed — every step is click-by-click.

本指南将带你从零开始，一步步部署到 **member.orian.com**。无需服务器经验，每一步都有详细点击说明。

> **Total time / 总耗时:** ~30–45 minutes
> **Cost / 费用:** Free tier is enough to start (Supabase Free + Vercel Hobby). 免费额度足够起步。

---

## Overview / 总览

You will do four things:

1. **Supabase** — create the database (stores members, stamps, staff). 创建数据库
2. **Vercel** — host the website. 托管网站
3. **Environment variables** — connect the two securely. 环境变量连接两者
4. **Custom domain** — point `member.orian.com` to the site. 绑定自定义域名

```
  Customer phone ──▶  Vercel (Next.js site)  ──▶  Supabase (Postgres + Storage)
                         member.orian.com
```

---

## Part 1 — Supabase (database) / 数据库

### 1.1 Create a project / 创建项目

1. Go to **https://supabase.com** and sign up (GitHub login is fastest). 注册账号
2. Click **New project**. 点击新建项目
3. Fill in:
   - **Name / 名称:** `orian-member`
   - **Database Password / 数据库密码:** click *Generate a password* and **save it somewhere safe**. 生成并保存密码
   - **Region / 区域:** choose the closest to Malaysia — **Southeast Asia (Singapore)**. 选择新加坡区域
4. Click **Create new project** and wait ~2 minutes while it provisions. 等待约2分钟

### 1.2 Run the database schema / 运行数据库脚本

1. In the left sidebar, open **SQL Editor**. 打开 SQL 编辑器
2. Click **+ New query**. 新建查询
3. Open the file **`supabase/schema.sql`** from this project, copy **all** of it, and paste it into the editor. 复制粘贴整个 schema.sql
4. Click **Run** (or press Cmd/Ctrl + Enter). 点击运行
5. You should see **Success. No rows returned**. This created every table, index, security policy, the three staff accounts, default reward rules, and the avatars storage bucket. 看到成功提示即可

> If you ever want to start fresh, the script is safe to re-run — it uses `create table if not exists` and `on conflict do nothing`. 脚本可安全重复运行。

### 1.3 Copy your API keys / 复制密钥

1. In the left sidebar, open **Project Settings** (gear icon) → **API**. 打开项目设置 → API
2. You need three values. Keep this tab open — you'll paste them into Vercel in Part 3:

| Value in Supabase | Goes into env var | Public? |
|---|---|---|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` | yes |
| **Project API keys → `anon` `public`** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes |
| **Project API keys → `service_role` `secret`** | `SUPABASE_SERVICE_ROLE_KEY` | **NO — keep secret** |

> ⚠️ The **service_role** key bypasses all security rules. Never put it in frontend code or share it. It is only ever used server-side in this app. **service_role 密钥拥有最高权限，切勿泄露或放入前端。**

---

## Part 2 — Get the code onto GitHub / 上传代码到 GitHub

Vercel deploys from a Git repository. This is the easiest path.

1. Create a free account at **https://github.com** if you don't have one. 注册 GitHub
2. Click **+** (top right) → **New repository**. 新建仓库
   - **Name:** `orian-member`
   - Set it to **Private**. 设为私有
   - Do **not** add a README (we already have one). 不要勾选添加 README
3. On your computer, in the project folder, run:

```bash
git init
git add .
git commit -m "O'rian membership system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/orian-member.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. 把 YOUR_USERNAME 换成你的用户名。

> **No Git installed?** You can instead drag-and-drop the project files using GitHub's web uploader, or use **GitHub Desktop** (https://desktop.github.com) — a click-only app. 没装 Git 可用 GitHub Desktop 图形界面上传。

---

## Part 3 — Vercel (hosting) / 托管

### 3.1 Import the project / 导入项目

1. Go to **https://vercel.com** and sign up with your **GitHub** account. 用 GitHub 登录 Vercel
2. Click **Add New… → Project**. 新建项目
3. Find **`orian-member`** in the list and click **Import**. 导入仓库
4. Vercel auto-detects **Next.js** — leave the build settings as they are. 自动识别 Next.js，保持默认

### 3.2 Add environment variables / 添加环境变量

Before clicking Deploy, expand **Environment Variables** and add each of these (Name → Value):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Project URL from 1.3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon public key from 1.3 |
| `SUPABASE_SERVICE_ROLE_KEY` | your service_role secret key from 1.3 |
| `ADMIN_SESSION_SECRET` | a long random string — generate one below |
| `ADMIN_SHARED_PASSWORD` | `0809` (or change to your preferred staff password) |
| `NEXT_PUBLIC_SITE_URL` | `https://member.orian.com` |

**Generate a session secret / 生成会话密钥** — run this locally and paste the output:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> `ADMIN_SESSION_SECRET` signs the staff login cookie. Any long random value works; just don't leave it blank. 任意长随机字符串即可，但不能为空。

### 3.3 Deploy / 部署

1. Click **Deploy**. 点击部署
2. Wait ~2 minutes. 等待约2分钟
3. Vercel gives you a temporary link like **`https://orian-member-xxxx.vercel.app`**. Open it — the site is live! 你会得到一个临时网址，打开即可访问

**Test it now / 现在测试:**
- Visit the temp link → you should see the O'rian landing page. 看到首页
- Go to `/admin/login`, choose **Owner**, password `0809` → you should reach Market Mode. 测试后台登录
- Register a test customer at `/register`, then add a stamp from Market Mode. 注册测试顾客并加一个印章

---

## Part 4 — Custom domain member.orian.com / 绑定域名

You need access to wherever **orian.com**'s DNS is managed (e.g. Namecheap, GoDaddy, Cloudflare). 你需要能管理 orian.com 域名 DNS 的权限。

### 4.1 Add the domain in Vercel / 在 Vercel 添加域名

1. In your Vercel project, open **Settings → Domains**. 打开项目设置 → 域名
2. Type `member.orian.com` and click **Add**. 输入并添加
3. Vercel shows you a DNS record to create — usually a **CNAME**:

| Type | Name / Host | Value / Target |
|---|---|---|
| `CNAME` | `member` | `cname.vercel-dns.com` |

### 4.2 Create the DNS record / 创建 DNS 记录

1. Log in to your domain registrar (where orian.com lives). 登录域名服务商
2. Open **DNS settings** for orian.com. 打开 DNS 设置
3. Add a new record exactly as Vercel showed:
   - **Type:** CNAME
   - **Host/Name:** `member`
   - **Value/Target:** `cname.vercel-dns.com`
   - **TTL:** Auto / default
4. Save. 保存

### 4.3 Wait for verification / 等待生效

- Back in Vercel's Domains page, it will show **Valid Configuration** once DNS propagates — usually a few minutes, sometimes up to an hour. 几分钟到一小时内生效
- Vercel **automatically issues a free HTTPS certificate**. No action needed. 自动签发 HTTPS 证书
- Once green, **https://member.orian.com** is live. 完成后域名即可访问

> Make sure `NEXT_PUBLIC_SITE_URL` (Part 3.2) is set to `https://member.orian.com` so QR codes and member links use the real domain. After changing any env var, click **Redeploy** in Vercel. 修改环境变量后需在 Vercel 点击重新部署。

---

## Part 5 — Staff accounts / 员工账号

The schema already created three accounts. They all use the shared password from `ADMIN_SHARED_PASSWORD` (default **`0809`**):

数据库已创建三个账号，共用 `ADMIN_SHARED_PASSWORD`（默认 `0809`）：

| Username | Role | Powers |
|---|---|---|
| **Owner** | owner | Everything: −1 stamp, edit rules, surprise rewards, manage staff, export. 全部权限 |
| **Staff 1** | staff | Search, add member, +1 stamp, redeem, view. 日常操作 |
| **Staff 2** | staff | Same as Staff 1. 同上 |

**To change the password / 修改密码:** update `ADMIN_SHARED_PASSWORD` in Vercel → Settings → Environment Variables, then **Redeploy**. 在 Vercel 修改环境变量后重新部署。

**To add / rename staff / 添加或重命名员工:** log in as **Owner → Staff** page, or edit the `staff` table in Supabase → Table Editor. 用 Owner 登录到员工页面，或在 Supabase 表编辑器修改。

---

## Updating the site later / 后续更新

Any time you change the code:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel **auto-deploys** every push to `main` within ~2 minutes. 每次推送 Vercel 自动部署。

---

## Troubleshooting / 常见问题

| Symptom / 现象 | Fix / 解决 |
|---|---|
| Site loads but login fails | Check `ADMIN_SHARED_PASSWORD` and `ADMIN_SESSION_SECRET` are set in Vercel, then Redeploy. 检查环境变量并重新部署 |
| "Failed to fetch" / data won't load | Check the three Supabase keys are correct and `NEXT_PUBLIC_SUPABASE_URL` has no trailing slash. 检查 Supabase 密钥 |
| QR / member links use vercel.app not your domain | Set `NEXT_PUBLIC_SITE_URL=https://member.orian.com` and Redeploy. 设置站点 URL 并重新部署 |
| Domain stuck on "Invalid Configuration" | Double-check the CNAME host is `member` and value is `cname.vercel-dns.com`; wait for DNS. 核对 CNAME 记录 |
| Avatars won't upload | In Supabase → Storage, confirm the `avatars` bucket exists (schema creates it). 确认 avatars 存储桶存在 |

Need data safety? See **[BACKUP.md](BACKUP.md)**. 数据备份见 BACKUP.md。

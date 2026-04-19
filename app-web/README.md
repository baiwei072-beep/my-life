# MyLife Phase One Web

这是第一期正式版网站骨架，目标是把现在的静态个人页升级成真正的多用户私密空间：

- 真实注册和登录
- 每个账号只看得到自己的内容
- 发帖、删帖、头像、空间描述都进入数据库
- 用数据库权限做隐私隔离，不再依赖浏览器 `localStorage`
- 当前注册方式先简化成 `用户名 + 密码`

## 目录说明

- `app/`: Next.js App Router 页面
- `app/actions.js`: 登录、发帖、删帖、更新资料
- `lib/supabase/`: Supabase 客户端封装
- `supabase/schema.sql`: 数据表和 RLS 策略

## 本地启动

这台机器当前没有 `node` 和 `npm`，所以我已经把脚手架手工写好。你本机装好 Node 20 之后，进入这个目录执行：

```bash
cd "/Users/mikeee/Desktop/CodeX/Mike Spce/blog/app-web"
npm install
cp .env.example .env.local
npm run dev
```

## 你还需要准备

1. 一个 Supabase 项目
2. 把 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 写进 `.env.local`
3. 在 Supabase SQL Editor 里执行 `supabase/schema.sql`

## 这一期已经落下来的点

- `/login`: 用户名注册和登录
- `/`: 登录后首页，只查询自己的 `posts`
- `/post/[id]`: 只允许查看自己的文章
- `/settings/profile`: 修改昵称、空间描述、头像预设
- `middleware.js`: 刷新登录态
- `schema.sql`: `profiles / spaces / posts / avatar_presets` + RLS

## 当前认证说明

- 页面上只展示 `用户名 + 密码`
- 内部仍然通过 Supabase Auth 创建账号
- 用户名会自动映射成系统内部邮箱地址
- 为了避免确认邮件挡住流程，请在 Supabase 的 `Authentication -> Providers -> Email` 里关闭 `Confirm email`

## 第二期再接的东西

- 手机验证码登录
- 微信登录
- 自定义上传头像
- 语音上传与 AI 分类
- Playwright 端到端测试

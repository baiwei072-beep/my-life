# 第一期开工步骤

按这个顺序做，不容易乱：

1. 安装 Node 20

```bash
brew install node
node -v
npm -v
```

2. 进入正式版目录并安装依赖

```bash
cd "/Users/mikeee/Desktop/CodeX/Mike Spce/blog/app-web"
npm install
```

3. 创建 Supabase 项目

- 打开 `https://supabase.com/dashboard`
- 新建项目
- 记下：
  - Project URL
  - anon public key

4. 写环境变量

```bash
cp .env.example .env.local
```

把 `.env.local` 改成：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anonkey
```

5. 执行数据库脚本

- 打开 Supabase 的 SQL Editor
- 复制 `supabase/schema.sql`
- 运行

6. 打开 Auth 设置

- 在 Supabase Dashboard 里启用 Email 登录
- 关闭 `Confirm email`
- 第一阶段虽然界面上是用户名密码，但底层仍走 Supabase 的 Email Provider
- 手机 OTP 和微信登录后面再加

7. 启动本地开发

```bash
npm run dev
```

打开：

`http://localhost:3000/login`

8. 第一轮自测

- 注册一个账号
- 登录后进入 `/`
- 发布一条内容
- 到 `/settings/profile` 改昵称和空间描述
- 再注册第二个账号
- 确认第二个账号看不到第一个账号的帖子

9. 部署

- 把 `app-web` 推到 GitHub
- 在 Vercel 导入这个目录
- 补环境变量
- 部署

10. 部署后复测

- 未登录访问 `/` 应跳到 `/login`
- A 用户不能看到 B 用户的帖子
- A 用户不能删 B 用户帖子

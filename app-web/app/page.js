import Link from "next/link";

import { createPost, deletePost, signOut } from "@/app/actions";
import { requireUser } from "@/lib/auth";

function themeLabel(category) {
  return {
    growth: "个人成长",
    daily: "生活流水",
    business: "商业想法",
    funny: "搞笑时刻",
  }[category] || "生活流水";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildSignal(posts) {
  if (!posts?.length) {
    return {
      title: "今天适合先写一句真话",
      body: "你的空间现在还安静，正好适合用一条不必完整的句子把它点亮。",
    };
  }

  if (posts.length < 3) {
    return {
      title: "今天适合继续堆一点生活纹理",
      body: "你已经开始留下痕迹了，不用每次都写得像文章，先把当天的感受放进来更重要。",
    };
  }

  return {
    title: "今天适合回头翻一翻自己最近在想什么",
    body: "内容已经开始累积了，试着补一条更短、但更像你自己的记录，让这个空间长出稳定的节奏。",
  };
}

export default async function HomePage({ searchParams }) {
  const resolvedParams = await searchParams;
  const { supabase, user } = await requireUser();

  const [{ data: profile }, { data: posts }, { data: space }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("posts").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
    supabase.from("spaces").select("*").eq("owner_id", user.id).single(),
  ]);

  const message = resolvedParams?.message ? decodeURIComponent(resolvedParams.message) : null;
  const error = resolvedParams?.error ? decodeURIComponent(resolvedParams.error) : null;
  const signal = buildSignal(posts || []);
  const latestPost = posts?.[0] || null;

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="pixel-avatar" aria-hidden="true" />
          <div>
            <span className="eyebrow">MyLife</span>
            <h1 className="section-title" style={{ margin: "10px 0 6px" }}>
              {space?.title || "你的私密空间"}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {profile?.bio || "在这里写下只有你自己会回头翻的东西。"}
            </p>
          </div>
        </div>

        <div className="actions">
          <Link className="button secondary" href="/requirements">需求工作台</Link>
          <Link className="button secondary" href="/settings/profile">空间设置</Link>
          <form action={signOut}>
            <button className="button" type="submit">退出登录</button>
          </form>
        </div>
      </header>

      {error ? <div className="message error">{error}</div> : null}
      {message ? <div className="message success">{message}</div> : null}

      <section className="workspace-grid">
        <section className="panel content-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">我的内容</span>
              <h2 className="panel-title">这里放你真正写下来的东西</h2>
              <p className="section-copy">
                这块只显示当前账号的内容。别人登录自己的账号，只会看到他们自己的空间。
              </p>
            </div>
          </div>

          {posts?.length ? (
            <div className="post-list">
              {posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-meta">
                    <span>{formatDate(post.created_at)}</span>
                    <span>{themeLabel(post.category)}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="section-copy">{post.summary || "这条内容还没有单独的摘要。"}</p>
                  <div className="post-actions">
                    <Link className="button secondary" href={`/post/${post.id}`}>查看全文</Link>
                    <form action={deletePost}>
                      <input name="post_id" type="hidden" value={post.id} />
                      <button className="button danger" type="submit">删除</button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              这里还没有内容。发出第一条之后，它只会留在你自己的账号里。
            </div>
          )}
        </section>

        <aside className="status-grid">
          <article className="status-card space-card">
            <div className="panel-header">
              <div>
                <span className="eyebrow">我的空间</span>
                <h2 className="panel-title">这个房间只属于当前登录的人</h2>
              </div>
            </div>
            <p className="section-copy">
              当前登录的是 <strong>{profile?.nickname || user.email}</strong>。页面和数据库都只读取当前用户自己的内容，
              所以别人不会看到你的记录。
            </p>
            <div className="status-meta">
              <div className="panel">
                <span className="muted">已发布</span>
                <strong>{posts?.length || 0}</strong>
              </div>
              <div className="panel">
                <span className="muted">最近一条</span>
                <strong>{latestPost ? "刚刚有新内容" : "还没开始写"}</strong>
              </div>
            </div>
          </article>

          <article className="status-card signal-card">
            <span className="eyebrow">今日信号</span>
            <h2 className="panel-title">{signal.title}</h2>
            <p className="section-copy">{signal.body}</p>
          </article>

          <article className="composer-card">
            <span className="eyebrow">写一点</span>
            <h2 className="panel-title">把今天放进你的空间</h2>
            <form action={createPost} className="field-stack">
              <div className="field">
                <label htmlFor="title">标题</label>
                <input id="title" name="title" type="text" required placeholder="比如：今天突然想明白的一件事" />
              </div>
              <div className="field">
                <label htmlFor="category">分类</label>
                <select id="category" name="category" defaultValue="daily">
                  <option value="growth">个人成长</option>
                  <option value="daily">生活流水</option>
                  <option value="business">商业想法</option>
                  <option value="funny">搞笑时刻</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="summary">摘要</label>
                <input id="summary" name="summary" type="text" placeholder="先用一句话概括你想留下什么" />
              </div>
              <div className="field">
                <label htmlFor="content">正文</label>
                <textarea id="content" name="content" required placeholder="写点今天真的想留下的内容。发布后，它会只属于当前这个账号。" />
              </div>
              <div className="actions">
                <button className="button primary" type="submit">发布到我的空间</button>
              </div>
            </form>
          </article>
        </aside>
      </section>
    </main>
  );
}

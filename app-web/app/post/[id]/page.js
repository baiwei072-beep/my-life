import Link from "next/link";
import { notFound } from "next/navigation";

import { deletePost } from "@/app/actions";
import { requireUser } from "@/lib/auth";

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <main className="shell" style={{ padding: "32px 0 56px" }}>
      <article className="panel" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="post-meta">
          <span>{formatDate(post.created_at)}</span>
          <span>{post.category}</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: "clamp(34px, 6vw, 62px)", maxWidth: "none" }}>
          {post.title}
        </h1>
        {post.summary ? <p className="section-copy">{post.summary}</p> : null}
        <div className="section-copy" style={{ whiteSpace: "pre-wrap" }}>
          {post.content}
        </div>
        <div className="actions" style={{ marginTop: 28 }}>
          <Link className="button secondary" href="/">回到我的空间</Link>
          <form action={deletePost}>
            <input name="post_id" type="hidden" value={post.id} />
            <button className="button danger" type="submit">删除这篇</button>
          </form>
        </div>
      </article>
    </main>
  );
}

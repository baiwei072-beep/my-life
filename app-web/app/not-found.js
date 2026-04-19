import Link from "next/link";

export default function NotFound() {
  return (
    <main className="auth-shell">
      <div className="shell panel" style={{ maxWidth: 720 }}>
        <span className="eyebrow">Not Found</span>
        <h1 className="panel-title">这篇内容不在你的房间里</h1>
        <p className="section-copy">
          如果你知道一个 URL，但这篇内容不属于当前登录用户，页面也不会把它展示出来。
        </p>
        <div className="actions">
          <Link className="button primary" href="/">回到我的空间</Link>
        </div>
      </div>
    </main>
  );
}

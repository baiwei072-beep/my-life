import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteRequirementWorkspace } from "@/app/actions";
import CopyButton from "@/app/requirements/copy-button";
import { requireUser } from "@/lib/auth";

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function RequirementDetailPage({ params }) {
  const resolvedParams = await params;
  const { supabase, user } = await requireUser();
  const { data: workspace } = await supabase
    .from("requirement_workspaces")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("owner_id", user.id)
    .single();

  if (!workspace) {
    notFound();
  }

  return (
    <main className="shell" style={{ paddingBottom: "48px" }}>
      <header className="topbar">
        <div>
          <span className="eyebrow">Requirement Detail</span>
          <h1 className="section-title" style={{ margin: "10px 0 6px" }}>{workspace.title}</h1>
          <p className="muted" style={{ margin: 0 }}>
            最后更新于 {formatDate(workspace.updated_at)}
          </p>
        </div>
        <div className="actions">
          <CopyButton content={workspace.generated_markdown} />
          <Link className="button secondary" href={`/requirements?edit=${workspace.id}`}>编辑并重生成</Link>
          <Link className="button secondary" href="/requirements">返回工作台</Link>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="panel detail-panel">
          <span className="eyebrow">生成结果</span>
          <h2 className="panel-title">Markdown 输出</h2>
          <textarea className="markdown-output" readOnly value={workspace.generated_markdown} />
        </article>

        <aside className="panel detail-panel">
          <span className="eyebrow">原始资料</span>
          <h2 className="panel-title">输入上下文</h2>
          <div className="detail-stack">
            <div className="detail-block">
              <strong>一句话需求</strong>
              <p className="muted">{workspace.raw_request}</p>
            </div>
            <div className="detail-block">
              <strong>MA 设计资料</strong>
              <pre className="detail-pre">{workspace.design_context || "未填写"}</pre>
            </div>
            <div className="detail-block">
              <strong>后端 API 说明</strong>
              <pre className="detail-pre">{workspace.api_spec || "未填写"}</pre>
            </div>
            <form action={deleteRequirementWorkspace}>
              <input name="workspace_id" type="hidden" value={workspace.id} />
              <button className="button danger" type="submit">删除这条记录</button>
            </form>
          </div>
        </aside>
      </section>
    </main>
  );
}

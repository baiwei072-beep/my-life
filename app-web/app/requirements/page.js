import Link from "next/link";

import { deleteRequirementWorkspace, saveRequirementWorkspace } from "@/app/actions";
import CopyButton from "@/app/requirements/copy-button";
import { requireUser } from "@/lib/auth";

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function decodeParam(value) {
  return value ? decodeURIComponent(value) : null;
}

export default async function RequirementsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const { supabase, user } = await requireUser();
  const editId = String(resolvedParams?.edit || "").trim();

  const [{ data: profile }, { data: workspaces }] = await Promise.all([
    supabase.from("profiles").select("nickname").eq("id", user.id).single(),
    supabase.from("requirement_workspaces").select("*").eq("owner_id", user.id).order("updated_at", { ascending: false }),
  ]);

  const latest = workspaces?.[0] || null;
  const editingWorkspace = editId ? workspaces?.find((item) => item.id === editId) || null : null;
  const message = decodeParam(resolvedParams?.message);
  const error = decodeParam(resolvedParams?.error);

  return (
    <main className="shell" style={{ paddingBottom: "48px" }}>
      <header className="topbar">
        <div className="brand">
          <div className="pixel-avatar" aria-hidden="true" />
          <div>
            <span className="eyebrow">PM Workbench</span>
            <h1 className="section-title" style={{ margin: "10px 0 6px" }}>
              把一句话需求压成可执行文档
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {profile?.nickname || "当前用户"} 可以在这里录入模糊需求、MA 设计资料和 API 说明，快速产出评审版 Markdown。
            </p>
          </div>
        </div>

        <div className="actions">
          <Link className="button secondary" href="/">返回空间</Link>
          {editingWorkspace ? <Link className="button secondary" href="/requirements">取消编辑</Link> : null}
        </div>
      </header>

      {error ? <div className="message error">{error}</div> : null}
      {message ? <div className="message success">{message}</div> : null}

      <section className="workspace-grid requirement-layout">
        <section className="panel content-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">{editingWorkspace ? "编辑记录" : "输入资料"}</span>
              <h2 className="panel-title">{editingWorkspace ? "修改资料并重新生成" : "把需求、设计和 API 一次喂进来"}</h2>
              <p className="section-copy">
                这个版本会输出设计缺陷、接口对齐建议、用户故事和 `Given / When / Then` 验收标准。
              </p>
            </div>
          </div>

          <form action={saveRequirementWorkspace} className="field-stack">
            <input name="workspace_id" type="hidden" value={editingWorkspace?.id || ""} />
            <div className="field">
              <label htmlFor="raw_request">一句话需求</label>
              <textarea
                id="raw_request"
                name="raw_request"
                required
                defaultValue={editingWorkspace?.raw_request || ""}
                placeholder="例如：用户提交退款申请后，运营需要在后台快速审核并给出结果。"
              />
            </div>
            <div className="field">
              <label htmlFor="design_context">MA 设计资料</label>
              <textarea
                id="design_context"
                name="design_context"
                defaultValue={editingWorkspace?.design_context || ""}
                placeholder="贴页面结构、关键交互、设计备注、状态说明，或者直接粘贴设计评审摘要。"
              />
            </div>
            <div className="field">
              <label htmlFor="api_spec">后端 API 说明</label>
              <textarea
                id="api_spec"
                name="api_spec"
                defaultValue={editingWorkspace?.api_spec || ""}
                placeholder="贴接口路径、method、request/response JSON、字段定义、错误码说明。"
              />
            </div>
            <div className="actions">
              <button className="button primary" type="submit">{editingWorkspace ? "重新生成并保存" : "生成需求 Markdown"}</button>
            </div>
          </form>
        </section>

        <aside className="status-grid requirement-sidebar">
          <article className="status-card signal-card">
            <span className="eyebrow">输出结构</span>
            <h2 className="panel-title">这一版会固定生成 5 块</h2>
            <div className="check-list">
              <span>需求落地判断</span>
              <span>MA 设计缺陷与风险</span>
              <span>按后端返回调整前端的建议</span>
              <span>用户故事</span>
              <span>Given / When / Then 验收标准</span>
            </div>
          </article>

          <article className="status-card space-card">
            <span className="eyebrow">历史结果</span>
            <h2 className="panel-title">最近生成记录</h2>
            {workspaces?.length ? (
              <div className="history-list">
                {workspaces.slice(0, 8).map((item) => (
                  <div className="history-item" key={item.id}>
                    <Link href={`/requirements/${item.id}`}>{item.title}</Link>
                    <span className="muted">{formatDate(item.updated_at)}</span>
                    <div className="history-actions">
                      <Link className="button secondary" href={`/requirements?edit=${item.id}`}>编辑</Link>
                      <form action={deleteRequirementWorkspace}>
                        <input name="workspace_id" type="hidden" value={item.id} />
                        <button className="button danger" type="submit">删除</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="section-copy" style={{ marginBottom: 0 }}>
                这里还没有生成记录。第一次提交后，最新结果会直接显示在下方。
              </p>
            )}
          </article>
        </aside>
      </section>

      <section className="dashboard-grid" style={{ paddingBottom: 0 }}>
        <article className="panel markdown-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">最新 Markdown</span>
              <h2 className="panel-title">{latest?.title || "还没有生成结果"}</h2>
            </div>
            {latest ? <CopyButton content={latest.generated_markdown} /> : null}
          </div>
          <p className="section-copy">
            {latest
              ? "你可以直接复制下面这段 Markdown，丢进评审文档、PRD 或 Jira。"
              : "提交资料后，这里会展示最新一次生成的评审版 Markdown。"}
          </p>
          {latest ? (
            <textarea className="markdown-output" readOnly value={latest.generated_markdown} />
          ) : (
            <div className="empty-state">
              现在还没有可复制的输出。先把一句话需求、设计资料和 API 资料填进去。
            </div>
          )}
        </article>

        <aside className="panel">
          <span className="eyebrow">当前分析摘要</span>
          <h2 className="panel-title">给评审会先看的重点</h2>
          {latest?.analysis ? (
            <div className="insight-list">
              <div className="insight-item">
                <strong>识别到的 API 字段</strong>
                <p className="muted">{latest.analysis.apiFields?.length ? latest.analysis.apiFields.join("、") : "当前没有识别到明确字段。"}</p>
              </div>
              <div className="insight-item">
                <strong>最先要补的设计问题</strong>
                <p className="muted">{latest.analysis.designFindings?.[0] || "暂无。"}</p>
              </div>
              <div className="insight-item">
                <strong>最先要对齐的接口问题</strong>
                <p className="muted">{latest.analysis.apiSuggestions?.[0] || "暂无。"}</p>
              </div>
            </div>
          ) : (
            <p className="section-copy" style={{ marginBottom: 0 }}>
              还没有摘要信息。生成一次后，这里会优先展示评审会上最容易卡住的点。
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}

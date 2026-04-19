import Link from "next/link";

import { updateProfile } from "@/app/actions";
import { requireUser } from "@/lib/auth";

const PRESETS = [
  { id: "bug-purple", label: "紫色小虫", colors: ["#6f42f6", "#cda8ff"] },
  { id: "penguin-yellow", label: "黄肚企鹅", colors: ["#ffd44d", "#3f2b63"] },
  { id: "bird-orange", label: "橙色小鸟", colors: ["#ff8a34", "#fff2ae"] },
  { id: "penguin-purple", label: "紫围巾企鹅", colors: ["#b48cff", "#4e4d7a"] },
];

export default async function ProfilePage({ searchParams }) {
  const resolvedParams = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const message = resolvedParams?.message ? decodeURIComponent(resolvedParams.message) : null;
  const error = resolvedParams?.error ? decodeURIComponent(resolvedParams.error) : null;

  return (
    <main className="shell" style={{ padding: "32px 0 56px" }}>
      <section className="dashboard-grid">
        <article className="panel">
          <span className="eyebrow">空间设置</span>
          <h1 className="panel-title">把你的房间调成像你自己</h1>
          <p className="section-copy">
            这里保存的是当前账号自己的昵称、空间描述和头像风格。先把这些基础信息稳定下来，后面再接图片上传。
          </p>
          {error ? <div className="message error">{error}</div> : null}
          {message ? <div className="message success">{message}</div> : null}
          <form action={updateProfile} className="field-stack">
            <div className="field">
              <label htmlFor="nickname">昵称</label>
              <input id="nickname" name="nickname" type="text" defaultValue={profile?.nickname || ""} required />
            </div>
            <div className="field">
              <label htmlFor="bio">空间描述</label>
              <textarea id="bio" name="bio" defaultValue={profile?.bio || ""} />
            </div>
            <div className="field">
              <label htmlFor="avatar_preset">头像预设</label>
              <select id="avatar_preset" name="avatar_preset" defaultValue={profile?.avatar_preset || "bug-purple"}>
                {PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>{preset.label}</option>
                ))}
              </select>
            </div>
            <div className="actions">
              <button className="button primary" type="submit">保存资料</button>
              <Link className="button secondary" href="/">返回空间</Link>
            </div>
          </form>
        </article>

        <aside className="panel">
          <span className="eyebrow">头像推荐</span>
          <h2 className="panel-title">先从几张像素头像里挑一张</h2>
          <div className="avatar-grid">
            {PRESETS.map((preset) => (
              <div className="avatar-option" key={preset.id}>
                <div
                  className="avatar-swatch"
                  style={{
                    background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                  }}
                />
                <strong>{preset.label}</strong>
                <p className="muted" style={{ marginBottom: 0 }}>
                  当前会把选择结果写进你的个人资料里，后面再接真实图片上传。
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

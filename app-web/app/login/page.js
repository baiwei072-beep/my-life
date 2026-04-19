import { signIn, signUp } from "@/app/actions";

function Message({ searchParams }) {
  const error = searchParams?.error;
  const message = searchParams?.message;

  if (!error && !message) {
    return null;
  }

  return (
    <div className={`message ${error ? "error" : "success"}`}>
      {decodeURIComponent(error || message)}
    </div>
  );
}

export default async function LoginPage({ searchParams }) {
  const resolvedParams = await searchParams;

  return (
    <main className="auth-shell">
      <div className="shell auth-grid">
        <section className="hero-card">
          <span className="eyebrow">MyLife</span>
          <h1 className="hero-title">走进属于你自己的房间。</h1>
          <p className="hero-copy">
            现在这已经不是每个浏览器各自存一份的原型了。
            登录之后，你看到的是自己的空间、自己的内容、自己的头像和自己的归档。
          </p>
          <ul className="hero-list">
            <li>先用最简单的用户名和密码注册，不再让邮箱、短信、微信抢戏。</li>
            <li>所有帖子、头像和空间描述都进入数据库，不再只是本地缓存。</li>
            <li>不同账号之间的数据已经做了隔离，每个人只看自己的空间。</li>
          </ul>
        </section>

        <section className="panel">
          <span className="eyebrow">进入空间</span>
          <h2 className="section-title">先用一个简单账号进去</h2>
          <p className="section-copy">
            这一版只保留最必要的注册和登录动作，把流程压到够轻、够清楚。
          </p>
          <Message searchParams={resolvedParams} />

          <div className="field-stack">
            <form action={signIn} className="field-stack">
              <div className="field">
                <label htmlFor="signin-username">用户名</label>
                <input id="signin-username" name="username" type="text" required placeholder="比如 mike_01" />
              </div>
              <div className="field">
                <label htmlFor="signin-password">密码</label>
                <input id="signin-password" name="password" type="password" minLength={6} required placeholder="至少 6 位" />
              </div>
              <div className="actions">
                <button className="button primary" type="submit">登录</button>
              </div>
            </form>

            <form action={signUp} className="field-stack">
              <div className="field">
                <label htmlFor="signup-nickname">昵称</label>
                <input id="signup-nickname" name="nickname" type="text" required placeholder="比如 Mike" />
              </div>
              <div className="field">
                <label htmlFor="signup-username">用户名</label>
                <input id="signup-username" name="username" type="text" required placeholder="只用字母、数字、下划线或短横线" />
              </div>
              <div className="field">
                <label htmlFor="signup-password">设置密码</label>
                <input id="signup-password" name="password" type="password" minLength={6} required placeholder="至少 6 位" />
              </div>
              <div className="actions">
                <button className="button secondary" type="submit">创建账号</button>
              </div>
            </form>
          </div>

          <p className="muted">
            如果后面要扩展手机号或微信登录，再单独加，不把当前这一版做复杂。
          </p>
        </section>
      </div>
    </main>
  );
}

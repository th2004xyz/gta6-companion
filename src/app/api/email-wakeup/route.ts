import { NextResponse } from "next/server";

// 发售日唤醒序列：预载日（11-12）/ 发售日（11-19）向全体订阅者发送邮件
// 由 .github/workflows/email-wakeup.yml 定时触发，通过 WAKEUP_SECRET 鉴权
// 生产依赖：RESEND_API_KEY、RESEND_AUDIENCE_ID、RESEND_FROM、WAKEUP_SECRET

interface WakeupRequest {
  type?: "preload" | "launch";
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gta6.sohou.xyz";

// 双语邮件模板（预载日 / 发售日各一封，全站仅这两封唤醒邮件）
const TEMPLATES = {
  preload: {
    subject: "GTA6 预载今日开启 · 7 天后开玩 | GTA 6 preload is live",
    html: (t: string) => `
      <div style="background:#0a0a0f;padding:32px;font-family:system-ui,sans-serif;color:#f4f4f5;">
        <div style="max-width:520px;margin:0 auto;background:#14141c;border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,.08);">
          <p style="margin:0 0 8px;font-size:13px;color:#22d3ee;letter-spacing:.08em;">GTA6 COMPANION</p>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;">预载今日开启，11 月 19 日开玩</h1>
          <p style="margin:0 0 16px;color:#d4d4d8;line-height:1.7;">你订阅的 GTA6 发售提醒到了：<strong>数字版预载已于今日（11 月 12 日）开放</strong>，现在预载，发售日凌晨即刻开玩。盒装实体版（Code in Box）同样今日起可兑换预载。</p>
          <p style="margin:0 0 24px;color:#d4d4d8;line-height:1.7;">Your GTA 6 reminder is here: <strong>digital preload opens today (Nov 12)</strong>. Download now and play the moment the game unlocks on November 19.</p>
          <a href="${SITE_URL}" style="display:inline-block;background:#ff2d78;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;">${t}</a>
          <p style="margin:24px 0 0;font-size:12px;color:#71717a;">这是发售前最后一封提醒，发售日还有一封。· One more email arrives on launch day.</p>
        </div>
      </div>`,
    cta: "访问 GTA6 Companion",
  },
  launch: {
    subject: "GTA6 现已发售 · It's here 🌴",
    html: (t: string) => `
      <div style="background:#0a0a0f;padding:32px;font-family:system-ui,sans-serif;color:#f4f4f5;">
        <div style="max-width:520px;margin:0 auto;background:#14141c;border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,.08);">
          <p style="margin:0 0 8px;font-size:13px;color:#22d3ee;letter-spacing:.08em;">GTA6 COMPANION</p>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;">GTA6，现已发售</h1>
          <p style="margin:0 0 16px;color:#d4d4d8;line-height:1.7;">罪恶城的大门正式打开——<strong>2026 年 11 月 19 日，GTA6 全球解锁</strong>。互动地图已同步上线收集品与任务标注，祝你在莱昂尼达州玩得开心。</p>
          <p style="margin:0 0 24px;color:#d4d4d8;line-height:1.7;">Vice City is open — <strong>GTA 6 is out now, November 19, 2026</strong>. Our interactive map is live with collectibles and missions. Enjoy Leonida.</p>
          <a href="${SITE_URL}" style="display:inline-block;background:#ff2d78;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;">${t}</a>
          <p style="margin:24px 0 0;font-size:12px;color:#71717a;">本唤醒序列到此结束，感谢订阅。· This is the final email in the series — thanks for subscribing.</p>
        </div>
      </div>`,
    cta: "打开 GTA6 Companion",
  },
};

export async function POST(request: Request) {
  // 鉴权：仅持有 WAKEUP_SECRET 的定时任务可触发
  const secret = process.env.WAKEUP_SECRET;
  if (!secret || request.headers.get("x-wakeup-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: WakeupRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { type } = body;
  if (type !== "preload" && type !== "launch") {
    return NextResponse.json(
      { error: "type must be 'preload' or 'launch'" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const from = process.env.RESEND_FROM;

  // 开发环境（未配置 Resend）：模拟成功
  if (!apiKey || !audienceId || !from) {
    console.log(`[dev] Email wakeup mock: type=${type}`);
    return NextResponse.json({ success: true, sent: 0, message: "dev mode" });
  }

  try {
    // 1) 拉取全部联系人（分页），过滤已退订
    const emails: string[] = [];
    let nextToken: string | undefined;
    do {
      const url =
        `https://api.resend.com/audiences/${audienceId}/contacts` +
        (nextToken ? `?next_page_token=${encodeURIComponent(nextToken)}` : "");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error(`contacts fetch failed: ${res.status}`);
      const page = await res.json();
      for (const c of page.data || []) {
        if (!c.unsubscribed && c.email) emails.push(c.email);
      }
      nextToken = page.next_page_token;
    } while (nextToken);

    if (emails.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    // 2) 分批发送（Resend batch 上限 100 封/次）
    const template = TEMPLATES[type];
    let sent = 0;
    for (let i = 0; i < emails.length; i += 100) {
      const batch = emails.slice(i, i + 100).map((to) => ({
        from,
        to,
        subject: template.subject,
        html: template.html(template.cta),
      }));
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch),
      });
      if (!res.ok) throw new Error(`send failed: ${res.status} ${await res.text()}`);
      sent += batch.length;
    }

    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error("Email wakeup error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }
}

import { NextResponse } from "next/server";

// 邮件订阅 API
// 生产环境接入 Resend（https://resend.com）发送确认邮件
// 开发环境（无 RESEND_API_KEY）模拟成功，便于本地调试

interface SubscribeRequest {
  email?: string;
}

export async function POST(request: Request) {
  let body: SubscribeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { email } = body;

  // 服务端再次校验邮箱格式
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

  // 开发环境或未配置 Resend：模拟成功
  if (!resendApiKey) {
    console.log(`[dev] Subscribe mock: ${email}`);
    return NextResponse.json({
      success: true,
      message: "Subscribed (dev mode)",
    });
  }

  // 生产环境：调用 Resend API 添加到联系人
  try {
    const res = await fetch("https://api.resend.com/audiences/" + resendAudienceId + "/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend API error:", errText);

      // 邮箱已存在视为成功（幂等）
      if (res.status === 422 || res.status === 409) {
        return NextResponse.json({
          success: true,
          message: "Already subscribed",
        });
      }

      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

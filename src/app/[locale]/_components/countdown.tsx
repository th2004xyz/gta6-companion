"use client";

import { useEffect, useState } from "react";

// 关键时间节点
// 预购开启日：2026-06-25（已过则显示"已开启"状态）
// 发售日：2026-11-19
const PREORDER_DATE = new Date("2026-06-25T00:00:00");
const RELEASE_DATE = new Date("2026-11-19T00:00:00");

interface CountdownLabels {
  // 预购状态标签
  preorderLive: string;
  preorderUpcoming: string;
  // 发售倒计时标签
  releaseCountdown: string;
  released: string;
  // 时间单位
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export default function Countdown({ labels }: { labels: CountdownLabels }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // 服务端渲染与首次客户端渲染前使用占位，避免 hydration mismatch
  if (now === null) {
    return <div className="h-32" aria-hidden />;
  }

  const preorderStarted = now >= PREORDER_DATE.getTime();
  const released = now >= RELEASE_DATE.getTime();
  const remaining = calcRemaining(RELEASE_DATE.getTime() - now);

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* 预购状态徽章 */}
      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ${
          preorderStarted
            ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
            : "bg-amber-500/15 text-amber-400 ring-amber-500/30"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            preorderStarted ? "animate-pulse bg-emerald-400" : "bg-amber-400"
          }`}
        />
        {preorderStarted ? labels.preorderLive : labels.preorderUpcoming}
      </div>

      {/* 发售倒计时 */}
      <div>
        <div className="text-sm font-medium text-zinc-400">
          {labels.releaseCountdown}
        </div>
        {released ? (
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            {labels.released}
          </div>
        ) : (
          <div className="mt-2 flex gap-3 sm:gap-4">
            <TimeUnit value={remaining.days} label={labels.days} />
            <TimeUnit value={remaining.hours} label={labels.hours} />
            <TimeUnit value={remaining.minutes} label={labels.minutes} />
            <TimeUnit value={remaining.seconds} label={labels.seconds} />
          </div>
        )}
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[3rem] rounded-lg bg-zinc-800/80 px-3 py-2 text-center text-2xl font-bold tabular-nums text-white sm:text-3xl">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcRemaining(diff: number): TimeRemaining {
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

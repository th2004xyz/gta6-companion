"use client";

import { useState } from "react";

interface SubscribeFormLabels {
  emailLabel: string;
  emailPlaceholder: string;
  submitButton: string;
  submitting: string;
  success: string;
  error: string;
  invalidEmail: string;
}

export default function SubscribeForm({ labels }: { labels: SubscribeFormLabels }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 简单邮箱格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage(labels.invalidEmail);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Subscribe failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage(labels.error);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center dark:border-emerald-700 dark:bg-emerald-950/30">
        <div className="mb-2 text-3xl" aria-hidden>
          ✓
        </div>
        <p className="font-medium text-emerald-700 dark:text-emerald-400">
          {labels.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          {labels.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.emailPlaceholder}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900"
          disabled={status === "submitting"}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-emerald-500 px-6 py-3 font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? labels.submitting : labels.submitButton}
      </button>
    </form>
  );
}

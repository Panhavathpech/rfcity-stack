"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (response?.ok) {
      router.push("/contacts");
      router.refresh();
      return;
    }

    setError("Invalid email or password");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-slate-600">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-600">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          placeholder="••••••••"
          required
        />
        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}



export const dynamic = "force-dynamic";

import Link from "next/link";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-700">
          R&F City
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose a new password for your account.
        </p>
        <div className="mt-8">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-600">
                This reset link is invalid. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-700"
              >
                Request new link
              </Link>
            </div>
          )}
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Remembered it?{" "}
          <Link href="/login" className="text-emerald-700">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

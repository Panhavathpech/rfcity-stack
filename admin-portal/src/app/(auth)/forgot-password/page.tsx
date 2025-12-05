import Link from "next/link";
import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/session";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export default async function ForgotPasswordPage() {
  const user = await getOptionalUser();
  if (user) {
    redirect("/contacts");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-700">
          R&F City
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Forgot password
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we will send you a reset link.
        </p>
        <div className="mt-8">
          <ForgotPasswordForm />
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


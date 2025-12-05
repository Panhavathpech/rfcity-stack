import { ReactNode } from "react";
import { requireUser } from "@/lib/session";
import { AdminHeader } from "@/components/navigation/AdminHeader";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader user={user} />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}




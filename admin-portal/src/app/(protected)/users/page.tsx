import { requireUser } from "@/lib/session";
import { listUsers } from "@/lib/instantdb";
import { UsersTable } from "@/components/tables/UsersTable";
import { UserRole } from "@/lib/types";

export default async function UsersPage() {
  const user = await requireUser(["owner", "admin"]);
  const users = await listUsers();
  const sanitized = users.map(
    ({ passwordHash: _passwordHash, ...rest }) => rest,
  );

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Team
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Manage admin access
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Invite teammates, promote roles, and disable accounts directly from
          this dashboard.
        </p>
      </div>

      <UsersTable
        initialUsers={sanitized}
        viewerRole={user.role as UserRole}
      />
    </section>
  );
}


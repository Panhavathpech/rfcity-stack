"use client";

import { useState } from "react";
import { AdminUserRecord, UserRole } from "@/lib/types";

type Props = {
  initialUsers: Omit<AdminUserRecord, "passwordHash">[];
  viewerRole: UserRole;
};

const roles: UserRole[] = ["owner", "admin", "editor", "viewer"];

export function UsersTable({ initialUsers, viewerRole }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [formState, setFormState] = useState<{
    email: string;
    role: UserRole;
    status: "active" | "invited" | "disabled";
  }>({ email: "", role: "viewer", status: "invited" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = viewerRole === "owner";

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) {
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const message = await response.json().catch(() => ({}));
      setError(message?.message ?? "Unable to invite user");
      return;
    }

    const data = await response.json();
    setUsers((prev) => [data.user, ...prev]);
    setFormState({ email: "", role: "viewer", status: "invited" });
  }

  async function updateUser(id: string, payload: Record<string, unknown>) {
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json().catch(() => null)) as
      | { message?: string; tempPassword?: string }
      | null;
    if (!response.ok) {
      alert(
        body?.message ??
          "Unable to update user. Check your permissions and try again.",
      );
      return;
    }
    if (payload.password && body?.reset) {
      alert("Password reset link sent to the user.");
    }
    const data = await fetch("/api/users").then((res) => res.json());
    setUsers(data.users);
  }

  async function disableUser(id: string) {
    if (!confirm("Disable this user?")) {
      return;
    }

    const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!response.ok) {
      alert("Unable to disable user.");
      return;
    }
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: "disabled" } : user,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Invite user</h2>
        {canManage ? (
          <form className="mt-5 grid gap-4 sm:grid-cols-3" onSubmit={createUser}>
            <div className="sm:col-span-3">
              <label className="text-sm font-semibold text-slate-600">
                Email
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, email: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                placeholder="teammate@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Role
              </label>
              <select
                value={formState.role}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    role: event.target.value as UserRole,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Status
              </label>
              <select
                value={formState.status}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: event.target.value as typeof formState.status,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="invited">Invited</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending invite..." : "Send invite"}
              </button>
              {error ? (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              ) : null}
            </div>
          </form>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Only owners can invite new users.
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Team</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-3 py-3 font-semibold">{user.email}</td>
                  <td className="px-3 py-3">{user.role}</td>
                  <td className="px-3 py-3">{user.status}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          updateUser(user.id, {
                            status:
                              user.status === "disabled" ? "active" : "disabled",
                          })
                        }
                        className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                      >
                        {user.status === "disabled" ? "Activate" : "Disable"}
                      </button>
                      {user.role !== "owner" ? (
                        <button
                          onClick={() =>
                            updateUser(user.id, {
                              role: user.role === "viewer" ? "editor" : "viewer",
                            })
                          }
                          className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                        >
                          Toggle Role
                        </button>
                      ) : null}
                      <button
                        onClick={() =>
                          updateUser(user.id, {
                            password: generatePassword(),
                          })
                        }
                        className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                      >
                        Reset Password
                      </button>
                      {viewerRole === "owner" ? (
                        <button
                          onClick={() => disableUser(user.id)}
                          className="rounded-full border border-red-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50"
                        >
                          Archive
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function generatePassword() {
  const cryptoApi = globalThis.crypto;
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const buf = cryptoApi.getRandomValues(new Uint8Array(12));
  return Array.from(buf, (byte) => alphabet[byte % alphabet.length]).join("");
}

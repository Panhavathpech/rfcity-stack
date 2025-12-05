"use client";

import { useMemo, useState } from "react";
import { ContactRecord } from "@/lib/types";

type Props = {
  contacts: ContactRecord[];
};

export function ContactsTable({ contacts }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) {
      return contacts;
    }
    const term = query.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.fullName.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        (contact.phone ?? "").toLowerCase().includes(term),
    );
  }, [contacts, query]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Entries</h2>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email, or phone"
          className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:w-80"
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Message</th>
              <th className="px-3 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((contact) => (
              <tr key={contact.id} className="align-top">
                <td className="whitespace-nowrap px-3 py-4 font-semibold">
                  {contact.fullName}
                </td>
                <td className="px-3 py-4">{contact.email}</td>
                <td className="px-3 py-4">{contact.phone || "—"}</td>
                <td className="max-w-xs px-3 py-4 text-slate-500">
                  {contact.message || "No message"}
                </td>
                <td className="px-3 py-4 text-xs uppercase text-slate-400">
                  {new Date(contact.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-10 text-center text-slate-400"
                >
                  No results — try another search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}




import { requireUser } from "@/lib/session";
import { listContacts } from "@/lib/instantdb";
import { ContactsTable } from "@/components/tables/ContactsTable";

export default async function ContactsPage() {
  await requireUser(["owner", "admin", "editor"]);
  const contacts = await listContacts();

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-8 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-100">
          Contact Center
        </p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Contact submissions</h1>
            <p className="mt-2 text-emerald-100">
              Track inbound leads from the marketing site in one place.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
            <p className="text-sm uppercase tracking-[0.4em]">Total</p>
            <p className="text-3xl font-semibold">{contacts.length}</p>
          </div>
        </div>
      </div>

      <ContactsTable contacts={contacts} />
    </section>
  );
}


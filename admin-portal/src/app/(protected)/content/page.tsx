import { requireUser } from "@/lib/session";
import { listContentBlocks } from "@/lib/instantdb";
import Link from "next/link";

export default async function ContentPage() {
  await requireUser(["owner", "admin", "editor"]);
  const contentBlocks = await listContentBlocks();

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          CMS Preview
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Manage website content
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This section lists editable content blocks pulled from InstantDB. The
          current release surfaces data for visibility and lays the groundwork
          for future create/update flows.
        </p>
      </div>

      <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-sm text-emerald-900">
        <p className="font-semibold uppercase tracking-[0.4em] text-emerald-500">
          Coming Soon
        </p>
        <p className="mt-3 text-lg font-semibold">
          WYSIWYG editing and media uploads
        </p>
        <p className="mt-2 max-w-2xl">
          We will extend this panel with rich text editors, media management,
          and publish workflows. Content pulled below mirrors the structure the
          future CMS will use so you can start modeling data inside InstantDB.
        </p>
        <Link
          href="https://www.instantdb.com/docs"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
        >
          View Instant docs
        </Link>
      </div>

      <div className="space-y-4">
        {contentBlocks.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No content blocks found yet. Add rows to the `content_blocks` table
            in InstantDB and they will appear here automatically.
          </div>
        ) : (
          contentBlocks.map((block) => (
            <div
              key={block.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                {block.slug}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                {block.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{block.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {block.mediaRefs?.map((media) => (
                  <span
                    key={media}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500"
                  >
                    {media}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Status: {block.status}</span>
                <span>Updated {new Date(block.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}




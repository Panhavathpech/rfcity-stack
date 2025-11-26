// Docs: https://www.instantdb.com/docs/modeling-data

// instant.schema.ts
import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    contacts: i.entity({
      fullName: i.string(),
      email: i.string(),
      phone: i.string().optional(),
      message: i.string().optional(),
      createdAt: i.string().indexed(),
    }),
    users: i.entity({
      email: i.string().unique().indexed(),
      passwordHash: i.string(),
      role: i.string(),
      status: i.string(),
      createdAt: i.string().indexed(),
    }),
    content_blocks: i.entity({
      slug: i.string().unique().indexed(),
      title: i.string(),
      body: i.string(),
      mediaRefs: i.json(),
      status: i.string(),
      updatedAt: i.string().indexed(),
    }),
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

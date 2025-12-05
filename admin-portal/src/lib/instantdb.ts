import { init, id } from "@instantdb/admin";
import { env } from "@/lib/env";
import {
  AdminUserRecord,
  ContactInput,
  ContactRecord,
  ContentBlock,
  PasswordResetRecord,
  UserRole,
  UserStatus,
} from "@/lib/types";

const db = init({
  appId: env.INSTANT_APP_ID,
  adminToken: env.INSTANT_ADMIN_TOKEN,
});

const CONTACTS_PAGE_SIZE = 50;

export async function insertContact(
  payload: ContactInput,
): Promise<ContactRecord> {
  const contactId = id();
  const createdAt = new Date().toISOString();

  await db.transact(
    db.tx.contacts[contactId].update({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone ?? "",
      message: payload.message ?? "",
      createdAt,
    }),
  );

  return {
    ...payload,
    phone: payload.phone ?? "",
    message: payload.message ?? "",
    id: contactId,
    createdAt,
  };
}

export async function listContacts(): Promise<ContactRecord[]> {
  const result = await db.query({
    contacts: {
      $: {
        order: { createdAt: "desc" },
        limit: CONTACTS_PAGE_SIZE,
      },
    },
  });

  return (result.contacts as ContactRecord[]) ?? [];
}

export async function listUsers(): Promise<AdminUserRecord[]> {
  const result = await db.query({
    users: {
      $: {
        order: { createdAt: "desc" },
        limit: 200,
      },
    },
  });

  return (result.users as AdminUserRecord[]) ?? [];
}

export async function getUserByEmail(
  email: string,
): Promise<AdminUserRecord | null> {
  const result = await db.query({
    users: {
      $: {
        where: { email: email.toLowerCase() },
        limit: 1,
      },
    },
  });

  const [user] = (result.users as AdminUserRecord[]) ?? [];
  return user ?? null;
}

export async function getUserById(
  userId: string,
): Promise<AdminUserRecord | null> {
  const result = await db.query({
    users: {
      $: {
        where: { id: userId },
        limit: 1,
      },
    },
  });
  const [user] = (result.users as AdminUserRecord[]) ?? [];
  return user ?? null;
}

type UserCreatePayload = {
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
};

export async function createUser(
  payload: UserCreatePayload,
): Promise<AdminUserRecord> {
  const userId = id();
  const createdAt = new Date().toISOString();

  await db.transact(
    db.tx.users[userId].update({
      email: payload.email.toLowerCase(),
      passwordHash: payload.passwordHash,
      role: payload.role,
      status: payload.status,
      createdAt,
    }),
  );

  return {
    ...payload,
    email: payload.email.toLowerCase(),
    createdAt,
    id: userId,
  };
}

export async function updateUser(
  userId: string,
  updates: Partial<Pick<AdminUserRecord, "role" | "status" | "passwordHash">>,
): Promise<void> {
  await db.transact(
    db.tx.users[userId].update({
      ...(updates.role ? { role: updates.role } : {}),
      ...(updates.status ? { status: updates.status } : {}),
      ...(updates.passwordHash ? { passwordHash: updates.passwordHash } : {}),
    }),
  );
}

export async function archiveUser(userId: string): Promise<void> {
  await db.transact(
    db.tx.users[userId].update({
      status: "disabled",
    }),
  );
}

export async function createPasswordResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: string,
): Promise<PasswordResetRecord> {
  const resetId = id();
  const createdAt = new Date().toISOString();

  await db.transact(
    db.tx.password_resets[resetId].update({
      userId,
      tokenHash,
      expiresAt,
      usedAt: null,
      createdAt,
    }),
  );

  return {
    id: resetId,
    userId,
    tokenHash,
    expiresAt,
    usedAt: null,
    createdAt,
  };
}

export async function findPasswordResetByTokenHash(
  tokenHash: string,
): Promise<PasswordResetRecord | null> {
  const result = await db.query({
    password_resets: {
      $: {
        where: { tokenHash },
        limit: 1,
      },
    },
  });

  const [record] = (result.password_resets as PasswordResetRecord[]) ?? [];
  return record ?? null;
}

export async function markPasswordResetUsed(resetId: string): Promise<void> {
  const usedAt = new Date().toISOString();
  await db.transact(
    db.tx.password_resets[resetId].update({
      usedAt,
    }),
  );
}

export async function listContentBlocks(): Promise<ContentBlock[]> {
  const result = await db.query({
    content_blocks: {
      $: {
        order: { updatedAt: "desc" },
        limit: 100,
      },
    },
  });

  return (result.content_blocks as ContentBlock[]) ?? [];
}

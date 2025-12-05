export type ContactInput = {
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
};

export type ContactRecord = ContactInput & {
  id: string;
  createdAt: string;
};

export type UserRole = "owner" | "admin" | "editor" | "viewer";
export type UserStatus = "active" | "invited" | "disabled";

export type AdminUserRecord = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  passwordHash: string;
  createdAt: string;
};

export type PasswordResetRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
};

export type ContentBlock = {
  id: string;
  slug: string;
  title: string;
  body: string;
  mediaRefs: string[];
  status: "draft" | "published";
  updatedAt: string;
};



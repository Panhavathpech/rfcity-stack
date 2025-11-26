import { z } from "zod";
import { UserRole, UserStatus } from "@/lib/types";

export const contactSubmissionSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(200).optional(),
});

const roleEnum: [UserRole, ...UserRole[]] = ["owner", "admin", "editor", "viewer"];
const statusEnum: [UserStatus, ...UserStatus[]] = [
  "active",
  "invited",
  "disabled",
];

export const userCreateSchema = z.object({
  email: z.string().email(),
  role: z.enum(roleEnum),
  status: z.enum(statusEnum).default("invited"),
  password: z.string().min(8).optional(),
});

export const userUpdateSchema = z.object({
  role: z.enum(roleEnum).optional(),
  status: z.enum(statusEnum).optional(),
  password: z.string().min(8).optional(),
});


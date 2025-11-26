import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/lib/types";

export async function requireUser(allowedRoles?: UserRole[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role as UserRole)) {
    redirect("/contacts");
  }

  return session.user;
}

export async function getOptionalUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createUser,
  listUsers,
} from "@/lib/instantdb";
import { userCreateSchema } from "@/lib/validation";
import { userInviteTemplate } from "@/lib/emailTemplates";
import { sendEmail } from "@/lib/mailer";
import { env } from "@/lib/env";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";

function generateTempPassword() {
  return randomBytes(6).toString("base64url");
}

async function hashPassword(password: string) {
  return hash(`${password}${env.PASSWORD_PEPPER}`, 10);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!["owner", "admin"].includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await listUsers();
    const sanitized = users.map(
      ({ passwordHash: _passwordHash, ...rest }) => rest,
    );
    return NextResponse.json({ users: sanitized });
  } catch (error) {
    console.error("users:GET", error);
    return NextResponse.json(
      { message: "Failed to load users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const parsed = userCreateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const tempPassword = parsed.data.password ?? generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    const user = await createUser({
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
      status: parsed.data.status,
    });

    if (parsed.data.status !== "disabled") {
      const template = userInviteTemplate({
        email: user.email,
        tempPassword,
        loginUrl: `${env.SITE_BASE_URL}/login`,
      });
      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    console.error("users:POST", error);
    return NextResponse.json(
      { message: "Unable to create user" },
      { status: 500 },
    );
  }
}


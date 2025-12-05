import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { env } from "@/lib/env";
import {
  findPasswordResetByTokenHash,
  getUserById,
  markPasswordResetUsed,
  updateUser,
} from "@/lib/instantdb";
import { passwordResetSubmitSchema } from "@/lib/validation";
import { hashResetToken } from "@/lib/passwordReset";

async function hashPassword(password: string) {
  return hash(`${password}${env.PASSWORD_PEPPER}`, 10);
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = passwordResetSubmitSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 },
      );
    }

    const tokenHash = hashResetToken(parsed.data.token);
    const resetRecord = await findPasswordResetByTokenHash(tokenHash);

    if (
      !resetRecord ||
      resetRecord.usedAt ||
      new Date(resetRecord.expiresAt).getTime() < Date.now()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 },
      );
    }

    const user = await getUserById(resetRecord.userId);
    if (!user || user.status === "disabled") {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await Promise.all([
      updateUser(user.id, {
        passwordHash,
        status: user.status === "invited" ? "active" : user.status,
      }),
      markPasswordResetUsed(resetRecord.id),
    ]);

    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    console.error("auth/reset:POST", error);
    return NextResponse.json(
      { message: "Unable to update password" },
      { status: 500 },
    );
  }
}


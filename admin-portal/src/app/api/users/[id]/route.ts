import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { archiveUser, getUserById, updateUser } from "@/lib/instantdb";
import { userUpdateSchema } from "@/lib/validation";
import { issuePasswordReset } from "@/lib/passwordReset";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!["owner", "admin"].includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const parsed = userUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const targetUser = await getUserById(id);
    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (targetUser.status === "disabled") {
      return NextResponse.json(
        { message: "User is disabled" },
        { status: 400 },
      );
    }

    if (
      session.user.role !== "owner" &&
      parsed.data.role &&
      parsed.data.role === "owner"
    ) {
      return NextResponse.json(
        { message: "Only owners can promote owners" },
        { status: 403 },
      );
    }

    const updates: Record<string, unknown> = {};
    if (parsed.data.role) {
      updates.role = parsed.data.role;
    }
    if (parsed.data.status) {
      updates.status = parsed.data.status;
    }
    const wantsPasswordReset = Boolean(parsed.data.password);

    if (
      Object.keys(updates).length === 0 &&
      !wantsPasswordReset
    ) {
      return NextResponse.json(
        { message: "No updates supplied" },
        { status: 400 },
      );
    }

    if (Object.keys(updates).length > 0) {
      await updateUser(id, updates);
    }

    if (wantsPasswordReset) {
      // Generate a reset link instead of directly setting a temp password.
      await issuePasswordReset(id, targetUser.email);
    }

    return NextResponse.json({
      message: "User updated",
      ...(wantsPasswordReset ? { reset: true } : {}),
    });
  } catch (error) {
    console.error("users:PATCH", error);
    return NextResponse.json(
      { message: "Unable to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await archiveUser(id);
    return NextResponse.json({ message: "User disabled" });
  } catch (error) {
    console.error("users:DELETE", error);
    return NextResponse.json(
      { message: "Unable to disable user" },
      { status: 500 },
    );
  }
}

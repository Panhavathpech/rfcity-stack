import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listContentBlocks } from "@/lib/instantdb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!["owner", "admin", "editor"].includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const content = await listContentBlocks();
    return NextResponse.json({ content });
  } catch (error) {
    console.error("content:GET", error);
    return NextResponse.json(
      { message: "Failed to load content blocks" },
      { status: 500 },
    );
  }
}


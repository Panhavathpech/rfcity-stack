import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validation";
import { getUserByEmail } from "@/lib/instantdb";
import { issuePasswordReset } from "@/lib/passwordReset";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = forgotPasswordSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ message: "If that account exists, an email has been sent." });
    }

    const user = await getUserByEmail(parsed.data.email);
    if (!user || user.status === "disabled") {
      return NextResponse.json({ message: "If that account exists, an email has been sent." });
    }

    await issuePasswordReset(user.id, user.email);

    return NextResponse.json({ message: "If that account exists, an email has been sent." });
  } catch (error) {
    console.error("auth/forgot:POST", error);
    return NextResponse.json(
      { message: "Unable to process request" },
      { status: 500 },
    );
  }
}


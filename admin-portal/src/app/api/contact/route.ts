import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { contactSubmissionSchema } from "@/lib/validation";
import { insertContact, listContacts } from "@/lib/instantdb";
import { contactAlertTemplate } from "@/lib/emailTemplates";
import { sendEmail } from "@/lib/mailer";
import { env } from "@/lib/env";

const corsHeaders = {
  "Access-Control-Allow-Origin": env.CONTACT_ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = contactSubmissionSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", issues: parsed.error.flatten() },
        { status: 422, headers: corsHeaders },
      );
    }

    const record = await insertContact(parsed.data);
    const template = contactAlertTemplate(record);

    await sendEmail({
      to: env.CONTACT_ALERT_RECIPIENT,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({ contact: record }, { headers: corsHeaders });
  } catch (error) {
    console.error("contact:POST", error);
    return NextResponse.json(
      { message: "Unable to submit contact entry" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!["owner", "admin", "editor"].includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const contacts = await listContacts();
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("contact:GET", error);
    return NextResponse.json(
      { message: "Failed to load contacts" },
      { status: 500 },
    );
  }
}


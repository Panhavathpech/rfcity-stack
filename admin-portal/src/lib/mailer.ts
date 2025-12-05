import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}) {
  return resend.emails.send({
    from: env.SUPPORT_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });
}




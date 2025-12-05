import { createHash, randomBytes } from "crypto";
import { env } from "@/lib/env";
import { createPasswordResetToken } from "@/lib/instantdb";
import { passwordResetLinkTemplate } from "@/lib/emailTemplates";
import { sendEmail } from "@/lib/mailer";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 60 minutes

export function generateResetToken() {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issuePasswordReset(userId: string, email: string) {
  const rawToken = generateResetToken();
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

  await createPasswordResetToken(userId, tokenHash, expiresAt);

  const resetUrl = `${env.SITE_BASE_URL}/reset-password?token=${rawToken}`;
  const template = passwordResetLinkTemplate({
    email,
    resetUrl,
  });

  const emailResponse = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  // The Resend SDK returns an error object instead of throwing when delivery fails.
  if (emailResponse && "error" in emailResponse && emailResponse.error) {
    throw new Error(
      (emailResponse.error as { message?: string }).message ??
        "Email delivery failed",
    );
  }

  return { resetUrl };
}


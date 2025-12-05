import { ContactRecord } from "@/lib/types";

export function contactAlertTemplate(contact: ContactRecord) {
  const subject = `New contact entry from ${contact.fullName}`;
  const body = `
    <h1 style="font-family: Arial, sans-serif;">New Contact Submission</h1>
    <p><strong>Name:</strong> ${contact.fullName}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone || "—"}</p>
    <p><strong>Message:</strong></p>
    <p>${contact.message || "No additional message."}</p>
    <hr />
    <p>Submitted at: ${new Date(contact.createdAt).toLocaleString()}</p>
  `;

  return {
    subject,
    html: body,
    text: [
      "New Contact Submission",
      `Name: ${contact.fullName}`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone || "—"}`,
      `Message: ${contact.message || "No additional message."}`,
      `Submitted at: ${contact.createdAt}`,
    ].join("\n"),
  };
}

export function userInviteTemplate({
  email,
  tempPassword,
  loginUrl,
}: {
  email: string;
  tempPassword: string;
  loginUrl: string;
}) {
  const subject = "You're invited to the R&F City admin portal";
  const html = `
    <p>Hello ${email},</p>
    <p>You have been invited to access the R&F City admin portal.</p>
    <p>Temporary password: <strong>${tempPassword}</strong></p>
    <p>Please log in and change your password asap.</p>
    <p><a href="${loginUrl}">Open the portal</a></p>
  `;

  const text = [
    "You have been invited to the R&F City admin portal.",
    `Temporary password: ${tempPassword}`,
    `Login here: ${loginUrl}`,
  ].join("\n");

  return { subject, html, text };
}

export function passwordResetTemplate({
  email,
  tempPassword,
  loginUrl,
}: {
  email: string;
  tempPassword: string;
  loginUrl: string;
}) {
  const subject = "Your admin portal password has been reset";
  const html = `
    <p>Hello ${email},</p>
    <p>Your password has been reset by an administrator.</p>
    <p>Temporary password: <strong>${tempPassword}</strong></p>
    <p>Please log in and update your password.</p>
    <p><a href="${loginUrl}">Open the portal</a></p>
  `;

  const text = [
    "Your password has been reset.",
    `Temporary password: ${tempPassword}`,
    `Login here: ${loginUrl}`,
  ].join("\n");

  return { subject, html, text };
}




import { Resend } from "resend";

const FROM_EMAIL = process.env.FROM_EMAIL || "Life 2.0 <noreply@life2.app>";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const client = getResendClient();
  if (!client) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email not configured" };
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export function getWelcomeEmailHtml(name: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Life 2.0</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ededed; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; padding: 40px; border: 1px solid #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Welcome to Life 2.0</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">Hi ${name || "there"},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">
            Welcome to Life 2.0 - your AI-powered second brain! We're excited to have you on board.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">
            Here's what you can do:
          </p>
          <ul style="font-size: 14px; line-height: 1.8; color: #9ca3af;">
            <li>Create notes using natural language AI commands</li>
            <li>Organize your knowledge across disciplines</li>
            <li>Search with AI-powered grounded search</li>
            <li>Collaborate with your team</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://life2.app"}/dashboard" 
               style="display: inline-block; background-color: #8B5CF6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Go to Dashboard
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 40px; text-align: center;">
            If you have any questions, just reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

export function getTeamInviteEmailHtml(teamName: string, inviterName: string, inviteLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Invitation - Life 2.0</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ededed; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; padding: 40px; border: 1px solid #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">You're Invited!</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">
            <strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on Life 2.0.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">
            Join the team to collaborate on notes, projects, and knowledge areas together.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${inviteLink}" 
               style="display: inline-block; background-color: #8B5CF6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Accept Invitation
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 40px; text-align: center;">
            This invitation expires in 7 days.
          </p>
        </div>
      </body>
    </html>
  `;
}

export function getNotificationEmailHtml(title: string, message: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Life 2.0</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ededed; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; padding: 40px; border: 1px solid #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 24px; margin: 0;">${title}</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">
            ${message}
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://life2.app"}/dashboard" 
               style="display: inline-block; background-color: #8B5CF6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View in App
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'noreply@soberstayhomes.com';
const APP_NAME = 'Sober Stay Homes';

export async function sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset Your Password - Sober Stay Homes',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 28px;">🏠</span>
                      </div>
                      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Reset Your Password</h1>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                        We received a request to reset your password for your Sober Stay Homes account. Click the button below to create a new password.
                      </p>
                      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
                        Reset Password
                      </a>
                      <p style="color: #64748b; font-size: 14px; margin: 32px 0 0;">
                        This link will expire in 30 minutes for security reasons.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 30px; border-top: 1px solid #334155; text-align: center;">
                      <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">
                        If you didn't request a password reset, you can safely ignore this email.
                      </p>
                      <p style="color: #475569; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Sober Stay Homes. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }

    console.log('Password reset email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

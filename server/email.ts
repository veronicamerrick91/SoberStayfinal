import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'onboarding@resend.dev'; // Using Resend's default verified domain for testing
const SUPPORT_EMAIL = 'support@soberstayhomes.com';
const APP_NAME = 'Sober Stay Homes';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || `${APP_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

export async function sendBulkEmails(emails: EmailOptions[]): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  const results = await Promise.allSettled(emails.map(email => sendEmail(email)));
  
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      sent++;
    } else {
      failed++;
      const errorMsg = result.status === 'rejected' 
        ? result.reason?.message 
        : (result.value as any).error;
      errors.push(`Email to ${Array.isArray(emails[index].to) ? emails[index].to[0] : emails[index].to}: ${errorMsg}`);
    }
  });
  
  return { success: failed === 0, sent, failed, errors };
}

export function createMarketingEmailHtml(subject: string, body: string, previewText?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${previewText ? `<meta name="x-apple-disable-message-reformatting">` : ''}
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      ${previewText ? `<div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>` : ''}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155;">
              <tr>
                <td style="padding: 30px; text-align: center; border-bottom: 1px solid #334155;">
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 50px; height: 50px; border-radius: 10px; margin: 0 auto; display: inline-block; line-height: 50px;">
                    <span style="font-size: 24px;">🏠</span>
                  </div>
                  <h1 style="color: #10b981; font-size: 20px; font-weight: 700; margin: 16px 0 0;">Sober Stay Homes</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 20px;">${subject}</h2>
                  <div style="color: #cbd5e1; font-size: 16px; line-height: 1.7;">
                    ${body.replace(/\n/g, '<br>')}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 30px; border-top: 1px solid #334155; text-align: center;">
                  <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">
                    You're receiving this email because you're a member of Sober Stay Homes.
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
  `;
}

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

export async function sendRenewalReminderEmail(email: string, providerName: string, renewalDate: Date): Promise<boolean> {
  try {
    const formattedDate = renewalDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Your Subscription Renews Soon - Sober Stay Homes',
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
                      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Subscription Renewal Reminder</h1>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Hi ${providerName},
                      </p>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Your Sober Stay Homes subscription will automatically renew on <strong style="color: #10b981;">${formattedDate}</strong>. You'll be charged $49 per active listing.
                      </p>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                        If you'd like to update your payment method or make any changes, visit your Provider Dashboard.
                      </p>
                      <p style="color: #64748b; font-size: 14px; margin: 0;">
                        Thank you for helping people find sober housing!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 30px; border-top: 1px solid #334155; text-align: center;">
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
      console.error('Failed to send renewal reminder email:', error);
      return false;
    }

    console.log('Renewal reminder email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending renewal reminder email:', error);
    return false;
  }
}

export async function sendSubscriptionCanceledEmail(email: string, providerName: string, gracePeriodEndDate: Date): Promise<boolean> {
  try {
    const formattedDate = gracePeriodEndDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Your Subscription Has Been Canceled - Sober Stay Homes',
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
                      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 28px;">⚠️</span>
                      </div>
                      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Subscription Canceled</h1>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Hi ${providerName},
                      </p>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Your Sober Stay Homes subscription has been canceled. Your listings will remain visible during a <strong style="color: #f59e0b;">7-day grace period</strong> until <strong style="color: #f59e0b;">${formattedDate}</strong>.
                      </p>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                        After this date, your listings will be hidden from public view. You can reactivate your subscription at any time to restore visibility.
                      </p>
                      <p style="color: #64748b; font-size: 14px; margin: 0;">
                        We hope to see you again soon!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 30px; border-top: 1px solid #334155; text-align: center;">
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
      console.error('Failed to send cancellation email:', error);
      return false;
    }

    console.log('Cancellation email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return false;
  }
}

export async function sendListingsHiddenEmail(email: string, providerName: string): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Your Listings Are Now Hidden - Sober Stay Homes',
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
                      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 28px;">🔒</span>
                      </div>
                      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Listings Hidden</h1>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Hi ${providerName},
                      </p>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Your grace period has ended and your listings are now <strong style="color: #ef4444;">hidden from public view</strong> on Sober Stay Homes.
                      </p>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                        Ready to get back online? Simply reactivate your subscription from your Provider Dashboard to make your listings visible again.
                      </p>
                      <p style="color: #64748b; font-size: 14px; margin: 0;">
                        We're here when you need us!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 30px; border-top: 1px solid #334155; text-align: center;">
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
      console.error('Failed to send listings hidden email:', error);
      return false;
    }

    console.log('Listings hidden email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending listings hidden email:', error);
    return false;
  }
}

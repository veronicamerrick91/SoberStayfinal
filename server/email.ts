import { Resend } from 'resend';

// Email configuration - uses RESEND_API_KEY environment variable
// Works in both Replit development and external hosting (Render, etc.)
const FROM_EMAIL = 'support@soberstayhomes.com';

async function getResendClient(): Promise<{ client: Resend; fromEmail: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  return {
    client: new Resend(apiKey),
    fromEmail: FROM_EMAIL
  };
}

const SUPPORT_EMAIL = 'support@soberstayhomes.com';
const APP_NAME = 'Sober Stay Homes';
const WEBSITE_URL = 'https://www.soberstayhomes.com';
const LOGO_URL = 'https://www.soberstayhomes.com/favicon.jpg';

// Base email template with Sober Stay branding
function getEmailHeader(): string {
  return `
    <tr>
      <td bgcolor="#0f172a" style="background-color: #0f172a; padding: 30px; text-align: center; border-bottom: 1px solid #1e3a5f;">
        <a href="${WEBSITE_URL}" style="text-decoration: none;">
          <img src="${LOGO_URL}" alt="Sober Stay" width="80" height="80" style="width: 80px; height: 80px; border-radius: 12px; display: block; margin: 0 auto;" />
        </a>
        <h1 style="color: #10b981; font-size: 22px; font-weight: 700; margin: 16px 0 4px;">Sober Stay Homes</h1>
        <p style="color: #94a3b8; font-size: 14px; margin: 0; font-style: italic;">Where Healing Finds Home</p>
      </td>
    </tr>
  `;
}

function getEmailFooter(): string {
  return `
    <tr>
      <td bgcolor="#0f172a" style="background-color: #0f172a; padding: 24px 30px; border-top: 1px solid #1e3a5f; text-align: center;">
        <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">
          You're receiving this email because you're a member of Sober Stay Homes.
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 0 0 12px;">
          <a href="${WEBSITE_URL}" style="color: #10b981; text-decoration: none;">Visit our website</a> | 
          <a href="mailto:${SUPPORT_EMAIL}" style="color: #10b981; text-decoration: none;">Contact Support</a>
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Sober Stay Homes. All rights reserved.
        </p>
      </td>
    </tr>
  `;
}

function getEmailWrapper(content: string, previewText?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en" style="background-color: #0a1628;">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
      <style>
        body, html { background-color: #0a1628 !important; }
        .email-bg { background-color: #0a1628 !important; }
      </style>
    </head>
    <body bgcolor="#0a1628" style="margin: 0; padding: 0; background: #0a1628; background-color: #0a1628; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      ${previewText ? `<div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>` : ''}
      <!--[if mso]>
      <table role="presentation" width="100%" bgcolor="#0a1628"><tr><td>
      <![endif]-->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0a1628" class="email-bg" style="background: #0a1628; background-color: #0a1628; min-height: 100%;">
        <tr>
          <td align="center" valign="top" bgcolor="#0a1628" style="background: #0a1628; background-color: #0a1628; padding: 40px 20px;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#0f172a" style="max-width: 600px; width: 100%; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e3a5f;">
              ${getEmailHeader()}
              ${content}
              ${getEmailFooter()}
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </body>
    </html>
  `;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const { data, error } = await client.emails.send({
      from: options.from || `${APP_NAME} <${fromEmail}>`,
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
  const content = `
    <tr>
      <td bgcolor="#0f172a" style="background-color: #0f172a; padding: 40px 30px;">
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 20px;">${subject}</h2>
        <div style="color: #cbd5e1; font-size: 16px; line-height: 1.7;">
          ${body.replace(/\n/g, '<br>')}
        </div>
      </td>
    </tr>
  `;
  return getEmailWrapper(content, previewText);
}

export async function sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
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
          <p style="color: #64748b; font-size: 13px; margin: 16px 0 0;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: 'Reset Your Password - Sober Stay Homes',
      html: getEmailWrapper(content, 'Reset your Sober Stay Homes password'),
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
    
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
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
          <a href="${WEBSITE_URL}/provider-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            View Dashboard
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            Thank you for helping people find sober housing!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: 'Your Subscription Renews Soon - Sober Stay Homes',
      html: getEmailWrapper(content, 'Your subscription renews soon'),
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
    
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
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
          <a href="${WEBSITE_URL}/provider-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Reactivate Subscription
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            We hope to see you again soon!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: 'Your Subscription Has Been Canceled - Sober Stay Homes',
      html: getEmailWrapper(content, 'Your subscription has been canceled'),
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
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
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
          <a href="${WEBSITE_URL}/provider-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Reactivate Subscription
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            We're here when you need us!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: 'Your Listings Are Now Hidden - Sober Stay Homes',
      html: getEmailWrapper(content, 'Your listings are now hidden'),
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

// Application Notification Emails

export async function sendApplicationReceivedEmail(
  tenantEmail: string, 
  tenantName: string, 
  propertyName: string,
  providerName: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Application Received!</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${tenantName},
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Your application for <strong style="color: #10b981;">${propertyName}</strong> has been successfully submitted to ${providerName}.
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            The provider will review your application and get back to you soon. You can track your application status in your tenant dashboard.
          </p>
          <a href="${WEBSITE_URL}/tenant-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            View Dashboard
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            Thank you for using Sober Stay Homes!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: tenantEmail,
      subject: 'Application Received - Sober Stay Homes',
      html: getEmailWrapper(content, 'Your application has been received'),
    });

    if (error) {
      console.error('Failed to send application received email:', error);
      return false;
    }

    console.log('Application received email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending application received email:', error);
    return false;
  }
}

export async function sendNewApplicationNotification(
  providerEmail: string,
  providerName: string,
  tenantName: string,
  propertyName: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">New Application!</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${providerName},
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            You've received a new application from <strong style="color: #3b82f6;">${tenantName}</strong> for your property <strong style="color: #10b981;">${propertyName}</strong>.
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            Log in to your Provider Dashboard to review the application and respond to the applicant.
          </p>
          <a href="${WEBSITE_URL}/provider-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Review Application
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            Quick responses help build trust with potential tenants!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: providerEmail,
      subject: 'New Application Received - Sober Stay Homes',
      html: getEmailWrapper(content, 'You have a new application to review'),
    });

    if (error) {
      console.error('Failed to send new application notification:', error);
      return false;
    }

    console.log('New application notification sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending new application notification:', error);
    return false;
  }
}

export async function sendApplicationApprovedEmail(
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  providerName: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Congratulations!</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${tenantName},
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Great news! Your application for <strong style="color: #10b981;">${propertyName}</strong> has been <strong style="color: #10b981;">approved</strong> by ${providerName}.
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            The provider will be reaching out to you soon with next steps. You can also message them directly through your tenant dashboard.
          </p>
          <a href="${WEBSITE_URL}/tenant-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            View Dashboard
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            We're excited to help you on your recovery journey!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: tenantEmail,
      subject: 'Application Approved! - Sober Stay Homes',
      html: getEmailWrapper(content, 'Great news! Your application has been approved'),
    });

    if (error) {
      console.error('Failed to send application approved email:', error);
      return false;
    }

    console.log('Application approved email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending application approved email:', error);
    return false;
  }
}

export async function sendApplicationDeniedEmail(
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  providerName: string,
  reason?: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Application Update</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${tenantName},
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            We wanted to let you know that your application for <strong style="color: #94a3b8;">${propertyName}</strong> was not selected by ${providerName} at this time.
          </p>
          ${reason ? `
          <div style="background-color: #1e3a5f; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0;">
              <strong style="color: #cbd5e1;">Provider's note:</strong> ${reason}
            </p>
          </div>
          ` : ''}
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            Don't be discouraged! There are many other great sober living homes on our platform. Keep searching and you'll find the right fit for your recovery journey.
          </p>
          <a href="${WEBSITE_URL}/browse" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Browse Listings
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            We're here to support you every step of the way.
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: tenantEmail,
      subject: 'Application Update - Sober Stay Homes',
      html: getEmailWrapper(content, 'Update on your application'),
    });

    if (error) {
      console.error('Failed to send application denied email:', error);
      return false;
    }

    console.log('Application denied email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending application denied email:', error);
    return false;
  }
}

export async function sendPaymentReminderEmail(email: string, providerName: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Payment Update Required</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${providerName},
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            We were unable to process your recent payment for your Sober Stay Homes subscription. This could be due to an <strong style="color: #ef4444;">expired card or insufficient funds</strong>.
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            To keep your listings visible and continue connecting with tenants, please update your payment method as soon as possible.
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            You can update your payment information by logging into your Provider Dashboard and visiting the <strong style="color: #10b981;">Billing</strong> section.
          </p>
          <a href="${WEBSITE_URL}/provider-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Update Payment Method
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            If you have any questions, please don't hesitate to reach out to our support team.
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: 'Action Required: Update Your Payment Method - Sober Stay Homes',
      html: getEmailWrapper(content, 'Action required: Update your payment method'),
    });

    if (error) {
      console.error('Failed to send payment reminder email:', error);
      return false;
    }

    console.log('Payment reminder email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending payment reminder email:', error);
    return false;
  }
}

export async function sendAdminContactEmail(email: string, providerName: string, message: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Message from Our Team</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${providerName},
          </p>
          <div style="color: #cbd5e1; font-size: 16px; line-height: 1.7; text-align: left; background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            If you have any questions, you can reply directly to this email.
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: 'Message from Sober Stay Homes Admin',
      html: getEmailWrapper(content, 'You have a message from Sober Stay Homes'),
    });

    if (error) {
      console.error('Failed to send admin contact email:', error);
      return false;
    }

    console.log('Admin contact email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending admin contact email:', error);
    return false;
  }
}

export async function sendMoveInReminderEmail(
  email: string,
  tenantName: string,
  propertyName: string,
  moveInDate: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Your Move-In is Coming Up!</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${tenantName},
          </p>
          <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            This is a friendly reminder that your move-in date is just 3 days away!
          </p>
          <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px; text-align: left;">
            <p style="color: #10b981; font-size: 14px; font-weight: 600; margin: 0 0 12px;">YOUR UPCOMING MOVE</p>
            <p style="color: #cbd5e1; font-size: 16px; margin: 0 0 8px;">
              📍 <strong>Property:</strong> ${propertyName}
            </p>
            <p style="color: #cbd5e1; font-size: 16px; margin: 0;">
              📅 <strong>Move-In Date:</strong> ${moveInDate}
            </p>
          </div>
          <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px; text-align: left;">
            <p style="color: #10b981; font-size: 14px; font-weight: 600; margin: 0 0 12px;">BEFORE YOU ARRIVE</p>
            <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Confirm move-in time with the provider</li>
              <li>Prepare your personal belongings</li>
              <li>Bring your ID and any required documents</li>
              <li>Review house rules and expectations</li>
            </ul>
          </div>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            The first few days in a new environment can feel overwhelming, but you're taking an incredible step in your recovery journey. You've got this!
          </p>
          <a href="${WEBSITE_URL}/tenant-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            View Dashboard
          </a>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: 'Your Move-In is Coming Up! - Sober Stay',
      html: getEmailWrapper(content, 'Your move-in date is coming up soon'),
    });

    if (error) {
      console.error('Failed to send move-in reminder email:', error);
      return false;
    }

    console.log('Move-in reminder email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending move-in reminder email:', error);
    return false;
  }
}

export async function sendWorkflowStepEmail(
  email: string,
  userName: string,
  subject: string,
  body: string
): Promise<boolean> {
  try {
    // Replace placeholders in subject and body
    const personalizedSubject = subject
      .replace(/\[first_name\]|\{\{firstName\}\}|\{\{name\}\}/gi, userName)
      .replace(/\[app_name\]/gi, APP_NAME);
    
    const personalizedBody = body
      .replace(/\[first_name\]|\{\{firstName\}\}|\{\{name\}\}/gi, userName)
      .replace(/\[app_name\]/gi, APP_NAME)
      .replace(/\[website_url\]/gi, WEBSITE_URL)
      .replace(/\[support_email\]/gi, SUPPORT_EMAIL);

    const { client, fromEmail } = await getResendClient();
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="color: #cbd5e1; font-size: 16px; line-height: 1.6; text-align: left; white-space: pre-wrap;">
${personalizedBody}
          </div>
          <a href="${WEBSITE_URL}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); margin-top: 24px;">
            Visit Sober Stay
          </a>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: email,
      subject: personalizedSubject,
      html: getEmailWrapper(content, personalizedSubject),
    });

    if (error) {
      console.error('Failed to send workflow step email:', error);
      return false;
    }

    console.log('Workflow step email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending workflow step email:', error);
    return false;
  }
}

export async function sendAdminLoginNotification(
  adminEmail: string,
  loginTime: Date,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const formattedTime = loginTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">🔐</span>
          </div>
          <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px;">Admin Login Detected</h2>
          <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
            Your admin account was just accessed
          </p>
          <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px; text-align: left;">
            <p style="color: #10b981; font-size: 14px; font-weight: 600; margin: 0 0 12px;">LOGIN DETAILS</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Time:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${formattedTime}</td>
              </tr>
              ${ipAddress ? `
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">IP Address:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${ipAddress}</td>
              </tr>
              ` : ''}
              ${userAgent ? `
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Device:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right; font-size: 12px; max-width: 200px; word-break: break-word;">${userAgent.substring(0, 100)}${userAgent.length > 100 ? '...' : ''}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            If this was you, no action is needed. If you don't recognize this activity, please change your password immediately and contact support.
          </p>
          <a href="${WEBSITE_URL}/admin-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Go to Admin Dashboard
          </a>
        </td>
      </tr>
    `;
    
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: adminEmail,
      subject: '🔐 Admin Login Alert - Sober Stay',
      html: getEmailWrapper(content, 'Your admin account was just accessed'),
    });

    if (error) {
      console.error('Failed to send admin login notification:', error);
      return false;
    }

    console.log('Admin login notification sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending admin login notification:', error);
    return false;
  }
}

// Admin Activity Notification Functions
async function getAdminEmails(): Promise<string[]> {
  // Import storage dynamically to avoid circular dependencies
  const { storage } = await import('./storage');
  const admins = await storage.getAdminUsers();
  return admins.map(admin => admin.email);
}

export async function sendAdminNewUserNotification(
  newUserName: string,
  newUserEmail: string,
  userRole: 'provider' | 'tenant'
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) {
      console.log('No admin emails found, skipping notification');
      return false;
    }

    const roleLabel = userRole === 'provider' ? 'Provider' : 'Tenant';
    const roleColor = userRole === 'provider' ? '#8b5cf6' : '#3b82f6';
    
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="background: linear-gradient(135deg, ${roleColor} 0%, ${roleColor}cc 100%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">👤</span>
          </div>
          <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px;">New ${roleLabel} Registered</h2>
          <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
            A new ${roleLabel.toLowerCase()} has joined Sober Stay Homes
          </p>
          <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px; text-align: left;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Name:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${newUserName}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Email:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${newUserEmail}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Role:</td>
                <td style="color: ${roleColor}; font-size: 14px; padding: 6px 0; text-align: right; font-weight: 600;">${roleLabel}</td>
              </tr>
            </table>
          </div>
          <a href="${WEBSITE_URL}/admin-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            View in Dashboard
          </a>
        </td>
      </tr>
    `;
    
    // Send to all admins
    for (const adminEmail of adminEmails) {
      await client.emails.send({
        from: `${APP_NAME} <${fromEmail}>`,
        to: adminEmail,
        subject: `👤 New ${roleLabel} Signup: ${newUserName}`,
        html: getEmailWrapper(content, `New ${roleLabel} registered on Sober Stay`),
      });
    }

    console.log(`Admin notification sent for new ${roleLabel}:`, newUserName);
    return true;
  } catch (error) {
    console.error('Error sending admin new user notification:', error);
    return false;
  }
}

export async function sendAdminNewListingNotification(
  providerName: string,
  propertyName: string,
  city: string,
  state: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) return false;

    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">🏠</span>
          </div>
          <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px;">New Listing Submitted</h2>
          <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
            A new property listing requires approval
          </p>
          <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px; text-align: left;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Property:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${propertyName}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Location:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${city}, ${state}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Provider:</td>
                <td style="color: #8b5cf6; font-size: 14px; padding: 6px 0; text-align: right; font-weight: 600;">${providerName}</td>
              </tr>
            </table>
          </div>
          <a href="${WEBSITE_URL}/admin-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Review Listing
          </a>
        </td>
      </tr>
    `;
    
    for (const adminEmail of adminEmails) {
      await client.emails.send({
        from: `${APP_NAME} <${fromEmail}>`,
        to: adminEmail,
        subject: `🏠 New Listing: ${propertyName} - Needs Approval`,
        html: getEmailWrapper(content, 'New listing submitted for approval'),
      });
    }

    console.log('Admin notification sent for new listing:', propertyName);
    return true;
  } catch (error) {
    console.error('Error sending admin new listing notification:', error);
    return false;
  }
}

export async function sendAdminNewApplicationNotification(
  tenantName: string,
  propertyName: string,
  providerName: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) return false;

    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">📋</span>
          </div>
          <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px;">New Application Submitted</h2>
          <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
            A tenant has applied for housing
          </p>
          <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px; text-align: left;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Applicant:</td>
                <td style="color: #3b82f6; font-size: 14px; padding: 6px 0; text-align: right; font-weight: 600;">${tenantName}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Property:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${propertyName}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Provider:</td>
                <td style="color: #8b5cf6; font-size: 14px; padding: 6px 0; text-align: right;">${providerName}</td>
              </tr>
            </table>
          </div>
          <a href="${WEBSITE_URL}/admin-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            View in Dashboard
          </a>
        </td>
      </tr>
    `;
    
    for (const adminEmail of adminEmails) {
      await client.emails.send({
        from: `${APP_NAME} <${fromEmail}>`,
        to: adminEmail,
        subject: `📋 New Application: ${tenantName} → ${propertyName}`,
        html: getEmailWrapper(content, 'New application submitted'),
      });
    }

    console.log('Admin notification sent for new application');
    return true;
  } catch (error) {
    console.error('Error sending admin new application notification:', error);
    return false;
  }
}

export async function sendAdminSubscriptionNotification(
  providerName: string,
  providerEmail: string,
  action: 'started' | 'canceled',
  planName?: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) return false;

    const isStarted = action === 'started';
    const actionColor = isStarted ? '#10b981' : '#ef4444';
    const actionLabel = isStarted ? 'Started' : 'Canceled';
    const emoji = isStarted ? '💳' : '❌';

    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="background: linear-gradient(135deg, ${actionColor} 0%, ${actionColor}cc 100%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">${emoji}</span>
          </div>
          <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px;">Subscription ${actionLabel}</h2>
          <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
            A provider has ${isStarted ? 'started' : 'canceled'} their subscription
          </p>
          <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px; margin: 0 0 24px; text-align: left;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Provider:</td>
                <td style="color: #8b5cf6; font-size: 14px; padding: 6px 0; text-align: right; font-weight: 600;">${providerName}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Email:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${providerEmail}</td>
              </tr>
              ${planName ? `
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Plan:</td>
                <td style="color: #cbd5e1; font-size: 14px; padding: 6px 0; text-align: right;">${planName}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="color: #64748b; font-size: 14px; padding: 6px 0;">Status:</td>
                <td style="color: ${actionColor}; font-size: 14px; padding: 6px 0; text-align: right; font-weight: 600;">${actionLabel}</td>
              </tr>
            </table>
          </div>
          <a href="${WEBSITE_URL}/admin-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            View in Dashboard
          </a>
        </td>
      </tr>
    `;
    
    for (const adminEmail of adminEmails) {
      await client.emails.send({
        from: `${APP_NAME} <${fromEmail}>`,
        to: adminEmail,
        subject: `${emoji} Subscription ${actionLabel}: ${providerName}`,
        html: getEmailWrapper(content, `Provider subscription ${action}`),
      });
    }

    console.log(`Admin notification sent for subscription ${action}:`, providerName);
    return true;
  } catch (error) {
    console.error('Error sending admin subscription notification:', error);
    return false;
  }
}

// Provider notification: New message received
export async function sendProviderNewMessageNotification(
  providerEmail: string,
  providerName: string,
  senderName: string,
  propertyName: string,
  messagePreview: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const preview = messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview;
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 28px;">💬</span>
          </div>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">New Message!</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${providerName},
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            You've received a new message from <strong style="color: #3b82f6;">${senderName}</strong> about <strong style="color: #10b981;">${propertyName}</strong>:
          </p>
          <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin: 0 0 24px; border-left: 4px solid #3b82f6;">
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin: 0; font-style: italic;">
              "${preview}"
            </p>
          </div>
          <a href="${WEBSITE_URL}/provider-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Reply Now
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            Quick responses help build trust with potential tenants!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: providerEmail,
      subject: `New message from ${senderName} - Sober Stay Homes`,
      html: getEmailWrapper(content, 'You have a new message'),
    });

    if (error) {
      console.error('Failed to send provider message notification:', error);
      return false;
    }

    console.log('Provider message notification sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending provider message notification:', error);
    return false;
  }
}

// Provider notification: New tour request
export async function sendProviderTourRequestNotification(
  providerEmail: string,
  providerName: string,
  tenantName: string,
  propertyName: string,
  preferredDate?: string,
  preferredTime?: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const dateInfo = preferredDate && preferredTime 
      ? `<p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
           Preferred time: <strong style="color: #f59e0b;">${preferredDate} at ${preferredTime}</strong>
         </p>`
      : '';
    
    const content = `
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 28px;">🏠</span>
          </div>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">Tour Request!</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${providerName},
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            <strong style="color: #3b82f6;">${tenantName}</strong> has requested a tour of your property <strong style="color: #10b981;">${propertyName}</strong>.
          </p>
          ${dateInfo}
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            Log in to your dashboard to respond and schedule the tour.
          </p>
          <a href="${WEBSITE_URL}/provider-dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Respond to Request
          </a>
          <p style="color: #64748b; font-size: 14px; margin: 24px 0 0;">
            Tours are a great opportunity to find the right fit for your home!
          </p>
        </td>
      </tr>
    `;
    const { data, error } = await client.emails.send({
      from: `${APP_NAME} <${fromEmail}>`,
      to: providerEmail,
      subject: `Tour Request from ${tenantName} - Sober Stay Homes`,
      html: getEmailWrapper(content, 'Someone wants to tour your property'),
    });

    if (error) {
      console.error('Failed to send provider tour request notification:', error);
      return false;
    }

    console.log('Provider tour request notification sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending provider tour request notification:', error);
    return false;
  }
}

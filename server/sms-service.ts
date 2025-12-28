import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: twilio.Twilio | null = null;

function getClient(): twilio.Twilio | null {
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured. SMS will not be sent.');
    return null;
  }
  if (!twilioClient) {
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const client = getClient();
  
  if (!client || !fromNumber) {
    console.warn('SMS not sent - Twilio not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const formattedNumber = formatPhoneNumber(to);
    
    if (!formattedNumber) {
      console.warn('SMS not sent - Invalid phone number:', to);
      return { success: false, error: 'Invalid phone number' };
    }
    
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to: formattedNumber
    });
    
    console.log(`SMS sent successfully to ${formattedNumber}: ${message.sid}`);
    return { success: true, messageId: message.sid };
  } catch (error: any) {
    console.error('Failed to send SMS:', error.message);
    return { success: false, error: error.message };
  }
}

function formatPhoneNumber(phone: string): string | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 10) {
    return null;
  }
  
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  if (digits.length >= 11 && phone.startsWith('+')) {
    return phone;
  }
  return `+${digits}`;
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

export function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function send2FACode(phone: string, code: string): Promise<SmsResult> {
  const body = `Your Sober Stay verification code is: ${code}. This code expires in 10 minutes.`;
  return sendSms(phone, body);
}

export async function sendApplicationNotification(
  phone: string, 
  applicantName: string, 
  propertyName: string
): Promise<SmsResult> {
  const body = `Sober Stay: New application from ${applicantName} for ${propertyName}. Log in to review: www.soberstayhomes.com/provider-dashboard`;
  return sendSms(phone, body);
}

export async function sendApplicationApprovedNotification(
  phone: string,
  propertyName: string
): Promise<SmsResult> {
  const body = `Sober Stay: Great news! Your application for ${propertyName} has been approved. Log in for next steps: www.soberstayhomes.com/tenant-dashboard`;
  return sendSms(phone, body);
}

export async function sendApplicationDeniedNotification(
  phone: string,
  propertyName: string
): Promise<SmsResult> {
  const body = `Sober Stay: Your application for ${propertyName} was not approved. Log in to view details and explore other options: www.soberstayhomes.com/tenant-dashboard`;
  return sendSms(phone, body);
}

export async function sendNewMessageNotification(
  phone: string,
  senderName: string,
  propertyName: string
): Promise<SmsResult> {
  const body = `Sober Stay: New message from ${senderName} about ${propertyName}. Log in to reply: www.soberstayhomes.com`;
  return sendSms(phone, body);
}

export async function sendNewProviderRegistrationNotification(
  phone: string,
  providerName: string,
  companyName: string
): Promise<SmsResult> {
  const body = `Sober Stay Admin: New provider registration - ${providerName} (${companyName}). Review at: www.soberstayhomes.com/admin-dashboard`;
  return sendSms(phone, body);
}

export async function sendTourRequestNotification(
  phone: string,
  tenantName: string,
  propertyName: string,
  date: string
): Promise<SmsResult> {
  const body = `Sober Stay: ${tenantName} requested a tour of ${propertyName} for ${date}. Log in to respond: www.soberstayhomes.com/provider-dashboard`;
  return sendSms(phone, body);
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && fromNumber);
}

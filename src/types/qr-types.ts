
export type QRCodeType = 'url' | 'email' | 'text' | 'phone' | 'sms' | 'whatsapp' | 'wifi' | 'vcard' | 'event';

export interface QRCodeData {
  url?: string;
  email?: string;
  subject?: string;
  body?: string;
  text?: string;
  phone?: string;
  message?: string;
  ssid?: string;
  password?: string;
  encryption?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  title?: string;
  website?: string;
  address?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  [key: string]: string | undefined;
}

export interface QRGenerationOptions {
  logo?: string | null;
  frameColor?: string;
  shape?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  errorCorrectionLevel?: string;
  size?: number;
  margin?: number;
}

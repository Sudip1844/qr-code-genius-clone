
import QRCode from 'qrcode';
import { QRCodeType, QRCodeData, QRGenerationOptions } from '../types/qr-types';

export type QROptions = {
  data: string;
  size?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
};

export const generateQRCode = async (
  type: QRCodeType,
  data: QRCodeData,
  options?: QRGenerationOptions
): Promise<string> => {
  try {
    let qrData = '';
    
    // Generate the appropriate QR data based on type
    switch (type) {
      case 'url':
        qrData = createUrlQR(data.url || '');
        break;
      case 'email':
        qrData = createEmailQR(data.email || '', data.subject, data.body);
        break;
      case 'text':
        qrData = createTextQR(data.text || '');
        break;
      case 'phone':
        qrData = createPhoneQR(data.phone || '');
        break;
      case 'sms':
        qrData = createSMSQR(data.phone || '', data.message);
        break;
      case 'whatsapp':
        qrData = createWhatsAppQR(data.phone || '', data.message);
        break;
      case 'wifi':
        qrData = createWiFiQR(data.ssid || '', data.password || '', data.encryption);
        break;
      case 'vcard':
        qrData = createVCardQR(
          `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          data.phone,
          data.email,
          data.organization
        );
        break;
      case 'event':
        qrData = createEventQR(data.eventName || '', data.location, data.startDate, data.endDate);
        break;
      default:
        throw new Error('Unsupported QR code type');
    }

    if (!qrData) {
      throw new Error('QR code data cannot be empty');
    }

    // Generate QR code with options
    return await QRCode.toDataURL(qrData, {
      width: options?.size || 300,
      margin: options?.margin || 4,
      color: {
        dark: options?.foregroundColor || '#000000',
        light: options?.backgroundColor || '#ffffff',
      },
      errorCorrectionLevel: (options?.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H') || 'M',
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const downloadQRCode = async (dataUrl: string, filename: string = 'qrcode.png') => {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw new Error('Failed to download QR code');
  }
};

// Utility functions to create specific QR code formats
export const createUrlQR = (url: string): string => {
  // Ensure URL has a protocol
  if (url && !/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

export const createEmailQR = (email: string, subject?: string, body?: string): string => {
  // Validate email address
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return '';
  }
  
  let mailtoLink = `mailto:${encodeURIComponent(email)}`;
  
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    mailtoLink += '?' + params.join('&');
  }
  
  return mailtoLink;
};

export const createPhoneQR = (phoneNumber: string): string => {
  // Remove non-numeric characters except + at the beginning
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  if (!cleaned) {
    return '';
  }
  
  return `tel:${cleaned}`;
};

export const createTextQR = (text: string): string => {
  return text;
};

export const createSMSQR = (phoneNumber: string, message?: string): string => {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  if (!cleaned) {
    return '';
  }
  
  return `sms:${cleaned}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
};

export const createWhatsAppQR = (phoneNumber: string, message?: string): string => {
  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  
  if (!cleaned) {
    return '';
  }
  
  return `https://wa.me/${cleaned}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
};

export const createWiFiQR = (ssid: string, password: string, security: string = 'WPA'): string => {
  if (!ssid) {
    return '';
  }
  
  return `WIFI:T:${security};S:${ssid};P:${password};;`;
};

export const createVCardQR = (name: string, phone?: string, email?: string, organization?: string): string => {
  if (!name) {
    return '';
  }
  
  let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}`;
  
  if (phone) vcard += `\nTEL:${phone}`;
  if (email) vcard += `\nEMAIL:${email}`;
  if (organization) vcard += `\nORG:${organization}`;
  
  vcard += '\nEND:VCARD';
  
  return vcard;
};

export const createEventQR = (title: string, location?: string, startDate?: string, endDate?: string): string => {
  if (!title) {
    return '';
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  let event = `BEGIN:VEVENT\nSUMMARY:${title}`;
  
  if (location) event += `\nLOCATION:${location}`;
  if (startDate) event += `\nDTSTART:${formatDate(startDate)}`;
  if (endDate) event += `\nDTEND:${formatDate(endDate)}`;
  
  event += '\nEND:VEVENT';
  
  return event;
};

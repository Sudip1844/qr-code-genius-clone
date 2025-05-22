
import QRCode from 'qrcode';

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

export const generateQRCode = async ({
  data,
  size = 300,
  margin = 4,
  color = { dark: '#000000', light: '#ffffff' },
  errorCorrectionLevel = 'M'
}: QROptions): Promise<string> => {
  try {
    // Clean the input data to ensure it's valid
    const cleanData = data.trim();
    
    if (!cleanData) {
      throw new Error('QR code data cannot be empty');
    }
    
    // Generate QR code
    return await QRCode.toDataURL(cleanData, {
      width: size,
      margin: margin,
      color: color,
      errorCorrectionLevel: errorCorrectionLevel,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Utility functions to create specific QR code formats
export const createUrlQR = (url: string): string => {
  // Ensure URL has a protocol
  if (!/^https?:\/\//i.test(url) && url.length > 0) {
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

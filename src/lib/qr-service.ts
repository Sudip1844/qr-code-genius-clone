
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
    return await QRCode.toDataURL(data, {
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

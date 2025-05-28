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
  design?: {
    frame?: string;
    frameText?: string;
    frameFont?: string;
    frameColor?: string;
    shape?: string;
    borderStyle?: string;
    borderColor?: string;
    centerStyle?: string;
    centerColor?: string;
    logo?: string;
    gradient?: boolean;
  };
};

export const generateQRCode = async ({
  data,
  size = 300,
  margin = 4,
  color = { dark: '#000000', light: '#ffffff' },
  errorCorrectionLevel = 'M',
  design
}: QROptions): Promise<string> => {
  try {
    // Clean the input data to ensure it's valid
    const cleanData = data.trim();
    
    if (!cleanData) {
      throw new Error('QR code data cannot be empty');
    }
    
    // Configure QR code options based on design
    const qrOptions: any = {
      width: size,
      margin: margin,
      color: color,
      errorCorrectionLevel: errorCorrectionLevel,
    };
    
    // Apply shape styling
    if (design?.shape && design.shape !== 'square') {
      switch (design.shape) {
        case 'circle':
          qrOptions.type = 'png';
          qrOptions.rendererOpts = {
            ...qrOptions.rendererOpts,
            modules: {
              shape: 'circle'
            }
          };
          break;
        case 'rounded':
          qrOptions.rendererOpts = {
            ...qrOptions.rendererOpts,
            modules: {
              shape: 'rounded'
            }
          };
          break;
        case 'dots':
          qrOptions.rendererOpts = {
            ...qrOptions.rendererOpts,
            modules: {
              shape: 'circle',
              size: 0.8
            }
          };
          break;
      }
    }
    
    // Generate base QR code
    let qrDataUrl = await QRCode.toDataURL(cleanData, qrOptions);
    
    // Apply additional design features (frame, logo) using canvas manipulation
    if (design && (design.frame !== 'none' || design.logo !== 'none')) {
      qrDataUrl = await applyDesignFeatures(qrDataUrl, design, size);
    }
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

const applyDesignFeatures = async (qrDataUrl: string, design: any, size: number): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(qrDataUrl);
      return;
    }
    
    // Set canvas size with extra space for frame
    const frameSize = design.frame !== 'none' ? 60 : 0;
    canvas.width = size + frameSize;
    canvas.height = size + frameSize;
    
    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx.fillStyle = design.frame !== 'none' ? '#ffffff' : 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw frame if selected
      if (design.frame !== 'none') {
        drawFrame(ctx, design, canvas.width, canvas.height);
      }
      
      // Draw QR code
      const qrX = frameSize / 2;
      const qrY = frameSize / 2;
      ctx.drawImage(img, qrX, qrY, size, size);
      
      // Draw logo if selected
      if (design.logo !== 'none') {
        drawLogo(ctx, design.logo, qrX + size/2, qrY + size/2);
      }
      
      resolve(canvas.toDataURL());
    };
    img.src = qrDataUrl;
  });
};

const drawFrame = (ctx: CanvasRenderingContext2D, design: any, width: number, height: number) => {
  ctx.fillStyle = design.frameColor || '#000000';
  ctx.font = `bold 16px ${design.frameFont || 'Arial'}`;
  ctx.textAlign = 'center';
  
  switch (design.frame) {
    case 'basic':
      // Draw basic border
      ctx.strokeStyle = design.frameColor || '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      break;
    case 'rounded':
      // Draw rounded border
      const radius = 20;
      ctx.beginPath();
      ctx.roundRect(10, 10, width - 20, height - 20, radius);
      ctx.strokeStyle = design.frameColor || '#000000';
      ctx.lineWidth = 4;
      ctx.stroke();
      break;
    case 'banner':
      // Draw banner with text
      ctx.fillRect(0, 0, width, 30);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(design.frameText || 'SCAN ME', width/2, 20);
      break;
  }
  
  // Add frame text if not banner
  if (design.frame !== 'banner' && design.frameText) {
    ctx.fillStyle = design.frameColor || '#000000';
    ctx.fillText(design.frameText, width/2, height - 10);
  }
};

const drawLogo = (ctx: CanvasRenderingContext2D, logoType: string, x: number, y: number) => {
  const logoSize = 40;
  const logoX = x - logoSize/2;
  const logoY = y - logoSize/2;
  
  // Draw white background circle for logo
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, logoSize/2 + 5, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw logo based on type
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  
  const logoEmojis: { [key: string]: string } = {
    link: '🔗',
    location: '📍',
    email: '✉️',
    whatsapp: '💬',
    wifi: '📶',
    vcard: '👤',
    paypal: '💳',
    bitcoin: '₿',
    scan1: '📱',
    scan2: '📄',
    qr: '📊',
    menu: '📋',
    fullscreen: '⛶'
  };
  
  ctx.fillText(logoEmojis[logoType] || '📱', x, y + 8);
};

// Utility functions to create specific QR code formats
export const createUrlQR = (url: string): string => {
  if (url && !/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

export const createEmailQR = (email: string, subject?: string, body?: string): string => {
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

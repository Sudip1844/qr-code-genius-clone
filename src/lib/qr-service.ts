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
    logo?: string;
    customLogo?: string;
    logoSize?: number;
    logoOpacity?: number;
    logoPosition?: string;
    logoShape?: string;
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
    
    // For image data, convert it to a more scannable format
    let finalData = cleanData;
    if (cleanData.startsWith('data:image/')) {
      finalData = await convertImageToScannable(cleanData);
    }
    
    // Generate base QR code with appropriate error correction
    const qrOptions: any = {
      width: size,
      margin: margin,
      color: color,
      errorCorrectionLevel: errorCorrectionLevel,
    };
    
    // Generate base QR code
    let qrDataUrl = await QRCode.toDataURL(finalData, qrOptions);
    
    // Apply design features using canvas manipulation (logo only now)
    if (design) {
      qrDataUrl = await applyDesignFeatures(qrDataUrl, design, size, color);
    }
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('too big') || error.message.includes('data is too big')) {
        throw new Error('Data is too large for QR code. Please use smaller content or reduce image size.');
      }
    }
    
    throw new Error('Failed to generate QR code. Please try with smaller content.');
  }
};

// Convert image to a more scannable format
const convertImageToScannable = async (imageData: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!imageData.startsWith('data:image/')) {
      resolve(imageData);
      return;
    }
    
    try {
      // Instead of embedding the entire image, create a web-accessible URL
      // For now, we'll create a highly compressed version that can fit in a QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Use very small dimensions for maximum compatibility
        const maxSize = 24; // Even smaller for better QR compatibility
        let targetWidth = maxSize;
        let targetHeight = maxSize;
        
        // Maintain aspect ratio but keep very small
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 1) {
          targetHeight = Math.round(targetWidth / aspectRatio);
        } else {
          targetWidth = Math.round(targetHeight * aspectRatio);
        }
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        if (ctx) {
          // Use white background for better compression
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // Draw the image with anti-aliasing disabled for smaller file size
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          
          // Convert to JPEG with very low quality for maximum compression
          const compressed = canvas.toDataURL('image/jpeg', 0.1);
          
          // Check if the result is still too large for QR codes
          const base64Data = compressed.split(',')[1];
          const sizeInBytes = (base64Data.length * 3) / 4;
          
          if (sizeInBytes > 800) { // Very conservative limit
            // If still too large, create a text description instead
            const textDescription = `IMAGE:${targetWidth}x${targetHeight}:${Date.now()}`;
            console.warn('Image too large for QR code, using text representation');
            resolve(textDescription);
          } else {
            resolve(compressed);
          }
        } else {
          // Fallback to text representation
          resolve(`IMAGE:UPLOAD:${Date.now()}`);
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load image for QR conversion');
        resolve(`IMAGE:ERROR:${Date.now()}`);
      };
      
      img.src = imageData;
    } catch (error) {
      console.error('Error processing image for QR:', error);
      resolve(`IMAGE:PROCESSED:${Date.now()}`);
    }
  });
};

const applyDesignFeatures = async (qrDataUrl: string, design: any, size: number, color: any): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(qrDataUrl);
      return;
    }
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    const img = new Image();
    img.onload = () => {
      // Apply gradient background if enabled
      if (design.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color.light);
        gradient.addColorStop(1, adjustColorBrightness(color.light, -20));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw the base QR code
      ctx.drawImage(img, 0, 0, size, size);
      
      // Draw logo if selected (either predefined or custom)
      if (design.customLogo) {
        drawCustomLogo(ctx, design, size/2, size/2, size);
      } else if (design.logo && design.logo !== 'none') {
        drawLogo(ctx, design.logo, size/2, size/2, size);
      }
      
      resolve(canvas.toDataURL());
    };
    img.src = qrDataUrl;
  });
};

// Helper function to adjust color brightness for gradient
const adjustColorBrightness = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

const drawCustomLogo = (
  ctx: CanvasRenderingContext2D, 
  design: any, 
  centerX: number, 
  centerY: number, 
  qrSize: number
) => {
  const logoImg = new Image();
  logoImg.onload = () => {
    const logoSize = (design.logoSize || 15) / 100 * qrSize;
    const opacity = (design.logoOpacity || 100) / 100;
    
    // Save context for opacity
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // Calculate position
    let x = centerX - logoSize / 2;
    let y = centerY - logoSize / 2;
    
    switch (design.logoPosition) {
      case 'top-left':
        x = centerX - qrSize / 2 + 20;
        y = centerY - qrSize / 2 + 20;
        break;
      case 'top-right':
        x = centerX + qrSize / 2 - logoSize - 20;
        y = centerY - qrSize / 2 + 20;
        break;
      case 'bottom-left':
        x = centerX - qrSize / 2 + 20;
        y = centerY + qrSize / 2 - logoSize - 20;
        break;
      case 'bottom-right':
        x = centerX + qrSize / 2 - logoSize - 20;
        y = centerY + qrSize / 2 - logoSize - 20;
        break;
    }
    
    // Draw white background circle for better visibility
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2 + 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Apply logo shape
    ctx.save();
    switch (design.logoShape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2, 0, 2 * Math.PI);
        ctx.clip();
        break;
      case 'rounded':
        ctx.beginPath();
        ctx.roundRect(x, y, logoSize, logoSize, logoSize * 0.2);
        ctx.clip();
        break;
      case 'square':
        ctx.beginPath();
        ctx.rect(x, y, logoSize, logoSize);
        ctx.clip();
        break;
    }
    
    // Draw the logo
    ctx.drawImage(logoImg, x, y, logoSize, logoSize);
    ctx.restore();
    ctx.restore();
  };
  logoImg.src = design.customLogo;
};

const drawLogo = (ctx: CanvasRenderingContext2D, logoType: string, x: number, y: number, qrSize: number) => {
  const logoSize = qrSize * 0.12;
  
  // Draw white background circle for logo
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, logoSize/2 + 6, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw border around logo area
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw logo based on type
  ctx.fillStyle = '#333333';
  ctx.font = `bold ${logoSize * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const logoEmojis: { [key: string]: string } = {
    link: '🔗',
    location: '📍',
    email: '✉️',
    phone: '📞',
    whatsapp: '💬',
    facebook: '📘',
    instagram: '📷',
    twitter: '🐦',
    linkedin: '💼',
    youtube: '📺',
    wifi: '📶',
    vcard: '👤'
  };
  
  if (logoEmojis[logoType]) {
    ctx.font = `${logoSize * 0.7}px Arial`;
    ctx.fillText(logoEmojis[logoType], x, y);
  } else {
    // For other logos, show first letter
    ctx.font = `bold ${logoSize * 0.4}px Arial`;
    ctx.fillText(logoType.charAt(0).toUpperCase(), x, y);
  }
  
  ctx.restore();
};

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

export const createImageQR = (imageData: string): string => {
  if (!imageData) {
    return '';
  }
  
  // Return the image data directly - it will be processed in generateQRCode
  return imageData;
};

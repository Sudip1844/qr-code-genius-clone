
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
    
    // Generate base QR code with basic options
    const qrOptions: any = {
      width: size,
      margin: margin,
      color: color,
      errorCorrectionLevel: errorCorrectionLevel,
    };
    
    // Generate base QR code
    let qrDataUrl = await QRCode.toDataURL(cleanData, qrOptions);
    
    // Apply design features using canvas manipulation
    if (design) {
      qrDataUrl = await applyDesignFeatures(qrDataUrl, design, size, color);
    }
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

const applyDesignFeatures = async (qrDataUrl: string, design: any, size: number, color: any): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(qrDataUrl);
      return;
    }
    
    // Set canvas size with extra space for frame
    const frameSize = design.frame !== 'none' ? 80 : 0;
    canvas.width = size + frameSize;
    canvas.height = size + frameSize;
    
    const img = new Image();
    img.onload = () => {
      // Clear canvas with background
      ctx.fillStyle = design.frame !== 'none' ? color.light : 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw frame first if selected
      if (design.frame && design.frame !== 'none') {
        drawFrame(ctx, design, canvas.width, canvas.height);
      }
      
      // Create a temporary canvas for QR code manipulation
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        resolve(qrDataUrl);
        return;
      }
      
      tempCanvas.width = size;
      tempCanvas.height = size;
      
      // Draw original QR code to temp canvas
      tempCtx.drawImage(img, 0, 0, size, size);
      
      // Apply shape modifications
      if (design.shape && design.shape !== 'square') {
        applyShapeStyle(tempCtx, design.shape, size, color);
      }
      
      // Apply border style
      if (design.borderStyle && design.borderStyle !== 'square') {
        applyBorderStyle(tempCtx, design.borderStyle, design.borderColor || color.dark, size);
      }
      
      // Apply center style
      if (design.centerStyle && design.centerStyle !== 'square') {
        applyCenterStyle(tempCtx, design.centerStyle, design.centerColor || color.dark, size);
      }
      
      // Draw the modified QR code to main canvas
      const qrX = frameSize / 2;
      const qrY = frameSize / 2;
      ctx.drawImage(tempCanvas, qrX, qrY);
      
      // Draw logo if selected (either predefined or custom)
      if (design.customLogo) {
        drawCustomLogo(ctx, design, qrX + size/2, qrY + size/2, size);
      } else if (design.logo && design.logo !== 'none') {
        drawLogo(ctx, design.logo, qrX + size/2, qrY + size/2, size);
      }
      
      resolve(canvas.toDataURL());
    };
    img.src = qrDataUrl;
  });
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

const applyShapeStyle = (ctx: CanvasRenderingContext2D, shape: string, size: number, color: any) => {
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const moduleSize = size / 25; // Approximate QR module size
  
  // Process each module
  for (let y = 0; y < size; y += moduleSize) {
    for (let x = 0; x < size; x += moduleSize) {
      const centerX = x + moduleSize / 2;
      const centerY = y + moduleSize / 2;
      
      // Check if this module should be dark
      const pixelIndex = (Math.floor(centerY) * size + Math.floor(centerX)) * 4;
      if (data[pixelIndex] < 128) { // Dark module
        // Clear the square module first
        ctx.fillStyle = color.light;
        ctx.fillRect(x, y, moduleSize, moduleSize);
        
        // Draw new shape
        ctx.fillStyle = color.dark;
        drawModuleShape(ctx, shape, centerX, centerY, moduleSize * 0.8);
      }
    }
  }
};

const drawModuleShape = (ctx: CanvasRenderingContext2D, shape: string, x: number, y: number, size: number) => {
  const radius = size / 2;
  
  switch (shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'rounded':
      const cornerRadius = size * 0.3;
      ctx.beginPath();
      ctx.roundRect(x - radius, y - radius, size, size, cornerRadius);
      ctx.fill();
      break;
      
    case 'dots':
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.7, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x + radius, y);
      ctx.lineTo(x, y + radius);
      ctx.lineTo(x - radius, y);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'star':
      drawStar(ctx, x, y, radius);
      break;
      
    case 'heart':
      drawHeart(ctx, x, y, radius);
      break;
      
    case 'leaf':
      drawLeaf(ctx, x, y, radius);
      break;
      
    default: // square
      ctx.fillRect(x - radius, y - radius, size, size);
      break;
  }
};

const applyBorderStyle = (ctx: CanvasRenderingContext2D, borderStyle: string, borderColor: string, size: number) => {
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  
  switch (borderStyle) {
    case 'rounded':
      ctx.beginPath();
      ctx.roundRect(10, 10, size - 20, size - 20, 25);
      ctx.stroke();
      break;
      
    case 'circle':
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 10, 0, 2 * Math.PI);
      ctx.stroke();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(size/2, 10);
      ctx.lineTo(size - 10, size/2);
      ctx.lineTo(size/2, size - 10);
      ctx.lineTo(10, size/2);
      ctx.closePath();
      ctx.stroke();
      break;
      
    case 'dashed':
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(10, 10, size - 20, size - 20);
      ctx.setLineDash([]);
      break;
      
    default:
      ctx.strokeRect(10, 10, size - 20, size - 20);
      break;
  }
};

const applyCenterStyle = (ctx: CanvasRenderingContext2D, centerStyle: string, centerColor: string, size: number) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const centerSize = size * 0.2;
  
  // Clear center area first
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(centerX - centerSize/2, centerY - centerSize/2, centerSize, centerSize);
  
  // Draw center style
  ctx.fillStyle = centerColor;
  
  switch (centerStyle) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerSize/2, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'rounded':
      ctx.beginPath();
      ctx.roundRect(centerX - centerSize/2, centerY - centerSize/2, centerSize, centerSize, centerSize * 0.2);
      ctx.fill();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - centerSize/2);
      ctx.lineTo(centerX + centerSize/2, centerY);
      ctx.lineTo(centerX, centerY + centerSize/2);
      ctx.lineTo(centerX - centerSize/2, centerY);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'star':
      drawStar(ctx, centerX, centerY, centerSize/2);
      break;
      
    case 'heart':
      drawHeart(ctx, centerX, centerY, centerSize/2);
      break;
      
    default:
      ctx.fillRect(centerX - centerSize/2, centerY - centerSize/2, centerSize, centerSize);
      break;
  }
};

const drawFrame = (ctx: CanvasRenderingContext2D, design: any, width: number, height: number) => {
  ctx.fillStyle = design.frameColor || '#000000';
  ctx.font = `bold 16px ${design.frameFont || 'Arial'}`;
  ctx.textAlign = 'center';
  
  switch (design.frame) {
    case 'basic':
      ctx.strokeStyle = design.frameColor || '#000000';
      ctx.lineWidth = 6;
      ctx.strokeRect(5, 5, width - 10, height - 10);
      break;
      
    case 'rounded':
      ctx.strokeStyle = design.frameColor || '#000000';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(10, 10, width - 20, height - 20, 25);
      ctx.stroke();
      break;
      
    case 'banner':
      ctx.fillRect(0, 0, width, 40);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(design.frameText || 'SCAN ME', width/2, 25);
      break;
      
    case 'badge':
      // Draw badge-like frame
      ctx.fillStyle = design.frameColor || '#000000';
      ctx.beginPath();
      ctx.roundRect(15, 15, width - 30, height - 30, 15);
      ctx.stroke();
      ctx.lineWidth = 3;
      break;
  }
  
  // Add frame text if not banner
  if (design.frame !== 'banner' && design.frameText) {
    ctx.fillStyle = design.frameColor || '#000000';
    ctx.fillText(design.frameText, width/2, height - 15);
  }
};

const drawLogo = (ctx: CanvasRenderingContext2D, logoType: string, x: number, y: number, qrSize: number) => {
  const logoSize = qrSize * 0.15; // 15% of QR code size
  
  // Draw white background circle for logo
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, logoSize/2 + 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw border around logo area
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw logo based on type
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${logoSize * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const logoEmojis: { [key: string]: string } = {
    link: '🔗',
    location: '📍',
    email: '✉️',
    whatsapp: '💬',
    wifi: '📶',
    vcard: '👤',
    paypal: '💳',
    bitcoin: '₿',
    instagram: '📷',
    facebook: '📘',
    twitter: '🐦',
    youtube: '📺',
    linkedin: '💼',
    tiktok: '🎵'
  };
  
  if (logoEmojis[logoType]) {
    ctx.font = `${logoSize * 0.8}px Arial`;
    ctx.fillText(logoEmojis[logoType], x, y);
  } else {
    // For text logos like "SCAN ME"
    ctx.font = `bold ${logoSize * 0.3}px Arial`;
    ctx.fillText(logoType === 'scan' ? 'SCAN' : '📱', x, y);
  }
};

// Helper functions for complex shapes
const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  const spikes = 5;
  const outerRadius = radius;
  const innerRadius = radius * 0.5;
  
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const px = x + Math.cos(angle - Math.PI / 2) * r;
    const py = y + Math.sin(angle - Math.PI / 2) * r;
    
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
};

const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  ctx.beginPath();
  const topCurveHeight = radius * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  
  // Left curve
  ctx.bezierCurveTo(
    x, y, 
    x - radius / 2, y, 
    x - radius / 2, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x - radius / 2, y + (radius + topCurveHeight) / 2, 
    x, y + (radius + topCurveHeight) / 2, 
    x, y + radius
  );
  
  // Right curve
  ctx.bezierCurveTo(
    x, y + (radius + topCurveHeight) / 2, 
    x + radius / 2, y + (radius + topCurveHeight) / 2, 
    x + radius / 2, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + radius / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );
  
  ctx.closePath();
  ctx.fill();
};

const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x - radius, y);
  ctx.quadraticCurveTo(x, y - radius, x + radius, y);
  ctx.quadraticCurveTo(x, y + radius, x - radius, y);
  ctx.closePath();
  ctx.fill();
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

export const createImageQR = (imageData: string): string => {
  if (!imageData) {
    return '';
  }
  
  // Compress image data for QR code compatibility
  const compressImageForQR = (dataUrl: string): string => {
    try {
      // Check if it's a data URL
      if (!dataUrl.startsWith('data:')) {
        return dataUrl;
      }
      
      // Extract base64 data
      const base64Data = dataUrl.split(',')[1];
      if (!base64Data) {
        return dataUrl;
      }
      
      // Calculate approximate size (base64 adds ~33% overhead)
      const sizeInBytes = (base64Data.length * 3) / 4;
      
      // QR code capacity limits (approximate):
      // L: 2953 bytes, M: 2331 bytes, Q: 1663 bytes, H: 1273 bytes
      const maxSize = 1200; // Conservative limit for reliable scanning
      
      if (sizeInBytes <= maxSize) {
        return dataUrl;
      }
      
      // If too large, create a smaller version
      return new Promise<string>((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Calculate new dimensions to reduce file size
          let { width, height } = img;
          const scaleFactor = Math.sqrt(maxSize / sizeInBytes);
          
          width = Math.floor(width * scaleFactor);
          height = Math.floor(height * scaleFactor);
          
          // Ensure minimum size
          if (width < 32) width = 32;
          if (height < 32) height = 32;
          
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Use lower quality for smaller file size
            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressed);
          } else {
            resolve(dataUrl);
          }
        };
        
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      }).then(result => result).catch(() => dataUrl);
      
    } catch (error) {
      console.error('Error compressing image:', error);
      return dataUrl;
    }
  };
  
  // For synchronous operation, return the original data
  // The compression will be handled in the component
  return imageData;
};

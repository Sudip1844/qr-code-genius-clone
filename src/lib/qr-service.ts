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
    const frameSize = design.frame && design.frame !== 'none' ? 100 : 0;
    canvas.width = size + frameSize;
    canvas.height = size + frameSize;
    
    const img = new Image();
    img.onload = () => {
      // Clear canvas with background
      ctx.fillStyle = design.frame !== 'none' ? color.light : 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw frame first if selected
      if (design.frame && design.frame !== 'none') {
        drawFrame(ctx, design, canvas.width, canvas.height, color);
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
      
      // Apply shape modifications if not classic
      if (design.shape && design.shape !== 'classic') {
        console.log('Applying shape style:', design.shape);
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
      
      // Draw logo if selected
      if (design.logo && design.logo !== 'none') {
        drawLogo(ctx, design.logo, qrX + size/2, qrY + size/2, size);
      }
      
      resolve(canvas.toDataURL());
    };
    img.src = qrDataUrl;
  });
};

const applyShapeStyle = (ctx: CanvasRenderingContext2D, shape: string, size: number, color: any) => {
  console.log('Starting shape application:', shape);
  
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  // Create a new canvas for the modified QR code
  const newCanvas = document.createElement('canvas');
  const newCtx = newCanvas.getContext('2d');
  if (!newCtx) return;
  
  newCanvas.width = size;
  newCanvas.height = size;
  
  // Fill with background color
  newCtx.fillStyle = color.light;
  newCtx.fillRect(0, 0, size, size);
  
  // Estimate module size (QR codes are typically 21x21, 25x25, 29x29, etc.)
  const estimatedModules = Math.round(Math.sqrt(size * size / 400)); // Rough estimate
  const moduleSize = Math.floor(size / (estimatedModules * 1.2)); // Adjust for margin
  
  console.log('Module size:', moduleSize, 'Estimated modules:', estimatedModules);
  
  // Scan for dark modules and replace with shapes
  for (let y = moduleSize; y < size - moduleSize; y += moduleSize) {
    for (let x = moduleSize; x < size - moduleSize; x += moduleSize) {
      // Sample the center of each potential module
      const centerX = x + moduleSize / 2;
      const centerY = y + moduleSize / 2;
      
      if (centerX >= size || centerY >= size) continue;
      
      const pixelIndex = (Math.floor(centerY) * size + Math.floor(centerX)) * 4;
      const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
      
      // If this is a dark module (brightness < 128), draw the custom shape
      if (brightness < 128) {
        newCtx.fillStyle = color.dark;
        drawModuleShape(newCtx, shape, centerX, centerY, moduleSize * 0.9);
      }
    }
  }
  
  // Replace the original image with the new shaped version
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(newCanvas, 0, 0);
  
  console.log('Shape application completed');
};

const drawModuleShape = (ctx: CanvasRenderingContext2D, shape: string, x: number, y: number, size: number) => {
  const radius = size / 2;
  
  ctx.save();
  
  switch (shape) {
    case 'liquid':
      // Organic, flowing shapes
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.8, y - radius * 0.6);
      ctx.bezierCurveTo(x - radius, y - radius, x + radius, y - radius, x + radius * 0.8, y - radius * 0.6);
      ctx.bezierCurveTo(x + radius, y, x + radius, y + radius, x, y + radius);
      ctx.bezierCurveTo(x - radius, y + radius, x - radius, y, x - radius * 0.8, y - radius * 0.6);
      ctx.fill();
      break;
      
    case 'horizontal':
      // Horizontal bars
      ctx.fillRect(x - radius, y - radius * 0.3, size, radius * 0.6);
      break;
      
    case 'vertical':
      // Vertical bars
      ctx.fillRect(x - radius * 0.3, y - radius, radius * 0.6, size);
      break;
      
    case 'small-square':
      // Smaller squares
      const smallSize = size * 0.7;
      const smallRadius = smallSize / 2;
      ctx.fillRect(x - smallRadius, y - smallRadius, smallSize, smallSize);
      break;
      
    case 'blob':
      // Organic blob shapes
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.9, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'pointed':
      // Diamond/pointed shapes
      ctx.beginPath();
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x + radius, y);
      ctx.lineTo(x, y + radius);
      ctx.lineTo(x - radius, y);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'circle':
      // Perfect circles
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.8, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    default: // classic
      ctx.fillRect(x - radius, y - radius, size, size);
      break;
  }
  
  ctx.restore();
};

const applyBorderStyle = (ctx: CanvasRenderingContext2D, borderStyle: string, borderColor: string, size: number) => {
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  
  switch (borderStyle) {
    case 'rounded-square':
      ctx.beginPath();
      ctx.roundRect(15, 15, size - 30, size - 30, 25);
      ctx.stroke();
      break;
      
    case 'circle':
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 15, 0, 2 * Math.PI);
      ctx.stroke();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(size/2, 15);
      ctx.lineTo(size - 15, size/2);
      ctx.lineTo(size/2, size - 15);
      ctx.lineTo(15, size/2);
      ctx.closePath();
      ctx.stroke();
      break;
      
    case 'leaf-left':
      ctx.beginPath();
      ctx.arc(size/4, size/2, size/3, 0, 2 * Math.PI);
      ctx.stroke();
      break;
      
    case 'leaf-right':
      ctx.beginPath();
      ctx.arc(size * 3/4, size/2, size/3, 0, 2 * Math.PI);
      ctx.stroke();
      break;
      
    case 'dot-square':
      ctx.setLineDash([15, 10]);
      ctx.strokeRect(15, 15, size - 30, size - 30);
      ctx.setLineDash([]);
      break;
      
    case 'rounded-bottom':
      ctx.beginPath();
      ctx.moveTo(15, 15);
      ctx.lineTo(size - 15, 15);
      ctx.lineTo(size - 15, size/2);
      ctx.arc(size/2, size/2, size/2 - 15, 0, Math.PI);
      ctx.lineTo(15, size/2);
      ctx.closePath();
      ctx.stroke();
      break;
      
    default:
      ctx.strokeRect(15, 15, size - 30, size - 30);
      break;
  }
};

const applyCenterStyle = (ctx: CanvasRenderingContext2D, centerStyle: string, centerColor: string, size: number) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const centerSize = size * 0.15;
  
  // Clear center area first
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(centerX - centerSize, centerY - centerSize, centerSize * 2, centerSize * 2);
  
  // Draw center style
  ctx.fillStyle = centerColor;
  
  switch (centerStyle) {
    case 'rounded-square':
      ctx.beginPath();
      ctx.roundRect(centerX - centerSize, centerY - centerSize, centerSize * 2, centerSize * 2, centerSize * 0.3);
      ctx.fill();
      break;
      
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerSize, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - centerSize);
      ctx.lineTo(centerX + centerSize, centerY);
      ctx.lineTo(centerX, centerY + centerSize);
      ctx.lineTo(centerX - centerSize, centerY);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'star':
      drawStar(ctx, centerX, centerY, centerSize);
      break;
      
    case 'heart':
      drawHeart(ctx, centerX, centerY, centerSize);
      break;
      
    case 'flower':
      drawFlower(ctx, centerX, centerY, centerSize);
      break;
      
    case 'plus':
      const thickness = centerSize * 0.4;
      ctx.fillRect(centerX - thickness/2, centerY - centerSize, thickness, centerSize * 2);
      ctx.fillRect(centerX - centerSize, centerY - thickness/2, centerSize * 2, thickness);
      break;
      
    default:
      ctx.fillRect(centerX - centerSize, centerY - centerSize, centerSize * 2, centerSize * 2);
      break;
  }
};

const drawFrame = (ctx: CanvasRenderingContext2D, design: any, width: number, height: number, color: any) => {
  const frameColor = design.frameColor || '#000000';
  const frameText = design.frameText || 'SCAN ME';
  
  ctx.save();
  
  switch (design.frame) {
    case 'basic':
      // Simple thick border
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      break;
      
    case 'rounded':
      // Rounded corners with shadow effect
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.roundRect(15, 15, width - 30, height - 30, 30);
      ctx.fill();
      
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = color.light;
      ctx.beginPath();
      ctx.roundRect(25, 25, width - 50, height - 50, 20);
      ctx.fill();
      break;
      
    case 'banner':
      // Top banner with text
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, width, 60);
      
      // Banner text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(frameText, width/2, 35);
      
      // Side borders
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 60, 20, height - 60);
      ctx.fillRect(width - 20, 60, 20, height - 60);
      ctx.fillRect(0, height - 20, width, 20);
      break;
      
    case 'badge':
      // Badge-style with decorative corners
      ctx.fillStyle = frameColor;
      
      // Main border
      ctx.fillRect(5, 5, width - 10, 15);
      ctx.fillRect(5, height - 20, width - 10, 15);
      ctx.fillRect(5, 5, 15, height - 10);
      ctx.fillRect(width - 20, 5, 15, height - 10);
      
      // Corner decorations
      ctx.beginPath();
      ctx.arc(25, 25, 10, 0, 2 * Math.PI);
      ctx.arc(width - 25, 25, 10, 0, 2 * Math.PI);
      ctx.arc(25, height - 25, 10, 0, 2 * Math.PI);
      ctx.arc(width - 25, height - 25, 10, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'button':
      // Button-style with 3D effect
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, frameColor);
      gradient.addColorStop(0.5, lightenColor(frameColor, 20));
      gradient.addColorStop(1, darkenColor(frameColor, 20));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(10, 10, width - 20, height - 20, 25);
      ctx.fill();
      
      // Inner border
      ctx.strokeStyle = lightenColor(frameColor, 40);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(15, 15, width - 30, height - 30, 20);
      ctx.stroke();
      break;
      
    case 'card':
      // Card-style with multiple borders
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = lightenColor(frameColor, 60);
      ctx.fillRect(8, 8, width - 16, height - 16);
      
      ctx.fillStyle = color.light;
      ctx.fillRect(16, 16, width - 32, height - 32);
      break;
      
    case 'phone':
      // Phone frame style
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.roundRect(20, 10, width - 40, height - 20, 35);
      ctx.fill();
      
      // Screen area
      ctx.fillStyle = color.light;
      ctx.beginPath();
      ctx.roundRect(30, 30, width - 60, height - 60, 20);
      ctx.fill();
      
      // Home button
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.arc(width/2, height - 35, 8, 0, 2 * Math.PI);
      ctx.fill();
      break;
  }
  
  // Add frame text if not banner (banner handles its own text)
  if (design.frame !== 'banner' && design.frame !== 'none' && frameText) {
    ctx.fillStyle = frameColor;
    ctx.font = `bold 14px ${design.frameFont || 'Arial'}`;
    ctx.textAlign = 'center';
    ctx.fillText(frameText, width/2, height - 25);
  }
  
  ctx.restore();
};

const drawLogo = (ctx: CanvasRenderingContext2D, logoType: string, x: number, y: number, qrSize: number) => {
  const logoSize = qrSize * 0.12;
  
  // Draw white background circle for logo
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, logoSize + 6, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw border around logo area
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw logo based on type
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${logoSize}px Arial`;
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
    ctx.font = `${logoSize * 1.2}px Arial`;
    ctx.fillText(logoEmojis[logoType], x, y);
  } else if (logoType.includes('scan')) {
    ctx.font = `bold ${logoSize * 0.4}px Arial`;
    ctx.fillText('SCAN', x, y - 3);
    ctx.fillText('ME', x, y + 8);
  } else {
    ctx.font = `bold ${logoSize * 0.5}px Arial`;
    ctx.fillText('📱', x, y);
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
  
  ctx.bezierCurveTo(x, y, x - radius / 2, y, x - radius / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - radius / 2, y + (radius + topCurveHeight) / 2, x, y + (radius + topCurveHeight) / 2, x, y + radius);
  ctx.bezierCurveTo(x, y + (radius + topCurveHeight) / 2, x + radius / 2, y + (radius + topCurveHeight) / 2, x + radius / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + radius / 2, y, x, y, x, y + topCurveHeight);
  
  ctx.closePath();
  ctx.fill();
};

const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  const petalCount = 6;
  const petalRadius = radius * 0.6;
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 2 * Math.PI) / petalCount;
    const petalX = x + Math.cos(angle) * petalRadius * 0.5;
    const petalY = y + Math.sin(angle) * petalRadius * 0.5;
    
    ctx.beginPath();
    ctx.arc(petalX, petalY, petalRadius * 0.4, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Center
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.3, 0, 2 * Math.PI);
  ctx.fill();
};

// Color utility functions
const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};

const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 + (B > 255 ? 255 : B < 0 ? 0 : B))
    .toString(16).slice(1);
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

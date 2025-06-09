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
  errorCorrectionLevel = 'H', // Use high error correction for better scannability with styles
  design
}: QROptions): Promise<string> => {
  try {
    const cleanData = data.trim();
    
    if (!cleanData) {
      throw new Error('QR code data cannot be empty');
    }
    
    // Generate base QR code with high error correction
    const qrOptions: any = {
      width: size,
      margin: margin,
      color: color,
      errorCorrectionLevel: errorCorrectionLevel,
    };
    
    // Generate base QR code
    let qrDataUrl = await QRCode.toDataURL(cleanData, qrOptions);
    
    // Apply design features using canvas manipulation
    if (design && (design.shape !== 'square' || design.centerStyle !== 'square' || design.gradient)) {
      qrDataUrl = await applyDesignFeatures(qrDataUrl, design, size, color);
    }
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code. Please try with smaller content.');
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
    
    canvas.width = size;
    canvas.height = size;
    
    const img = new Image();
    img.onload = () => {
      // Apply background
      if (design.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color.light);
        gradient.addColorStop(1, adjustColorBrightness(color.light, -20));
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = color.light;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw original QR code to get module positions
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        resolve(qrDataUrl);
        return;
      }
      
      tempCanvas.width = size;
      tempCanvas.height = size;
      tempCtx.drawImage(img, 0, 0, size, size);
      
      // Apply shape modifications
      if (design.shape && design.shape !== 'square') {
        applyShapeStyle(ctx, tempCtx, design.shape, size, color, design.gradient);
      } else {
        // Just draw the original QR if no shape changes
        ctx.drawImage(img, 0, 0, size, size);
      }
      
      // Apply center style
      if (design.centerStyle && design.centerStyle !== 'square') {
        applyCenterStyle(ctx, design.centerStyle, design.centerColor || color.dark, size);
      }
      
      resolve(canvas.toDataURL());
    };
    img.src = qrDataUrl;
  });
};

const applyShapeStyle = (
  ctx: CanvasRenderingContext2D, 
  sourceCtx: CanvasRenderingContext2D, 
  shape: string, 
  size: number, 
  color: any, 
  gradient?: boolean
) => {
  const imageData = sourceCtx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  // Calculate module size more accurately
  const moduleSize = Math.round(size / 29); // QR codes typically have 21-177 modules, estimate for common sizes
  const actualModuleSize = Math.max(moduleSize, 8); // Minimum size for visibility
  
  // Set fill style
  if (gradient) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, color.dark);
    grad.addColorStop(1, adjustColorBrightness(color.dark, 30));
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = color.dark;
  }
  
  // Scan for dark modules and replace with shapes
  for (let y = 0; y < size; y += Math.round(actualModuleSize * 0.8)) {
    for (let x = 0; x < size; x += Math.round(actualModuleSize * 0.8)) {
      // Sample multiple points to determine if this is a dark module
      const samplePoints = [
        { x: x + actualModuleSize * 0.25, y: y + actualModuleSize * 0.25 },
        { x: x + actualModuleSize * 0.75, y: y + actualModuleSize * 0.25 },
        { x: x + actualModuleSize * 0.25, y: y + actualModuleSize * 0.75 },
        { x: x + actualModuleSize * 0.75, y: y + actualModuleSize * 0.75 },
        { x: x + actualModuleSize * 0.5, y: y + actualModuleSize * 0.5 }
      ];
      
      let darkPixels = 0;
      for (const point of samplePoints) {
        const px = Math.min(Math.floor(point.x), size - 1);
        const py = Math.min(Math.floor(point.y), size - 1);
        const pixelIndex = (py * size + px) * 4;
        
        if (data[pixelIndex] < 128) { // Dark pixel
          darkPixels++;
        }
      }
      
      // If majority of sampled points are dark, draw the shape
      if (darkPixels >= 3) {
        const centerX = x + actualModuleSize / 2;
        const centerY = y + actualModuleSize / 2;
        
        // Skip if this is near a finder pattern (corners)
        const margin = size * 0.15;
        const isNearCorner = (
          (x < margin && y < margin) || // Top-left
          (x > size - margin && y < margin) || // Top-right
          (x < margin && y > size - margin) // Bottom-left
        );
        
        if (!isNearCorner) {
          drawModuleShape(ctx, shape, centerX, centerY, actualModuleSize * 0.9, gradient, color);
        } else {
          // Draw square for finder patterns to maintain scannability
          ctx.fillRect(x, y, actualModuleSize, actualModuleSize);
        }
      }
    }
  }
};

const drawModuleShape = (
  ctx: CanvasRenderingContext2D, 
  shape: string, 
  x: number, 
  y: number, 
  size: number, 
  gradient?: boolean, 
  color?: any
) => {
  const radius = size / 2;
  
  ctx.save();
  
  switch (shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.85, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'rounded':
      const cornerRadius = radius * 0.25;
      ctx.beginPath();
      ctx.roundRect(x - radius, y - radius, size, size, cornerRadius);
      ctx.fill();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(x, y - radius * 0.9);
      ctx.lineTo(x + radius * 0.9, y);
      ctx.lineTo(x, y + radius * 0.9);
      ctx.lineTo(x - radius * 0.9, y);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'vertical':
      ctx.fillRect(x - radius * 0.3, y - radius, radius * 0.6, size);
      break;
      
    case 'horizontal':
      ctx.fillRect(x - radius, y - radius * 0.3, size, radius * 0.6);
      break;
      
    case 'small-square':
      const smallSize = size * 0.6;
      const smallRadius = smallSize / 2;
      ctx.fillRect(x - smallRadius, y - smallRadius, smallSize, smallSize);
      break;
      
    case 'leaf':
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.8, y);
      ctx.bezierCurveTo(x - radius * 0.8, y - radius * 0.8, x, y - radius * 0.8, x + radius * 0.8, y);
      ctx.bezierCurveTo(x, y + radius * 0.8, x - radius * 0.8, y + radius * 0.8, x - radius * 0.8, y);
      ctx.fill();
      break;
      
    default: // square
      ctx.fillRect(x - radius, y - radius, size, size);
      break;
  }
  
  ctx.restore();
};

const applyCenterStyle = (ctx: CanvasRenderingContext2D, centerStyle: string, centerColor: string, size: number) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const centerSize = size * 0.12; // Smaller center to avoid interfering with QR readability
  const radius = centerSize / 2;
  
  // Clear center area first with white background
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw center style
  ctx.fillStyle = centerColor;
  
  switch (centerStyle) {
    case 'rounded':
      ctx.beginPath();
      ctx.roundRect(centerX - radius, centerY - radius, centerSize, centerSize, radius * 0.3);
      ctx.fill();
      break;
      
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX + radius, centerY);
      ctx.lineTo(centerX, centerY + radius);
      ctx.lineTo(centerX - radius, centerY);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'star':
      drawStar(ctx, centerX, centerY, radius);
      break;
      
    case 'heart':
      drawHeart(ctx, centerX, centerY, radius);
      break;
      
    case 'flower':
      drawFlower(ctx, centerX, centerY, radius);
      break;
      
    case 'plus':
      ctx.fillRect(centerX - radius, centerY - radius * 0.3, centerSize, radius * 0.6);
      ctx.fillRect(centerX - radius * 0.3, centerY - radius, radius * 0.6, centerSize);
      break;
      
    default: // square
      ctx.fillRect(centerX - radius, centerY - radius, centerSize, centerSize);
      break;
  }
  
  ctx.restore();
};

// Helper function to adjust color brightness
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

// Helper functions for complex center shapes
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
  ctx.bezierCurveTo(x, y, x - radius / 2, y, x - radius / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - radius / 2, y + (radius + topCurveHeight) / 2, x, y + (radius + topCurveHeight) / 2, x, y + radius);
  
  // Right curve
  ctx.bezierCurveTo(x, y + (radius + topCurveHeight) / 2, x + radius / 2, y + (radius + topCurveHeight) / 2, x + radius / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + radius / 2, y, x, y, x, y + topCurveHeight);
  
  ctx.closePath();
  ctx.fill();
};

const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  const petalCount = 6;
  const petalRadius = radius * 0.4;
  
  ctx.save();
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 2 * Math.PI) / petalCount;
    const petalX = x + Math.cos(angle) * radius * 0.3;
    const petalY = y + Math.sin(angle) * radius * 0.3;
    
    ctx.beginPath();
    ctx.arc(petalX, petalY, petalRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Center circle
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.2, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.restore();
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
  
  // Return the image data directly - it will be processed in generateQRCode
  return imageData;
};

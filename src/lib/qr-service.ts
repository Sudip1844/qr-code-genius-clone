import QRCode from 'qrcode';

export interface QROptions {
  data: string;
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
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
}

// Logo mapping with SVG paths and designs
const logoSvgMap: Record<string, string> = {
  'link': `<g fill="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></g>`,
  'location': `<g fill="currentColor"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></g>`,
  'email': `<g fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></g>`,
  'whatsapp': `<g fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></g>`,
  'wifi': `<g fill="currentColor"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></g>`,
  'vcard': `<g fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></g>`,
  'paypal': `<g fill="currentColor"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="7" x2="22" y2="7"></line></g>`,
  'bitcoin': `<g fill="currentColor"><circle cx="12" cy="12" r="10"></circle><path d="M9.5 8.5h2.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-2.5"></path><path d="M9.5 13.5h3c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-3"></path><line x1="12" y1="6" x2="12" y2="8.5"></line><line x1="12" y1="18.5" x2="12" y2="21"></line></g>`,
  'scan-me-1': `<g fill="currentColor"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 12h10"></path></g>`,
  'scan-me-2': `<g fill="currentColor"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></g>`,
  'qr-scanner': `<g fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></g>`,
  'menu-qr': `<g fill="currentColor"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></g>`,
  'focus-qr': `<g fill="currentColor"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></g>`
};

const createLogoSvg = (logoType: string, size: number, color: string = '#000000'): string => {
  const svgPath = logoSvgMap[logoType];
  if (!svgPath) return '';
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${svgPath.replace(/currentColor/g, color)}
  </svg>`;
};

export const generateQRCode = async (options: QROptions): Promise<string> => {
  try {
    const {
      data,
      size = 300,
      margin = 4,
      color = { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel = 'M',
      design
    } = options;

    // Generate basic QR code
    const qrOptions = {
      errorCorrectionLevel,
      type: 'image/png' as const,
      quality: 0.92,
      margin: margin,
      color: {
        dark: color.dark || '#000000',
        light: color.light || '#FFFFFF',
      },
      width: size,
    };

    const qrDataURL = await QRCode.toDataURL(data, qrOptions);
    
    if (!design || (!design.frame && !design.shape && !design.logo && !design.customLogo && !design.gradient)) {
      return qrDataURL;
    }

    // Create canvas for custom design
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size with extra space for frame
    const frameSize = design.frame && design.frame !== 'none' ? 80 : 0;
    canvas.width = size + frameSize;
    canvas.height = size + frameSize;

    // Load QR code image
    const qrImage = new Image();
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve;
      qrImage.onerror = reject;
      qrImage.src = qrDataURL;
    });

    // Clear canvas with background
    if (design.gradient && color.light !== '#00000000') {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, color.light || '#FFFFFF');
      gradient.addColorStop(1, adjustColorBrightness(color.light || '#FFFFFF', -20));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = color.light === '#00000000' ? 'transparent' : (color.light || '#FFFFFF');
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw frame if specified
    if (design.frame && design.frame !== 'none') {
      drawFrame(ctx, canvas.width, canvas.height, design.frame, design.frameText || 'SCAN ME', design.frameFont || 'Sans-Serif', design.frameColor || '#000000');
    }

    // Calculate QR position (centered, with frame offset)
    const qrX = frameSize / 2;
    const qrY = frameSize / 2;

    // Draw QR code with custom shape if specified
    if (design.shape && design.shape !== 'classic') {
      await drawCustomShapeQR(ctx, qrImage, qrX, qrY, size, design.shape, color.dark || '#000000', design.borderStyle, design.borderColor, design.centerStyle, design.centerColor);
    } else {
      ctx.drawImage(qrImage, qrX, qrY, size, size);
    }

    // Add logo if specified
    if (design.logo && design.logo !== 'none') {
      await addLogoToQR(ctx, qrX + size/2, qrY + size/2, design.logo, design.customLogo, design.logoSize || 15, design.logoOpacity || 100, design.logoPosition || 'center', design.logoShape || 'original');
    } else if (design.customLogo) {
      await addLogoToQR(ctx, qrX + size/2, qrY + size/2, 'custom', design.customLogo, design.logoSize || 15, design.logoOpacity || 100, design.logoPosition || 'center', design.logoShape || 'original');
    }

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('QR generation error:', error);
    throw error;
  }
};

const addLogoToQR = async (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  logoType: string,
  customLogo?: string,
  logoSize: number = 15,
  logoOpacity: number = 100,
  logoPosition: string = 'center',
  logoShape: string = 'original'
): Promise<void> => {
  try {
    const qrSize = 300; // Base QR size
    const actualLogoSize = (qrSize * logoSize) / 100;
    
    // Calculate position
    let logoX = centerX - actualLogoSize / 2;
    let logoY = centerY - actualLogoSize / 2;
    
    if (logoPosition !== 'center') {
      const offset = qrSize * 0.35;
      switch (logoPosition) {
        case 'top-left':
          logoX = centerX - offset;
          logoY = centerY - offset;
          break;
        case 'top-right':
          logoX = centerX + offset - actualLogoSize;
          logoY = centerY - offset;
          break;
        case 'bottom-left':
          logoX = centerX - offset;
          logoY = centerY + offset - actualLogoSize;
          break;
        case 'bottom-right':
          logoX = centerX + offset - actualLogoSize;
          logoY = centerY + offset - actualLogoSize;
          break;
      }
    }

    // Set opacity
    ctx.globalAlpha = logoOpacity / 100;

    // Create white background for logo
    const bgPadding = actualLogoSize * 0.2;
    const bgSize = actualLogoSize + bgPadding * 2;
    const bgX = logoX - bgPadding;
    const bgY = logoY - bgPadding;

    ctx.fillStyle = '#FFFFFF';
    if (logoShape === 'circle') {
      ctx.beginPath();
      ctx.arc(bgX + bgSize/2, bgY + bgSize/2, bgSize/2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      const radius = logoShape === 'rounded' ? bgSize * 0.1 : 0;
      drawRoundedRect(ctx, bgX, bgY, bgSize, bgSize, radius);
      ctx.fill();
    }

    if (logoType === 'custom' && customLogo) {
      // Handle custom logo
      const logoImage = new Image();
      await new Promise((resolve, reject) => {
        logoImage.onload = resolve;
        logoImage.onerror = reject;
        logoImage.src = customLogo;
      });
      
      if (logoShape === 'circle') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoX + actualLogoSize/2, logoY + actualLogoSize/2, actualLogoSize/2, 0, 2 * Math.PI);
        ctx.clip();
      }
      
      ctx.drawImage(logoImage, logoX, logoY, actualLogoSize, actualLogoSize);
      
      if (logoShape === 'circle') {
        ctx.restore();
      }
    } else {
      // Handle predefined logos using SVG
      const svgString = createLogoSvg(logoType, Math.round(actualLogoSize), '#000000');
      if (svgString) {
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const logoImage = new Image();
        await new Promise((resolve, reject) => {
          logoImage.onload = () => {
            URL.revokeObjectURL(svgUrl);
            resolve(undefined);
          };
          logoImage.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            reject();
          };
          logoImage.src = svgUrl;
        });
        
        if (logoShape === 'circle') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(logoX + actualLogoSize/2, logoY + actualLogoSize/2, actualLogoSize/2, 0, 2 * Math.PI);
          ctx.clip();
        }
        
        ctx.drawImage(logoImage, logoX, logoY, actualLogoSize, actualLogoSize);
        
        if (logoShape === 'circle') {
          ctx.restore();
        }
      }
    }

    // Reset opacity
    ctx.globalAlpha = 1;
  } catch (error) {
    console.error('Error adding logo:', error);
    // Continue without logo if there's an error
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
    
    // Set canvas size with extra space for frame
    const frameSize = design.frame !== 'none' ? 80 : 0;
    canvas.width = size + frameSize;
    canvas.height = size + frameSize;
    
    const img = new Image();
    img.onload = () => {
      // Apply gradient background if enabled
      if (design.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color.light);
        gradient.addColorStop(1, adjustColorBrightness(color.light, -20));
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = design.frame !== 'none' ? color.light : 'transparent';
      }
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
      if (design.shape && design.shape !== 'classic') {
        applyShapeStyle(tempCtx, design.shape, size, color, design.gradient);
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

const applyShapeStyle = (ctx: CanvasRenderingContext2D, shape: string, size: number, color: any, gradient?: boolean) => {
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  // Detect QR modules by analyzing the image
  const moduleSize = Math.floor(size / 25); // Approximate QR module size for a typical QR code
  
  // Clear the canvas first
  if (gradient) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, color.dark);
    grad.addColorStop(1, adjustColorBrightness(color.dark, 30));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = color.light;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = color.dark;
  }
  
  // Redraw with new shapes
  for (let y = 0; y < size; y += moduleSize) {
    for (let x = 0; x < size; x += moduleSize) {
      // Check if this area should be dark by sampling the center pixel
      const centerX = Math.min(x + moduleSize / 2, size - 1);
      const centerY = Math.min(y + moduleSize / 2, size - 1);
      const pixelIndex = (Math.floor(centerY) * size + Math.floor(centerX)) * 4;
      
      // If the pixel is dark (black or close to black)
      if (data[pixelIndex] < 128) {
        const moduleCenterX = x + moduleSize / 2;
        const moduleCenterY = y + moduleSize / 2;
        
        drawModuleShape(ctx, shape, moduleCenterX, moduleCenterY, moduleSize * 0.85, gradient, color);
      }
    }
  }
};

const drawModuleShape = (ctx: CanvasRenderingContext2D, shape: string, x: number, y: number, size: number, gradient?: boolean, color?: any) => {
  const radius = size / 2;
  
  ctx.save();
  
  // Apply gradient fill if enabled
  if (gradient && color) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color.dark);
    grad.addColorStop(1, adjustColorBrightness(color.dark, -30));
    ctx.fillStyle = grad;
  }
  
  switch (shape) {
    case 'liquid':
      // Organic, flowing shape
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.8, y - radius * 0.3);
      ctx.bezierCurveTo(x - radius * 0.2, y - radius, x + radius * 0.2, y - radius, x + radius * 0.8, y - radius * 0.3);
      ctx.bezierCurveTo(x + radius, y + radius * 0.2, x + radius, y + radius * 0.8, x + radius * 0.3, y + radius * 0.8);
      ctx.bezierCurveTo(x - radius * 0.2, y + radius, x - radius * 0.8, y + radius * 0.2, x - radius * 0.8, y - radius * 0.3);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'horizontal':
      // Horizontal lines
      ctx.fillRect(x - radius, y - radius * 0.3, size, radius * 0.6);
      break;
      
    case 'vertical':
      // Vertical lines
      ctx.fillRect(x - radius * 0.3, y - radius, radius * 0.6, size);
      break;
      
    case 'small-square':
      // Smaller squares
      const smallSize = size * 0.6;
      const smallRadius = smallSize / 2;
      ctx.fillRect(x - smallRadius, y - smallRadius, smallSize, smallSize);
      break;
      
    case 'blob':
      // Irregular blob shape
      ctx.beginPath();
      ctx.moveTo(x, y - radius);
      ctx.bezierCurveTo(x + radius * 0.8, y - radius * 0.5, x + radius, y + radius * 0.3, x + radius * 0.4, y + radius);
      ctx.bezierCurveTo(x - radius * 0.2, y + radius * 0.8, x - radius * 0.9, y + radius * 0.1, x - radius * 0.6, y - radius * 0.4);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'pointed':
      // Diamond/pointed shape
      ctx.beginPath();
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x + radius, y);
      ctx.lineTo(x, y + radius);
      ctx.lineTo(x - radius, y);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'circle':
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.9, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    default: // classic
      // Standard square
      ctx.fillRect(x - radius, y - radius, size, size);
      break;
  }
  
  ctx.restore();
};

const applyBorderStyle = (ctx: CanvasRenderingContext2D, borderStyle: string, borderColor: string, size: number) => {
  ctx.save();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const margin = 15;
  const width = size - 2 * margin;
  const height = size - 2 * margin;
  const centerX = size / 2;
  const centerY = size / 2;
  
  switch (borderStyle) {
    case 'rounded-square':
      ctx.beginPath();
      ctx.roundRect(margin, margin, width, height, 20);
      ctx.stroke();
      break;
      
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) / 2, 0, 2 * Math.PI);
      ctx.stroke();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(centerX, margin);
      ctx.lineTo(size - margin, centerY);
      ctx.lineTo(centerX, size - margin);
      ctx.lineTo(margin, centerY);
      ctx.closePath();
      ctx.stroke();
      break;
      
    case 'leaf-left':
      ctx.beginPath();
      ctx.moveTo(margin, centerY);
      ctx.bezierCurveTo(margin, margin, centerX, margin, size - margin, centerY);
      ctx.bezierCurveTo(centerX, size - margin, margin, size - margin, margin, centerY);
      ctx.stroke();
      break;
      
    case 'leaf-right':
      ctx.beginPath();
      ctx.moveTo(size - margin, centerY);
      ctx.bezierCurveTo(size - margin, margin, centerX, margin, margin, centerY);
      ctx.bezierCurveTo(centerX, size - margin, size - margin, size - margin, size - margin, centerY);
      ctx.stroke();
      break;
      
    case 'dot-square':
      // Dashed square border
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(margin, margin, width, height);
      ctx.setLineDash([]);
      break;
      
    case 'rounded-bottom':
      ctx.beginPath();
      ctx.moveTo(margin, margin);
      ctx.lineTo(size - margin, margin);
      ctx.lineTo(size - margin, centerY);
      ctx.bezierCurveTo(size - margin, size - margin, centerX, size - margin, margin, centerY);
      ctx.lineTo(margin, margin);
      ctx.stroke();
      break;
      
    default: // square
      ctx.strokeRect(margin, margin, width, height);
      break;
  }
  
  ctx.restore();
};

const applyCenterStyle = (ctx: CanvasRenderingContext2D, centerStyle: string, centerColor: string, size: number) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const centerSize = size * 0.15;
  const radius = centerSize / 2;
  
  // Clear center area first
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw center style
  ctx.fillStyle = centerColor;
  
  switch (centerStyle) {
    case 'rounded-square':
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

const drawFrame = (ctx: CanvasRenderingContext2D, design: any, width: number, height: number) => {
  ctx.save();
  ctx.fillStyle = design.frameColor || '#000000';
  ctx.strokeStyle = design.frameColor || '#000000';
  ctx.font = `bold 16px ${design.frameFont || 'Arial'}`;
  ctx.textAlign = 'center';
  
  switch (design.frame) {
    case 'basic':
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, width - 16, height - 16);
      break;
      
    case 'rounded':
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(12, 12, width - 24, height - 24, 25);
      ctx.stroke();
      break;
      
    case 'banner':
      // Top banner
      ctx.fillRect(0, 0, width, 40);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(design.frameText || 'SCAN ME', width/2, 25);
      break;
      
    case 'badge':
      // Badge-like frame with rounded corners
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(10, 10, width - 20, height - 20, 15);
      ctx.stroke();
      break;
  }
  
  // Add frame text if not banner and text exists
  if (design.frame !== 'banner' && design.frameText) {
    ctx.fillStyle = design.frameColor || '#000000';
    ctx.fillText(design.frameText, width/2, height - 15);
  }
  
  ctx.restore();
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
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${logoSize * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const logoEmojis: { [key: string]: string } = {
    link: '🔗',
    location: '📍',
    email: '✉️',
    whatsapp: '💬',
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

const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  const petalCount = 6;
  const petalRadius = radius * 0.6;
  
  ctx.save();
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 2 * Math.PI) / petalCount;
    const petalX = x + Math.cos(angle) * radius * 0.4;
    const petalY = y + Math.sin(angle) * radius * 0.4;
    
    ctx.beginPath();
    ctx.arc(petalX, petalY, petalRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Center circle
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.3, 0, 2 * Math.PI);
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

const drawCustomShapeQR = async (
  ctx: CanvasRenderingContext2D,
  qrImage: Image,
  qrX: number,
  qrY: number,
  size: number,
  shape: string,
  darkColor: string,
  borderStyle: string | undefined,
  borderColor: string | undefined,
  centerStyle: string | undefined,
  centerColor: string | undefined
): Promise<void> => {
  const shapeSize = size * 0.8;
  const shapeX = qrX + (size - shapeSize) / 2;
  const shapeY = qrY + (size - shapeSize) / 2;
  
  ctx.save();
  
  // Apply gradient fill if enabled
  if (darkColor) {
    const grad = ctx.createLinearGradient(shapeX, shapeY, shapeX + shapeSize, shapeY + shapeSize);
    grad.addColorStop(0, darkColor);
    grad.addColorStop(1, adjustColorBrightness(darkColor, -20));
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = 'transparent';
  }
  ctx.fillRect(shapeX, shapeY, shapeSize, shapeSize);
  
  // Draw border if specified
  if (borderStyle && borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.roundRect(shapeX, shapeY, shapeSize, shapeSize, 20);
    ctx.stroke();
  }
  
  // Draw center style
  if (centerStyle && centerColor) {
    ctx.fillStyle = centerColor;
    ctx.beginPath();
    ctx.arc(shapeX + shapeSize / 2, shapeY + shapeSize / 2, shapeSize * 0.3, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Draw QR code
  ctx.drawImage(qrImage, shapeX, shapeY, shapeSize, shapeSize);
  
  ctx.restore();
};

const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
  ctx.lineTo(x + radius, y + height);
  ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + radius);
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
  ctx.closePath();
};

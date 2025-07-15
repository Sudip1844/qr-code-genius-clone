export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  route: string;
  qrType: string;
}

export const seoConfigs: Record<string, SEOConfig> = {
  url: {
    title: "Create QR Code for Any Website URL – Instant & Free",
    description: "Convert any website or landing page URL into a QR code. Just paste your link and get a scannable code to share anywhere.",
    keywords: ["url to qr code", "website qr code", "link qr generator", "free qr code"],
    route: "/url-to-qr",
    qrType: "url"
  },
  email: {
    title: "Generate QR Code for Email with Subject and Message",
    description: "Make QR codes that launch email apps with your preset subject and body. Perfect for contact forms, support, and business replies.",
    keywords: ["email qr code", "mailto qr generator", "email qr code generator"],
    route: "/email-to-qr",
    qrType: "email"
  },
  text: {
    title: "Text to QR Code – Share Notes, Info or Secret Messages",
    description: "Convert plain text into QR codes easily. Ideal for simple notes, messages, codes, or instructions to scan.",
    keywords: ["text to qr code", "text qr generator", "message qr code"],
    route: "/text-to-qr",
    qrType: "text"
  },
  phone: {
    title: "Phone Call QR Code Generator – Tap to Call Instantly",
    description: "Generate QR codes that let users call your number with one tap. Perfect for business cards, ads, and quick contact.",
    keywords: ["phone qr code", "call qr generator", "phone number qr"],
    route: "/phone-to-qr",
    qrType: "phone"
  },
  sms: {
    title: "SMS QR Code Generator – Send Prewritten Text Instantly",
    description: "Make QR codes that open the user's SMS app with your message preloaded. Great for campaigns, offers, and signups.",
    keywords: ["sms qr code", "text message qr", "sms qr generator"],
    route: "/sms-to-qr",
    qrType: "sms"
  },
  whatsapp: {
    title: "WhatsApp QR Code Generator – Start Chat in One Tap",
    description: "Instantly launch WhatsApp chats with a custom message using QR codes. Useful for business inquiries and support.",
    keywords: ["whatsapp qr code", "whatsapp qr generator", "wa.me qr"],
    route: "/whatsapp-to-qr",
    qrType: "whatsapp"
  },
  wifi: {
    title: "WiFi QR Code Generator – Easy Access Without Typing",
    description: "Share WiFi credentials securely with a QR code. No need to type passwords, just scan and connect instantly.",
    keywords: ["wifi qr code", "wifi password qr", "wifi qr generator"],
    route: "/wifi-to-qr",
    qrType: "wifi"
  },
  vcard: {
    title: "Contact QR Code Generator – Share Phone & Email Instantly",
    description: "Create QR codes to share your full contact info: name, phone, email, company, etc. Great for business cards.",
    keywords: ["contact qr code", "vcard qr generator", "business card qr"],
    route: "/contact-to-qr",
    qrType: "vcard"
  },
  event: {
    title: "Calendar Event QR Code – Add Events Instantly",
    description: "Generate QR codes that add an event to users' calendars. Ideal for meetings, appointments, or event invites.",
    keywords: ["calendar qr code", "event qr generator", "ics qr code"],
    route: "/event-to-qr",
    qrType: "event"
  },
  image: {
    title: "Image to QR Code Generator – Embed Pictures in QR",
    description: "Turn images into QR codes either by link or base64. Scan to view the picture directly. Perfect for posters, flyers & galleries.",
    keywords: ["image to qr code", "picture qr generator", "photo qr code"],
    route: "/image-to-qr",
    qrType: "image"
  }
};

export const getDefaultSEO = (): SEOConfig => ({
  title: "Free QR Code Generator – Create QR Codes for Any Content",
  description: "Generate QR codes for URLs, emails, text, phone numbers, WiFi, contacts, events, and images. Fast, free, and easy to use QR code generator.",
  keywords: ["qr code generator", "free qr code", "qr generator", "create qr code"],
  route: "/",
  qrType: ""
});

export const getSEOByRoute = (route: string): SEOConfig => {
  const config = Object.values(seoConfigs).find(config => config.route === route);
  return config || getDefaultSEO();
};

export const getSEOByQRType = (qrType: string): SEOConfig => {
  return seoConfigs[qrType] || getDefaultSEO();
};

export const updatePageSEO = (config: SEOConfig) => {
  document.title = config.title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', config.description);
  
  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', config.keywords.join(', '));
  
  // Update Open Graph tags
  updateOGTag('og:title', config.title);
  updateOGTag('og:description', config.description);
  updateOGTag('og:type', 'website');
  updateOGTag('og:url', window.location.href);
};

const updateOGTag = (property: string, content: string) => {
  let ogTag = document.querySelector(`meta[property="${property}"]`);
  if (!ogTag) {
    ogTag = document.createElement('meta');
    ogTag.setAttribute('property', property);
    document.head.appendChild(ogTag);
  }
  ogTag.setAttribute('content', content);
};

export const generateSiteLinks = (currentType?: string) => {
  return Object.values(seoConfigs)
    .filter(config => config.qrType !== currentType)
    .slice(0, 8) // Show first 8 as site links
    .map(config => ({
      title: config.qrType.charAt(0).toUpperCase() + config.qrType.slice(1) + ' QR',
      url: config.route,
      description: config.description.substring(0, 80) + '...'
    }));
};
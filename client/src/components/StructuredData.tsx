import { useEffect } from 'react';
import { getSEOByQRType, seoConfigs } from '@/lib/seo-config';

interface StructuredDataProps {
  qrType?: string;
}

const StructuredData = ({ qrType }: StructuredDataProps) => {
  useEffect(() => {
    const seoConfig = qrType ? getSEOByQRType(qrType) : null;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": seoConfig ? seoConfig.title : "QR Code Generator - Free Online Tool",
      "description": seoConfig ? seoConfig.description : "Generate QR codes for URLs, emails, text, phone numbers, WiFi, contacts, events, and images. Fast, free, and easy to use.",
      "url": window.location.href,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "QR.io"
      },
      "potentialAction": [
        {
          "@type": "CreateAction",
          "object": {
            "@type": "QRCode",
            "name": seoConfig ? `${seoConfig.qrType.toUpperCase()} QR Code` : "QR Code"
          }
        }
      ],
      "mainEntity": Object.values(seoConfigs).map(config => ({
        "@type": "SoftwareApplication",
        "name": config.title,
        "description": config.description,
        "url": window.location.origin + config.route,
        "applicationCategory": "QRCodeGenerator",
        "keywords": config.keywords.join(", ")
      }))
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const script = document.querySelector('script[type="application/ld+json"]');
      if (script) {
        script.remove();
      }
    };
  }, [qrType]);

  return null;
};

export default StructuredData;
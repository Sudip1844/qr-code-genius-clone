import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { generateQRCode, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR, createSMSQR, createWhatsAppQR, createWiFiQR, createVCardQR, createEventQR, createImageQR } from '@/lib/qr-service';
import { Download, Share2, Copy, Check, Loader2, ChevronDown, Link, QrCode } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from 'sonner';

const QRGenerator = () => {
  // Content type and data
  const [contentType, setContentType] = useState('url');
  const [qrData, setQrData] = useState('');
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [copied, setCopied] = useState(false);
  
  // Email specific fields
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // SMS specific fields
  const [smsMessage, setSmsMessage] = useState('');
  
  // WhatsApp specific fields
  const [whatsappMessage, setWhatsappMessage] = useState('');
  
  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  
  // vCard specific fields
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  
  // Event specific fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  
  // Image specific fields
  const [imageData, setImageData] = useState<string | null>(null);

  // Design options state
  const [selectedLogo, setSelectedLogo] = useState('none');
  const [logoSize, setLogoSize] = useState(15);
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [gradient, setGradient] = useState(false);
  
  // Basic QR options
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(4);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Logo options with social media
  const logoOptions = [
    { value: 'none', label: 'None', preview: '❌' },
    { value: 'link', label: 'Link', preview: '🔗' },
    { value: 'location', label: 'Location', preview: '📍' },
    { value: 'email', label: 'Email', preview: '✉️' },
    { value: 'phone', label: 'Phone', preview: '📞' },
    { value: 'whatsapp', label: 'WhatsApp', preview: '💬' },
    { value: 'facebook', label: 'Facebook', preview: '📘' },
    { value: 'instagram', label: 'Instagram', preview: '📷' },
    { value: 'twitter', label: 'Twitter', preview: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', preview: '💼' },
    { value: 'youtube', label: 'YouTube', preview: '📺' },
    { value: 'wifi', label: 'WiFi', preview: '📶' },
    { value: 'vcard', label: 'Contact', preview: '👤' }
  ];
  
  // Content type options
  const contentTypes = [
    { value: 'url', label: 'Link', icon: '🔗' },
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'phone', label: 'Phone', icon: '📞' },
    { value: 'sms', label: 'SMS', icon: '💬' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '📱' },
    { value: 'wifi', label: 'WiFi', icon: '📶' },
    { value: 'vcard', label: 'Contact', icon: '👤' },
    { value: 'event', label: 'Event', icon: '📅' },
    { value: 'image', label: 'Image', icon: '🖼️' }
  ];
  
  // Reset form when content type changes
  useEffect(() => {
    setQrData('');
    setEmailSubject('');
    setEmailBody('');
    setSmsMessage('');
    setWhatsappMessage('');
    setWifiSSID('');
    setWifiPassword('');
    setVcardName('');
    setVcardPhone('');
    setVcardEmail('');
    setVcardOrg('');
    setEventTitle('');
    setEventLocation('');
    setEventStart('');
    setEventEnd('');
    setImageData(null);
    setQrResult(null); // Reset QR result when content type changes
  }, [contentType]);

  // Reset QR result when design options change
  useEffect(() => {
    setQrResult(null);
  }, [selectedLogo, logoSize, logoOpacity, gradient, size, margin, darkColor, lightColor, errorCorrectionLevel]);

  // Reset QR result when any input data changes
  useEffect(() => {
    setQrResult(null);
  }, [qrData, emailSubject, emailBody, smsMessage, whatsappMessage, wifiSSID, wifiPassword, wifiSecurity, vcardName, vcardPhone, vcardEmail, vcardOrg, eventTitle, eventLocation, eventStart, eventEnd, imageData]);

  // Listen for QR type selection events from quick links
  useEffect(() => {
    const handleQRTypeSelect = (event: CustomEvent) => {
      const { type } = event.detail;
      setContentType(type);
      // Reset QR result when type changes
      setQrResult(null);
      // Reset form data
      setQrData('');
      setEmailSubject('');
      setEmailBody('');
      setSmsMessage('');
      setWhatsappMessage('');
      setWifiSSID('');
      setWifiPassword('');
      setVcardName('');
      setVcardPhone('');
      setVcardEmail('');
      setVcardOrg('');
      setEventTitle('');
      setEventLocation('');
      setEventStart('');
      setEventEnd('');
      setImageData(null);
    };

    window.addEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    return () => {
      window.removeEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    };
  }, []);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const generateData = () => {
    switch (contentType) {
      case 'url':
        return createUrlQR(qrData);
      case 'email':
        return createEmailQR(qrData, emailSubject, emailBody);
      case 'phone':
        return createPhoneQR(qrData);
      case 'text':
        return createTextQR(qrData);
      case 'sms':
        return createSMSQR(qrData, smsMessage);
      case 'whatsapp':
        return createWhatsAppQR(qrData, whatsappMessage);
      case 'wifi':
        return createWiFiQR(wifiSSID, wifiPassword, wifiSecurity);
      case 'vcard':
        return createVCardQR(vcardName, vcardPhone, vcardEmail, vcardOrg);
      case 'event':
        return createEventQR(eventTitle, eventLocation, eventStart, eventEnd);
      case 'image':
        return createImageQR(imageData || '');
      default:
        return qrData;
    }
  };

  const generateQR = async () => {
    // Validation based on content type
    if (contentType === 'url' && !qrData) {
      toast.error('Please enter a URL');
      return;
    }
    if (contentType === 'text' && !qrData) {
      toast.error('Please enter text content');
      return;
    }
    if (contentType === 'email' && !qrData) {
      toast.error('Please enter an email address');
      return;
    }
    if (contentType === 'phone' && !qrData) {
      toast.error('Please enter a phone number');
      return;
    }
    if (contentType === 'sms' && !qrData) {
      toast.error('Please enter a phone number');
      return;
    }
    if (contentType === 'whatsapp' && !qrData) {
      toast.error('Please enter a WhatsApp number');
      return;
    }
    if (contentType === 'wifi' && !wifiSSID) {
      toast.error('Please enter WiFi network name (SSID)');
      return;
    }
    if (contentType === 'vcard' && !vcardName) {
      toast.error('Please enter a name for the contact');
      return;
    }
    if (contentType === 'event' && !eventTitle) {
      toast.error('Please enter an event title');
      return;
    }
    if (contentType === 'image' && !imageData) {
      toast.error('Please provide an image URL or upload an image');
      return;
    }

    setIsGenerating(true);
    try {
      const data = generateData();
      const options: QROptions = {
        data,
        size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel,
        design: {
          logo: selectedLogo,
          logoSize,
          logoOpacity,
          gradient
        }
      };

      const qrDataUrl = await generateQRCode(options);
      setQrResult(qrDataUrl);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrResult) return;
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrResult;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  const copyQR = async () => {
    if (!qrResult) return;
    
    try {
      const blob = await fetch(qrResult).then(r => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      toast.success('QR code copied to clipboard!');
    } catch (err) {
      console.error('Error copying:', err);
      toast.error('Failed to copy QR code');
    }
  };

  const shareQR = async () => {
    if (!qrResult) return;
    
    try {
      const blob = await fetch(qrResult).then(r => r.blob());
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'QR Code',
          files: [file]
        });
        toast.success('QR code shared successfully!');
      } else {
        toast.error('Web Share API not supported on this browser');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Failed to share QR code');
    }
  };

  const getSelectedContentType = () => {
    return contentTypes.find(type => type.value === contentType);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Create customized QR codes for various content types</p>
      </div>
      
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* QR Preview Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">QR Code Preview</h3>
              {qrResult ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex justify-center">
                    <img 
                      src={qrResult} 
                      alt="Generated QR Code" 
                      className="w-64 h-64 border rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Your QR code will appear here</p>
                  <div className="flex justify-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={downloadQR}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download QR Code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={copyQR}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy to Clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {navigator.share && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={shareQR}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share QR Code</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex justify-center items-center h-64 w-64 border-2 border-dashed rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <QrCode className="h-16 w-16 mx-auto mb-2" />
                      <p>Your QR code will appear here</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Configuration Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuration</h3>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="content" className="text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-full text-sm font-medium mr-2">1</span>
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="design" className="text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-400 text-white rounded-full text-sm font-medium mr-2">2</span>
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="logo" className="text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-400 text-white rounded-full text-sm font-medium mr-2">3</span>
                    Logo
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-6">
                  {/* Content Type Selector */}
                  <div className="space-y-2">
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger className="w-full h-16 bg-emerald-50 border-emerald-200">
                        <div className="flex items-center gap-3">
                          <Link className="h-6 w-6 text-emerald-600" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-emerald-700">{getSelectedContentType()?.label}</div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-emerald-600" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{type.icon}</span>
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Content Input Fields */}
                  <div className="space-y-4">
                    {contentType === 'url' && (
                      <div className="space-y-2">
                        <Label htmlFor="url" className="text-slate-700 font-medium">Enter your Website</Label>
                        <Input
                          id="url"
                          placeholder="https://"
                          value={qrData}
                          onChange={(e) => setQrData(e.target.value)}
                          className="h-12"
                        />
                      </div>
                    )}
                    
                    {contentType === 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor="text" className="text-slate-700 font-medium">Text Content</Label>
                        <Textarea
                          id="text"
                          placeholder="Enter your text here"
                          value={qrData}
                          onChange={(e) => setQrData(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    )}

                    {contentType === 'email' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                          <Input
                            id="email"
                            placeholder="example@email.com"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailSubject" className="text-slate-700 font-medium">Subject (Optional)</Label>
                          <Input
                            id="emailSubject"
                            placeholder="Email subject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailBody" className="text-slate-700 font-medium">Message (Optional)</Label>
                          <Textarea
                            id="emailBody"
                            placeholder="Email message"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}

                    {contentType === 'phone' && (
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+880123456789"
                          value={qrData}
                          onChange={(e) => setQrData(e.target.value)}
                          className="h-12"
                        />
                      </div>
                    )}

                    {contentType === 'sms' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="smsPhone" className="text-slate-700 font-medium">Phone Number</Label>
                          <Input
                            id="smsPhone"
                            placeholder="+880123456789"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smsMessage" className="text-slate-700 font-medium">SMS Message (Optional)</Label>
                          <Textarea
                            id="smsMessage"
                            placeholder="Your SMS message"
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}

                    {contentType === 'whatsapp' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="whatsappPhone" className="text-slate-700 font-medium">WhatsApp Number</Label>
                          <Input
                            id="whatsappPhone"
                            placeholder="+880123456789"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="whatsappMessage" className="text-slate-700 font-medium">Pre-filled Message (Optional)</Label>
                          <Textarea
                            id="whatsappMessage"
                            placeholder="Hello! I'm interested in..."
                            value={whatsappMessage}
                            onChange={(e) => setWhatsappMessage(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}

                    {contentType === 'wifi' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wifiSSID" className="text-slate-700 font-medium">Network Name (SSID)</Label>
                          <Input
                            id="wifiSSID"
                            placeholder="MyWiFiNetwork"
                            value={wifiSSID}
                            onChange={(e) => setWifiSSID(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wifiPassword" className="text-slate-700 font-medium">Password</Label>
                          <Input
                            id="wifiPassword"
                            type="password"
                            placeholder="WiFi password"
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Security Type</Label>
                          <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WPA">WPA/WPA2</SelectItem>
                              <SelectItem value="WEP">WEP</SelectItem>
                              <SelectItem value="nopass">No Password</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {contentType === 'vcard' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="vcardName" className="text-slate-700 font-medium">Full Name</Label>
                          <Input
                            id="vcardName"
                            placeholder="John Doe"
                            value={vcardName}
                            onChange={(e) => setVcardName(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardPhone" className="text-slate-700 font-medium">Phone Number (Optional)</Label>
                          <Input
                            id="vcardPhone"
                            placeholder="+880123456789"
                            value={vcardPhone}
                            onChange={(e) => setVcardPhone(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardEmail" className="text-slate-700 font-medium">Email (Optional)</Label>
                          <Input
                            id="vcardEmail"
                            placeholder="john@example.com"
                            value={vcardEmail}
                            onChange={(e) => setVcardEmail(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardOrg" className="text-slate-700 font-medium">Organization (Optional)</Label>
                          <Input
                            id="vcardOrg"
                            placeholder="Company Name"
                            value={vcardOrg}
                            onChange={(e) => setVcardOrg(e.target.value)}
                            className="h-12"
                          />
                        </div>
                      </div>
                    )}

                    {contentType === 'event' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="eventTitle" className="text-slate-700 font-medium">Event Title</Label>
                          <Input
                            id="eventTitle"
                            placeholder="Meeting Title"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventLocation" className="text-slate-700 font-medium">Location (Optional)</Label>
                          <Input
                            id="eventLocation"
                            placeholder="Conference Room A"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="eventStart" className="text-slate-700 font-medium">Start Date & Time</Label>
                            <Input
                              id="eventStart"
                              type="datetime-local"
                              value={eventStart}
                              onChange={(e) => setEventStart(e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventEnd" className="text-slate-700 font-medium">End Date & Time</Label>
                            <Input
                              id="eventEnd"
                              type="datetime-local"
                              value={eventEnd}
                              onChange={(e) => setEventEnd(e.target.value)}
                              className="h-12"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {contentType === 'image' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Image URL</Label>
                          <Input
                            placeholder="https://example.com/image.jpg or paste Drive/hosting link"
                            value={imageData || ''}
                            onChange={(e) => setImageData(e.target.value)}
                            className="h-12"
                          />
                          <p className="text-sm text-gray-500">
                            Upload your image to Google Drive, Imgur, or any image hosting service and paste the direct link here.
                          </p>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setImageData(e.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Or select an image file from your device (will be converted to data URL)
                          </p>
                        </div>
                        {imageData && (
                          <div className="mt-4">
                            <img 
                              src={imageData} 
                              alt="Preview" 
                              className="max-w-full h-32 object-contain border rounded"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Size (px)</Label>
                        <Slider
                          value={[size]}
                          onValueChange={(value) => setSize(value[0])}
                          max={500}
                          min={200}
                          step={50}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500">{size}px</div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Margin</Label>
                        <Slider
                          value={[margin]}
                          onValueChange={(value) => setMargin(value[0])}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500">{margin}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Foreground Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={darkColor}
                            onChange={(e) => setDarkColor(e.target.value)}
                            className="w-12 h-8 rounded border"
                          />
                          <Input
                            value={darkColor}
                            onChange={(e) => setDarkColor(e.target.value)}
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Background Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={lightColor}
                            onChange={(e) => setLightColor(e.target.value)}
                            className="w-12 h-8 rounded border"
                          />
                          <Input
                            value={lightColor}
                            onChange={(e) => setLightColor(e.target.value)}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Error Correction Level</Label>
                      <Select value={errorCorrectionLevel} onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorCorrectionLevel(value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="gradient"
                        checked={gradient}
                        onCheckedChange={setGradient}
                      />
                      <Label htmlFor="gradient" className="text-slate-700 font-medium">Enable gradient effects</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logo" className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Logo Type</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {logoOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={selectedLogo === option.value ? "default" : "outline"}
                            className="h-16 flex flex-col items-center justify-center"
                            onClick={() => setSelectedLogo(option.value)}
                          >
                            <span className="text-lg mb-1">{option.preview}</span>
                            <span className="text-xs">{option.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedLogo !== 'none' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Logo Size (%)</Label>
                          <Slider
                            value={[logoSize]}
                            onValueChange={(value) => setLogoSize(value[0])}
                            max={30}
                            min={10}
                            step={5}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-500">{logoSize}%</div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Logo Opacity (%)</Label>
                          <Slider
                            value={[logoOpacity]}
                            onValueChange={(value) => setLogoOpacity(value[0])}
                            max={100}
                            min={20}
                            step={10}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-500">{logoOpacity}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Generate Button - Always visible */}
              <div className="mt-6">
                {!qrResult ? (
                  <Button 
                    className="w-full h-14 text-lg font-medium" 
                    size="lg" 
                    onClick={generateQR}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <QrCode className="mr-2 h-5 w-5" />
                        Generate QR Code
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    className="w-full h-14 text-lg font-medium" 
                    size="lg" 
                    onClick={downloadQR}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download QR Code
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRGenerator;
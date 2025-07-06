import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { generateQRCode, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR, createSMSQR, createWhatsAppQR, createWiFiQR, createVCardQR, createEventQR, createImageQR } from '@/lib/qr-service';
import { Download, Share2, Copy, Check, Loader2, ChevronDown, Link } from 'lucide-react';
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
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(15);
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [logoPosition, setLogoPosition] = useState('center');
  const [logoShape, setLogoShape] = useState('square');
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
    { value: 'vcard', label: 'Contact', preview: '👤' },
    { value: 'custom', label: 'Custom', preview: '📎' }
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
  }, [contentType]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const generateQR = async () => {
    try {
      setIsGenerating(true);
      
      // Validate input based on content type
      if (!validateInput()) {
        toast.error('Please fill in all required fields');
        setIsGenerating(false);
        return;
      }
      
      // Format data based on content type
      const finalData = formatData();
      
      const options: QROptions = {
        data: finalData,
        size,
        margin,
        color: { dark: darkColor, light: lightColor },
        errorCorrectionLevel,
        design: {
          logo: selectedLogo !== 'custom' ? selectedLogo : undefined,
          customLogo: customLogo || undefined,
          logoSize,
          logoOpacity,
          logoPosition,
          logoShape,
          gradient
        }
      };
      
      const result = await generateQRCode(options);
      setQrResult(result);
      
      // Switch to the QR tab after generation
      setActiveTab('content');
      
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const validateInput = (): boolean => {
    switch (contentType) {
      case 'url':
        return qrData.trim() !== '';
      case 'email':
        return qrData.trim() !== '' && qrData.includes('@');
      case 'phone':
        return qrData.trim() !== '';
      case 'sms':
        return qrData.trim() !== '';
      case 'whatsapp':
        return qrData.trim() !== '';
      case 'wifi':
        return wifiSSID.trim() !== '';
      case 'vcard':
        return vcardName.trim() !== '';
      case 'event':
        return eventTitle.trim() !== '';
      case 'image':
        return !!imageData;
      default:
        return qrData.trim() !== '';
    }
  };
  
  const formatData = (): string => {
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
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageData(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const downloadQR = () => {
    if (!qrResult) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${new Date().getTime()}.png`;
    link.href = qrResult;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR code downloaded successfully!');
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
      console.error('Failed to copy:', err);
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Create customized QR codes for various content types</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          {qrResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Your QR Code</CardTitle>
                <CardDescription>
                  Scan with any QR code reader
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="relative">
                  <img 
                    src={qrResult} 
                    alt="Generated QR Code" 
                    className="max-w-full h-auto border rounded-lg shadow-sm"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-2">
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
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Preview QR Code</CardTitle>
                <CardDescription>
                  Your QR code will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-[300px]">
                <div className="text-center text-muted-foreground">
                  <div className="border-2 border-dashed rounded-lg p-12 mb-4">
                    QR Code Preview
                  </div>
                  <p>Fill in the details and click Generate</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="w-full md:w-1/2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
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
              <Card>
                <CardContent className="p-6 space-y-6">
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
                          rows={4}
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
                            type="email"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-slate-700 font-medium">Subject (Optional)</Label>
                          <Input
                            id="subject"
                            placeholder="Email subject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="body" className="text-slate-700 font-medium">Body (Optional)</Label>
                          <Textarea
                            id="body"
                            placeholder="Email body"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                    
                    {contentType === 'phone' && (
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1234567890"
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
                            placeholder="+1234567890"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smsMessage" className="text-slate-700 font-medium">Message (Optional)</Label>
                          <Textarea
                            id="smsMessage"
                            placeholder="Your SMS message"
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                    
                    {contentType === 'whatsapp' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="whatsappPhone" className="text-slate-700 font-medium">Phone Number (without +)</Label>
                          <Input
                            id="whatsappPhone"
                            placeholder="1234567890"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="whatsappMessage" className="text-slate-700 font-medium">Message (Optional)</Label>
                          <Textarea
                            id="whatsappMessage"
                            placeholder="Your WhatsApp message"
                            value={whatsappMessage}
                            onChange={(e) => setWhatsappMessage(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                    
                    {contentType === 'wifi' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ssid" className="text-slate-700 font-medium">Network Name (SSID)</Label>
                          <Input
                            id="ssid"
                            placeholder="WiFi Network Name"
                            value={wifiSSID}
                            onChange={(e) => setWifiSSID(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="WiFi Password"
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="security" className="text-slate-700 font-medium">Security Type</Label>
                          <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                            <SelectTrigger id="security" className="h-12">
                              <SelectValue placeholder="Select security type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
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
                          <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={vcardName}
                            onChange={(e) => setVcardName(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardPhone" className="text-slate-700 font-medium">Phone Number</Label>
                          <Input
                            id="vcardPhone"
                            placeholder="+1234567890"
                            value={vcardPhone}
                            onChange={(e) => setVcardPhone(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardEmail" className="text-slate-700 font-medium">Email</Label>
                          <Input
                            id="vcardEmail"
                            placeholder="john@example.com"
                            value={vcardEmail}
                            onChange={(e) => setVcardEmail(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization" className="text-slate-700 font-medium">Organization</Label>
                          <Input
                            id="organization"
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
                          <Label htmlFor="title" className="text-slate-700 font-medium">Event Title</Label>
                          <Input
                            id="title"
                            placeholder="Meeting Title"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-slate-700 font-medium">Location (Optional)</Label>
                          <Input
                            id="location"
                            placeholder="Event Location"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start" className="text-slate-700 font-medium">Start Date & Time</Label>
                            <Input
                              id="start"
                              type="datetime-local"
                              value={eventStart}
                              onChange={(e) => setEventStart(e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end" className="text-slate-700 font-medium">End Date & Time</Label>
                            <Input
                              id="end"
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
                          <Label htmlFor="image" className="text-slate-700 font-medium">Upload Image</Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 h-12"
                          />
                        </div>
                        {imageData && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                            <img 
                              src={imageData} 
                              alt="Image preview" 
                              className="max-h-32 max-w-full object-contain rounded border"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Note: Images will be compressed to fit in QR code
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Basic Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Size</Label>
                      <Slider
                        value={[size]}
                        onValueChange={(value) => setSize(value[0])}
                        max={600}
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
                        max={8}
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logo" className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
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

                  {selectedLogo === 'custom' && (
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Upload Custom Logo</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 h-12"
                      />
                      {customLogo && (
                        <div className="mt-2">
                          <img src={customLogo} alt="Custom logo preview" className="w-16 h-16 object-contain rounded border" />
                        </div>
                      )}
                    </div>
                  )}

                  {selectedLogo !== 'none' && (
                    <>
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Logo Position</Label>
                          <Select value={logoPosition} onValueChange={setLogoPosition}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="top-left">Top Left</SelectItem>
                              <SelectItem value="top-right">Top Right</SelectItem>
                              <SelectItem value="bottom-left">Bottom Left</SelectItem>
                              <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Logo Shape</Label>
                          <Select value={logoShape} onValueChange={setLogoShape}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="circle">Circle</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
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
                  <Download className="mr-2 h-5 w-5" />
                  Download QR Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Download, Upload, X } from "lucide-react";
import { generateQRCode, downloadQRCode } from "@/lib/qr-service";
import { QRCodeType, QRCodeData } from "@/types/qr-types";
import { useToast } from "@/hooks/use-toast";

const qrTypes = [
  {
    id: 'url',
    label: 'Website URL',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    fields: [
      { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com', required: true },
    ],
  },
  {
    id: 'email',
    label: 'Email',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="22" height="16" x="1" y="4" rx="2" ry="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>,
    fields: [
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: true },
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Subject of the email' },
      { name: 'body', label: 'Message', type: 'textarea', placeholder: 'Your message here' },
    ],
  },
  {
    id: 'text',
    label: 'Text',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-text"><path d="M3 3h18v18"></path><line x1="8" x2="16" y1="8" y2="8"></line><line x1="6" x2="18" y1="16" y2="16"></line></svg>,
    fields: [
      { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter your text here', required: true },
    ],
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.81 11a2 2 0 0 1-.44 2.12 12.98 12.98 0 0 0 5.74 5.74 2 2 0 0 1 2.12-.44l2.12.45a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
    fields: [
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', required: true },
    ],
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    fields: [
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', required: true },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your message here' },
    ],
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    fields: [
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', required: true },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your message here' },
    ],
  },
  {
    id: 'wifi',
    label: 'WiFi',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi"><path d="M5 12.55a11 11 0 0 1 14 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" x2="12" y1="20" y2="20"></line></svg>,
    fields: [
      { name: 'ssid', label: 'Network Name (SSID)', type: 'text', placeholder: 'Enter SSID', required: true },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
      {
        name: 'encryption',
        label: 'Encryption',
        type: 'select',
        placeholder: 'Choose encryption',
        options: [
          { value: 'WPA', label: 'WPA/WPA2' },
          { value: 'WEP', label: 'WEP' },
          { value: 'none', label: 'No Encryption' },
        ],
      },
    ],
  },
  {
    id: 'vcard',
    label: 'VCard',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-square"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><path d="M16 7a4 4 0 1 0-8 0a4 4 0 0 0 8 0z"></path><path d="M4 18v-1a6 6 0 0 1 12 0v1"></path></svg>,
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number' },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address' },
      { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Organization' },
      { name: 'title', label: 'Title', type: 'text', placeholder: 'Title' },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'Website' },
      { name: 'address', label: 'Address', type: 'text', placeholder: 'Address' },
    ],
  },
  {
    id: 'event',
    label: 'Event',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>,
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', placeholder: 'Event Name', required: true },
      { name: 'startDate', label: 'Start Date', type: 'text', placeholder: 'Start Date', required: true },
      { name: 'endDate', label: 'End Date', type: 'text', placeholder: 'End Date' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'Location' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description' },
    ],
  },
];

const logos = [
  { id: 'facebook', name: 'Facebook', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png' },
  { id: 'instagram', name: 'Instagram', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1920px-Instagram_logo_2022.svg.png' },
  { id: 'twitter', name: 'Twitter', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png' },
  { id: 'linkedin', name: 'LinkedIn', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/768px-LinkedIn_logo_initials.png' },
  { id: 'youtube', name: 'YouTube', src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png' },
  { id: 'whatsapp', name: 'WhatsApp', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png' },
  { id: 'telegram', name: 'Telegram', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Telegram_Messenger.png/640px-Telegram_Messenger.png' },
  { id: 'wechat', name: 'WeChat', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/WeChat_logo.svg/1194px-WeChat_logo.svg.png' },
];

const frames = [
  { id: 'frame1', color: '#4285F4', style: 'solid' },
  { id: 'frame2', color: '#DB4437', style: 'dashed' },
  { id: 'frame3', color: '#F4B400', style: 'dotted' },
  { id: 'frame4', color: '#0F9D58', style: 'double' },
];

const shapes = [
  { id: 'shape1', style: 'square' },
  { id: 'shape2', style: 'rounded' },
  { id: 'shape3', style: 'semi-rounded' },
  // { id: 'shape4', style: 'circle' },
];

const QRGenerator = () => {
  const [qrType, setQrType] = useState<string>('url');
  const [qrData, setQrData] = useState<QRCodeData>({ url: '' });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('content');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedFrame, setSelectedFrame] = useState<string>('frame1');
  const [selectedShape, setSelectedShape] = useState<string>('square');
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [foregroundColor, setForegroundColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<string>('H');
  const [size, setSize] = useState<number>(500);
  const [margin, setMargin] = useState<number>(4);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      const data = await generateQRCode(qrType, qrData, {
        logo: selectedLogo ? logos.find(logo => logo.id === selectedLogo)?.src : customLogo,
        frameColor: frames.find(frame => frame.id === selectedFrame)?.color,
        shape: shapes.find(shape => shape.id === selectedShape)?.style,
        foregroundColor,
        backgroundColor,
        errorCorrectionLevel,
        size,
        margin,
      });
      setQrCodeUrl(data);
    } catch (error) {
      console.error("QR code generation error:", error);
      toast({
        title: "Error generating QR code",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (qrCodeUrl) {
      try {
        await downloadQRCode(qrCodeUrl);
      } catch (error) {
        console.error("QR code download error:", error);
        toast({
          title: "Error downloading QR code",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
        setSelectedLogo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCustomLogo(null);
  };

  const currentType = qrTypes.find(type => type.id === qrType);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Preview QR Code</h2>
        
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* QR Type Selector */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-4 h-auto text-left"
              >
                <div className="flex items-center gap-3">
                  <currentType.icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{currentType.label}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border rounded-lg shadow-lg">
                  {qrTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setQrType(type.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <type.icon className="h-5 w-5 text-gray-600" />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Form Fields */}
            <div className="space-y-4 px-4">
              {currentType.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder}
                      value={qrData[field.name as keyof QRCodeData] || ''}
                      onChange={(e) => setQrData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="resize-none"
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      value={qrData[field.name as keyof QRCodeData] as string || ''}
                      onValueChange={(value) => setQrData(prev => ({ ...prev, [field.name]: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={qrData[field.name as keyof QRCodeData] || ''}
                      onChange={(e) => setQrData(prev => ({ ...prev, [field.name]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            {/* Frame Options */}
            <div className="px-4 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Frame</Label>
                <div className="grid grid-cols-4 gap-2">
                  {frames.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame.id)}
                      className={`aspect-square border-2 rounded-lg p-2 ${
                        selectedFrame === frame.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div 
                        className="w-full h-full rounded border-2"
                        style={{ 
                          backgroundColor: frame.color,
                          borderStyle: frame.style 
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape Options */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Shape</Label>
                <div className="grid grid-cols-4 gap-2">
                  {shapes.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setSelectedShape(shape.id)}
                      className={`aspect-square border-2 rounded-lg p-3 flex items-center justify-center ${
                        selectedShape === shape.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 bg-gray-800"
                        style={{ 
                          borderRadius: shape.style === 'rounded' ? '50%' : 
                                      shape.style === 'semi-rounded' ? '4px' : '0'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Options */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Logo</Label>
                
                {/* Custom Logo Upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Custom Logo
                  </Button>
                </div>

                {/* Custom Logo Preview */}
                {customLogo && (
                  <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={customLogo} alt="Custom logo" className="w-8 h-8 object-contain" />
                        <span className="text-sm text-gray-600">Custom Logo</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Preset Logos */}
                <div className="grid grid-cols-4 gap-2">
                  {logos.map((logo) => (
                    <button
                      key={logo.id}
                      onClick={() => setSelectedLogo(logo.id)}
                      className={`aspect-square border-2 rounded-lg p-2 flex items-center justify-center ${
                        selectedLogo === logo.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <img src={logo.src} alt={logo.name} className="w-6 h-6 object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Customization */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Error Correction Level */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Error Correction</Label>
                <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                  <SelectTrigger>
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

              {/* Size */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Size: {size}px
                </Label>
                <Slider
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  min={100}
                  max={1000}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* Margin */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Margin: {margin}
                </Label>
                <Slider
                  value={[margin]}
                  onValueChange={(value) => setMargin(value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Display */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="Generated QR Code" className="max-w-full max-h-full" />
          ) : (
            <span className="text-gray-500 text-sm">QR Code will appear here</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        <Button onClick={handleGenerate} className="w-full">
          Generate QR Code
        </Button>
        {qrCodeUrl && (
          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;

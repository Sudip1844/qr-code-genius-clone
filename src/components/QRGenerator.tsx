import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { generateQRCode, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR, createSMSQR, createWhatsAppQR, createWiFiQR, createVCardQR, createEventQR, createImageQR } from '@/lib/qr-service';
import { Upload, Download, QrCode, Palette } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { ImageControls } from './ImageControls';

interface QRGeneratorProps {
  onGenerate: (options: QROptions) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onGenerate }) => {
  // Basic QR settings
  const [qrType, setQrType] = useState('url');
  const [qrData, setQrData] = useState('');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(4);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Colors
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  // Design options - only frame and logo
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [frameText, setFrameText] = useState('');
  const [frameFont, setFrameFont] = useState('Arial');
  const [frameColor, setFrameColor] = useState('#000000');
  const [selectedLogo, setSelectedLogo] = useState('none');
  const [customLogo, setCustomLogo] = useState('');
  const [logoSize, setLogoSize] = useState(15);
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [logoPosition, setLogoPosition] = useState('center');
  const [logoShape, setLogoShape] = useState('square');
  const [gradient, setGradient] = useState(false);

  // QR type specific fields
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState('WPA');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageSettings, setImageSettings] = useState({
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.8,
    format: 'jpeg' as 'jpeg' | 'png' | 'webp'
  });

  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Frame options
  const frameOptions = [
    { value: 'none', label: 'No Frame' },
    { value: 'basic', label: 'Basic Border' },
    { value: 'rounded', label: 'Rounded Border' },
    { value: 'banner', label: 'Top Banner' },
    { value: 'badge', label: 'Badge Style' }
  ];

  // Logo options
  const logoOptions = [
    { value: 'none', label: 'No Logo' },
    { value: 'link', label: 'Link Icon' },
    { value: 'location', label: 'Location Pin' },
    { value: 'email', label: 'Email Icon' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'wifi', label: 'WiFi Symbol' },
    { value: 'vcard', label: 'Contact Card' }
  ];

  const logoPositions = [
    { value: 'center', label: 'Center' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  const logoShapes = [
    { value: 'square', label: 'Square' },
    { value: 'circle', label: 'Circle' },
    { value: 'rounded', label: 'Rounded' }
  ];

  const getQRData = () => {
    switch (qrType) {
      case 'url':
        return createUrlQR(qrData);
      case 'email':
        return createEmailQR(email, subject, message);
      case 'phone':
        return createPhoneQR(phoneNumber);
      case 'text':
        return createTextQR(qrData);
      case 'sms':
        return createSMSQR(phoneNumber, smsMessage);
      case 'whatsapp':
        return createWhatsAppQR(phoneNumber, whatsappMessage);
      case 'wifi':
        return createWiFiQR(ssid, password, security);
      case 'vcard':
        return createVCardQR(contactName, contactPhone, contactEmail, organization);
      case 'event':
        return createEventQR(eventTitle, eventLocation, startDate, endDate);
      case 'image':
        return createImageQR(uploadedImage || '');
      default:
        return qrData;
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const data = getQRData();
      
      if (!data) {
        alert('Please fill in the required information for the selected QR type.');
        return;
      }

      const options: QROptions = {
        data,
        size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: errorCorrection,
        design: {
          frame: selectedFrame,
          frameText: frameText,
          frameFont: frameFont,
          frameColor: frameColor,
          logo: selectedLogo,
          customLogo: customLogo,
          logoSize: logoSize,
          logoOpacity: logoOpacity,
          logoPosition: logoPosition,
          logoShape: logoShape,
          gradient: gradient
        }
      };

      const qrDataUrl = await generateQRCode(options);
      setGeneratedQR(qrDataUrl);
      onGenerate(options);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedQR) {
      const link = document.createElement('a');
      link.download = `qr-code-${qrType}.png`;
      link.href = generatedQR;
      link.click();
    }
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    setQrData(imageData);
  };

  const handleImageSettings = (settings: typeof imageSettings) => {
    setImageSettings(settings);
  };

  // Listen for QR type selection events
  useEffect(() => {
    const handleQRTypeSelect = (event: CustomEvent) => {
      setQrType(event.detail.type);
    };

    window.addEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    return () => {
      window.removeEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    };
  }, []);

  const renderQRTypeFields = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Email message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Message</Label>
              <Textarea
                id="text"
                placeholder="Enter your text message"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
              />
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="sms-phone">Phone Number</Label>
              <Input
                id="sms-phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sms-message">Message (Optional)</Label>
              <Textarea
                id="sms-message"
                placeholder="SMS message"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
              />
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="whatsapp-phone">Phone Number</Label>
              <Input
                id="whatsapp-phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="whatsapp-message">Message (Optional)</Label>
              <Textarea
                id="whatsapp-message"
                placeholder="WhatsApp message"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
              />
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ssid">Network Name (SSID)</Label>
              <Input
                id="ssid"
                placeholder="WiFi Network Name"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wifi-password">Password</Label>
              <Input
                id="wifi-password"
                type="password"
                placeholder="WiFi Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="security">Security Type</Label>
              <Select value={security} onValueChange={setSecurity}>
                <SelectTrigger>
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
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Full Name</Label>
              <Input
                id="contact-name"
                placeholder="John Doe"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone (Optional)</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+1234567890"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email (Optional)</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="john@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                placeholder="Company Name"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                placeholder="Meeting Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="event-location">Location (Optional)</Label>
              <Input
                id="event-location"
                placeholder="Event Location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="start-date">Start Date & Time (Optional)</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date & Time (Optional)</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <ImageUpload onImageUpload={handleImageUpload} onImageRemove={() => setUploadedImage(null)} currentImage={uploadedImage || undefined} />
            {uploadedImage && (
              <ImageControls
                logoSize={logoSize}
                logoOpacity={logoOpacity}
                logoPosition={logoPosition}
                logoShape={logoShape}
                onLogoSizeChange={setLogoSize}
                onLogoOpacityChange={setLogoOpacity}
                onLogoPositionChange={setLogoPosition}
                onLogoShapeChange={setLogoShape}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">QR Code Generator</h1>
        <p className="text-slate-600">Create custom QR codes with advanced design options</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-type">QR Code Type</Label>
                <Select value={qrType} onValueChange={setQrType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">Website URL</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="sms">SMS Message</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="wifi">WiFi Network</SelectItem>
                    <SelectItem value="vcard">Contact Card</SelectItem>
                    <SelectItem value="event">Calendar Event</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderQRTypeFields()}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size (px): {size}</Label>
                  <Slider
                    id="size"
                    min={200}
                    max={800}
                    step={50}
                    value={[size]}
                    onValueChange={([value]) => setSize(value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="margin">Margin: {margin}</Label>
                  <Slider
                    id="margin"
                    min={0}
                    max={10}
                    step={1}
                    value={[margin]}
                    onValueChange={([value]) => setMargin(value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="error-correction">Error Correction Level</Label>
                <Select value={errorCorrection} onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorCorrection(value)}>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dark-color">Dark Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="dark-color"
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="light-color">Light Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="light-color"
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="frame" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="frame">Frame</TabsTrigger>
                  <TabsTrigger value="logo">Logo</TabsTrigger>
                </TabsList>

                <TabsContent value="frame" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="frame">Frame Style</Label>
                    <Select value={selectedFrame} onValueChange={setSelectedFrame}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frameOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedFrame !== 'none' && (
                    <>
                      <div>
                        <Label htmlFor="frame-text">Frame Text</Label>
                        <Input
                          id="frame-text"
                          placeholder="SCAN ME"
                          value={frameText}
                          onChange={(e) => setFrameText(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="frame-font">Frame Font</Label>
                        <Select value={frameFont} onValueChange={setFrameFont}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="frame-color">Frame Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="frame-color"
                            type="color"
                            value={frameColor}
                            onChange={(e) => setFrameColor(e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={frameColor}
                            onChange={(e) => setFrameColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="gradient"
                      checked={gradient}
                      onCheckedChange={setGradient}
                    />
                    <Label htmlFor="gradient">Enable Gradient</Label>
                  </div>
                </TabsContent>

                <TabsContent value="logo" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="logo">Logo Style</Label>
                    <Select value={selectedLogo} onValueChange={setSelectedLogo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {logoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom-logo">Custom Logo (Image URL or Upload)</Label>
                    <Input
                      id="custom-logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={customLogo}
                      onChange={(e) => setCustomLogo(e.target.value)}
                    />
                  </div>

                  {(selectedLogo !== 'none' || customLogo) && (
                    <>
                      <div>
                        <Label htmlFor="logo-size">Logo Size (%): {logoSize}</Label>
                        <Slider
                          id="logo-size"
                          min={5}
                          max={30}
                          step={1}
                          value={[logoSize]}
                          onValueChange={([value]) => setLogoSize(value)}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="logo-opacity">Logo Opacity (%): {logoOpacity}</Label>
                        <Slider
                          id="logo-opacity"
                          min={10}
                          max={100}
                          step={5}
                          value={[logoOpacity]}
                          onValueChange={([value]) => setLogoOpacity(value)}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="logo-position">Logo Position</Label>
                        <Select value={logoPosition} onValueChange={setLogoPosition}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {logoPositions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="logo-shape">Logo Shape</Label>
                        <Select value={logoShape} onValueChange={setLogoShape}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {logoShapes.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !getQRData()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {generatedQR ? (
                  <div className="bg-white p-4 rounded-lg border">
                    <img 
                      src={generatedQR} 
                      alt="Generated QR Code" 
                      className="max-w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <QrCode className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>QR Code will appear here</p>
                    </div>
                  </div>
                )}
                
                {generatedQR && (
                  <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;

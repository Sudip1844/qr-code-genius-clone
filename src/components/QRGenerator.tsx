import { useState, useEffect } from 'react';
import { generateQRCode, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR } from '@/lib/qr-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Link as LinkIcon, Mail, MessageSquare, Phone, Wifi, User, Calendar, MessageCircle, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type QRType = 'url' | 'email' | 'text' | 'phone' | 'sms' | 'whatsapp' | 'wifi' | 'vcard' | 'event';

const QRGenerator = () => {
  const [qrType, setQrType] = useState<QRType>('url');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [designTab, setDesignTab] = useState('frame');

  // URL fields
  const [url, setUrl] = useState('');

  // Email fields
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Text field
  const [text, setText] = useState('');

  // Phone field
  const [phone, setPhone] = useState('');

  // SMS fields
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // WhatsApp fields
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');

  // WiFi fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');

  // VCard fields
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');

  // Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');

  // Design options state
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameFont, setFrameFont] = useState('Sans-Serif');
  const [frameColor, setFrameColor] = useState('#000000');
  const [selectedShape, setSelectedShape] = useState('square');
  const [shapeColor, setShapeColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [gradient, setGradient] = useState(false);
  const [borderStyle, setBorderStyle] = useState('square');
  const [borderColor, setBorderColor] = useState('#000000');
  const [centerStyle, setCenterStyle] = useState('square');
  const [centerColor, setCenterColor] = useState('#000000');
  const [selectedLogo, setSelectedLogo] = useState('none');

  const qrTypes = [
    { id: 'url', name: 'URL', icon: LinkIcon, color: 'text-emerald-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'text-blue-600' },
    { id: 'text', name: 'Text', icon: MessageSquare, color: 'text-orange-500' },
    { id: 'phone', name: 'Phone', icon: Phone, color: 'text-emerald-500' },
    { id: 'sms', name: 'SMS', icon: MessageCircle, color: 'text-blue-600' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'wifi', name: 'WiFi', icon: Wifi, color: 'text-emerald-500' },
    { id: 'vcard', name: 'VCard', icon: User, color: 'text-blue-600' },
    { id: 'event', name: 'Event', icon: Calendar, color: 'text-orange-500' },
  ];

  const frameOptions = [
    { id: 'none', label: 'No Frame', icon: '✕' },
    { id: 'basic', label: 'Basic Frame', icon: '📱' },
    { id: 'rounded', label: 'Rounded Frame', icon: '🔲' },
    { id: 'circle', label: 'Circle Frame', icon: '⭕' },
    { id: 'banner', label: 'Banner Frame', icon: '🏷️' },
    { id: 'badge', label: 'Badge Frame', icon: '🎫' },
    { id: 'button', label: 'Button Frame', icon: '🔘' },
    { id: 'card', label: 'Card Frame', icon: '💳' }
  ];

  const shapeOptions = [
    { id: 'square', pattern: '▪️' },
    { id: 'rounded', pattern: '🔲' },
    { id: 'circle', pattern: '⭕' },
    { id: 'diamond', pattern: '🔶' },
    { id: 'star', pattern: '⭐' },
    { id: 'heart', pattern: '❤️' },
    { id: 'hexagon', pattern: '⬡' },
    { id: 'triangle', pattern: '🔺' }
  ];

  const borderOptions = [
    { id: 'square', icon: '⬜' },
    { id: 'rounded', icon: '🔲' },
    { id: 'circle', icon: '⭕' },
    { id: 'diamond', icon: '🔶' },
    { id: 'oval', icon: '🥚' },
    { id: 'hexagon', icon: '⬡' },
    { id: 'octagon', icon: '🛑' },
    { id: 'leaf', icon: '🍃' }
  ];

  const centerOptions = [
    { id: 'square', icon: '⬛' },
    { id: 'rounded', icon: '🔲' },
    { id: 'circle', icon: '⭕' },
    { id: 'diamond', icon: '🔶' },
    { id: 'star', icon: '⭐' },
    { id: 'heart', icon: '❤️' },
    { id: 'flower', icon: '🌸' },
    { id: 'cross', icon: '➕' }
  ];

  const logoOptions = [
    { id: 'none', icon: '✕', label: 'No Logo' },
    { id: 'link', icon: '🔗', label: 'Link' },
    { id: 'location', icon: '📍', label: 'Location' },
    { id: 'email', icon: '📧', label: 'Email' },
    { id: 'whatsapp', icon: '💬', label: 'WhatsApp' },
    { id: 'wifi', icon: '📶', label: 'WiFi' },
    { id: 'vcard', icon: '👤', label: 'Contact' },
    { id: 'paypal', icon: '💳', label: 'PayPal' },
    { id: 'bitcoin', icon: '₿', label: 'Bitcoin' },
    { id: 'scan1', icon: '📱', label: 'Scan Me 1' },
    { id: 'scan2', icon: '📄', label: 'Scan Me 2' },
    { id: 'qr', icon: '📊', label: 'QR Code' },
    { id: 'menu', icon: '📋', label: 'Menu' },
    { id: 'fullscreen', icon: '⛶', label: 'Fullscreen' }
  ];

  const generateQRData = (): string => {
    switch (qrType) {
      case 'url':
        return createUrlQR(url);
      case 'email':
        return createEmailQR(email, emailSubject, emailBody);
      case 'text':
        return createTextQR(text);
      case 'phone':
        return createPhoneQR(phone);
      case 'sms':
        return `sms:${smsPhone}${smsMessage ? `?body=${encodeURIComponent(smsMessage)}` : ''}`;
      case 'whatsapp':
        return `https://wa.me/${whatsappPhone.replace(/[^\d]/g, '')}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nORG:${vcardOrg}\nEND:VCARD`;
      case 'event':
        const startDate = eventStart ? new Date(eventStart).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
        const endDate = eventEnd ? new Date(eventEnd).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
        return `BEGIN:VEVENT\nSUMMARY:${eventTitle}\nLOCATION:${eventLocation}\nDTSTART:${startDate}\nDTEND:${endDate}\nEND:VEVENT`;
      default:
        return '';
    }
  };

  const generateQR = async () => {
    const qrData = generateQRData();
    
    if (!qrData.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const options: QROptions = {
        data: qrData,
        size: 300,
        margin: 4,
        color: {
          dark: shapeColor,
          light: transparentBackground ? '#00000000' : backgroundColor,
        },
        errorCorrectionLevel: 'M',
      };
      
      const qrDataUrl = await generateQRCode(options);
      setQrCode(qrDataUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCode;
    link.click();
    
    toast({
      title: "Success",
      description: "QR code downloaded successfully",
    });
  };

  useEffect(() => {
    generateQR();
  }, [qrType]);

  const renderForm = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-4">
            <Label htmlFor="website" className="block text-slate-700">Enter your Website</Label>
            <div className="flex rounded-md overflow-hidden border">
              <div className="bg-slate-50 px-3 py-2 text-slate-500 border-r">https://</div>
              <Input
                id="website"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            <div>
              <Label htmlFor="subject" className="block text-slate-700">Subject (Optional)</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="body" className="block text-slate-700">Message (Optional)</Label>
              <Textarea
                id="body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Email message"
                rows={3}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <Label htmlFor="text" className="block text-slate-700">Enter your text</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to share"
              rows={4}
            />
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-4">
            <Label htmlFor="phone" className="block text-slate-700">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="smsPhone" className="block text-slate-700">Phone Number</Label>
              <Input
                id="smsPhone"
                type="tel"
                value={smsPhone}
                onChange={(e) => setSmsPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="smsMessage" className="block text-slate-700">Message (Optional)</Label>
              <Textarea
                id="smsMessage"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="SMS message"
                rows={3}
              />
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="whatsappPhone" className="block text-slate-700">Phone Number</Label>
              <Input
                id="whatsappPhone"
                type="tel"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="whatsappMessage" className="block text-slate-700">Message (Optional)</Label>
              <Textarea
                id="whatsappMessage"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="WhatsApp message"
                rows={3}
              />
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ssid" className="block text-slate-700">Network Name (SSID)</Label>
              <Input
                id="ssid"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder="WiFi Network Name"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="WiFi Password"
              />
            </div>
            <div>
              <Label htmlFor="security" className="block text-slate-700">Security Type</Label>
              <select
                id="security"
                value={wifiSecurity}
                onChange={(e) => setWifiSecurity(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vcardName" className="block text-slate-700">Full Name</Label>
              <Input
                id="vcardName"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="vcardPhone" className="block text-slate-700">Phone Number</Label>
              <Input
                id="vcardPhone"
                type="tel"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="vcardEmail" className="block text-slate-700">Email</Label>
              <Input
                id="vcardEmail"
                type="email"
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="vcardOrg" className="block text-slate-700">Organization</Label>
              <Input
                id="vcardOrg"
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
                placeholder="Company Name"
              />
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle" className="block text-slate-700">Event Title</Label>
              <Input
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event Title"
              />
            </div>
            <div>
              <Label htmlFor="eventLocation" className="block text-slate-700">Location</Label>
              <Input
                id="eventLocation"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Event Location"
              />
            </div>
            <div>
              <Label htmlFor="eventStart" className="block text-slate-700">Start Date & Time</Label>
              <Input
                id="eventStart"
                type="datetime-local"
                value={eventStart}
                onChange={(e) => setEventStart(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="eventEnd" className="block text-slate-700">End Date & Time</Label>
              <Input
                id="eventEnd"
                type="datetime-local"
                value={eventEnd}
                onChange={(e) => setEventEnd(e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDesignContent = () => {
    switch (designTab) {
      case 'frame':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-3">
              {frameOptions.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    selectedFrame === frame.id 
                      ? 'bg-blue-50 border-blue-500 text-blue-600' 
                      : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{frame.icon}</div>
                  <div className="text-xs">{frame.label}</div>
                </button>
              ))}
            </div>

            {selectedFrame !== 'none' && (
              <div className="space-y-4">
                <div>
                  <Label className="block text-slate-700 mb-2">Frame phrase</Label>
                  <Input
                    value={frameText}
                    onChange={(e) => setFrameText(e.target.value)}
                    placeholder="SCAN ME"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-slate-700 mb-2">Phrase font</Label>
                    <select
                      value={frameFont}
                      onChange={(e) => setFrameFont(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Sans-Serif">Sans-Serif</option>
                      <option value="Serif">Serif</option>
                      <option value="Monospace">Monospace</option>
                    </select>
                  </div>

                  <div>
                    <Label className="block text-slate-700 mb-2">Frame color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={frameColor}
                        onChange={(e) => setFrameColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                      <div 
                        className="w-10 h-10 rounded border cursor-pointer"
                        style={{ backgroundColor: frameColor }}
                        onClick={() => document.getElementById('frameColorPicker')?.click()}
                      />
                      <input
                        id="frameColorPicker"
                        type="color"
                        value={frameColor}
                        onChange={(e) => setFrameColor(e.target.value)}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'shape':
        return (
          <div className="space-y-6">
            <div>
              <Label className="block text-slate-700 mb-3">Shape & Color</Label>
              
              <div className="mb-4">
                <Label className="block text-slate-700 mb-2">Shape style</Label>
                <div className="grid grid-cols-4 gap-2">
                  {shapeOptions.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setSelectedShape(shape.id)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedShape === shape.id 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xl">{shape.pattern}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <div>
                  <Label className="block text-slate-700 mb-2">Background color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer"
                      style={{ backgroundColor: backgroundColor }}
                      onClick={() => document.getElementById('bgColorPicker')?.click()}
                    />
                    <input
                      id="bgColorPicker"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="hidden"
                    />
                  </div>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={transparentBackground}
                      onChange={(e) => setTransparentBackground(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-600">Transparent background</span>
                  </label>
                </div>

                <div>
                  <Label className="block text-slate-700 mb-2">Shape color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={shapeColor}
                      onChange={(e) => setShapeColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer"
                      style={{ backgroundColor: shapeColor }}
                      onClick={() => document.getElementById('shapeColorPicker')?.click()}
                    />
                    <input
                      id="shapeColorPicker"
                      type="color"
                      value={shapeColor}
                      onChange={(e) => setShapeColor(e.target.value)}
                      className="hidden"
                    />
                  </div>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={gradient}
                      onChange={(e) => setGradient(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-600">Gradient</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block text-slate-700 mb-2">Border style</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {borderOptions.map((border) => (
                      <button
                        key={border.id}
                        onClick={() => setBorderStyle(border.id)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          borderStyle === border.id 
                            ? 'bg-blue-50 border-blue-500' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-xl">{border.icon}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <Label className="block text-slate-700 mb-2">Border color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer"
                      style={{ backgroundColor: borderColor }}
                      onClick={() => document.getElementById('borderColorPicker')?.click()}
                    />
                    <input
                      id="borderColorPicker"
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-slate-700 mb-2">Center style</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {centerOptions.map((center) => (
                      <button
                        key={center.id}
                        onClick={() => setCenterStyle(center.id)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          centerStyle === center.id 
                            ? 'bg-blue-50 border-blue-500' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-xl">{center.icon}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <Label className="block text-slate-700 mb-2">Center color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={centerColor}
                      onChange={(e) => setCenterColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer"
                      style={{ backgroundColor: centerColor }}
                      onClick={() => document.getElementById('centerColorPicker')?.click()}
                    />
                    <input
                      id="centerColorPicker"
                      type="color"
                      value={centerColor}
                      onChange={(e) => setCenterColor(e.target.value)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'logo':
        return (
          <div className="space-y-6">
            <div>
              <Label className="block text-slate-700 mb-3">Upload Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logoUpload"
                />
                <label htmlFor="logoUpload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-500">Choose file</div>
                </label>
                <Button variant="outline" className="mt-2">Browse</Button>
              </div>
            </div>

            <div>
              <Label className="block text-slate-700 mb-3">Or choose from here</Label>
              <div className="grid grid-cols-4 gap-3">
                {logoOptions.map((logo) => (
                  <button
                    key={logo.id}
                    onClick={() => setSelectedLogo(logo.id)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      selectedLogo === logo.id 
                        ? 'bg-blue-50 border-blue-500 text-blue-600' 
                        : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{logo.icon}</div>
                    <div className="text-xs">{logo.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentType = qrTypes.find(type => type.id === qrType);

  return (
    <div>
      <div className="p-6 bg-white">
        <h2 className="text-center text-xl font-medium text-slate-700 mb-4">Preview QR Code</h2>
        <div className="flex justify-center mb-6">
          {qrCode ? (
            <div className="p-8 border rounded-lg bg-white">
              <img src={qrCode} alt="QR Code" className="max-w-full h-auto" style={{ width: '200px', height: '200px' }} />
            </div>
          ) : (
            <div className="p-8 border rounded-lg bg-white flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
              <p className="text-slate-400">Loading QR code...</p>
            </div>
          )}
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 text-center rounded-l-md ${
              activeTab === 'content' 
                ? 'bg-emerald-100 text-emerald-600 font-medium' 
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span className={`${activeTab === 'content' ? 'bg-emerald-500' : 'bg-slate-400'} text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2`}>1</span>
            Content
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-3 text-center rounded-r-md ${
              activeTab === 'design' 
                ? 'bg-emerald-100 text-emerald-600 font-medium' 
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span className={`${activeTab === 'design' ? 'bg-emerald-500' : 'bg-slate-400'} text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2`}>2</span>
            Design
          </button>
        </div>

        {activeTab === 'content' && (
          <div>
            {/* QR Type Selector */}
            <div className="mb-6">
              <Label className="block text-slate-700 mb-3">QR Code Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {qrTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setQrType(type.id as QRType)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        qrType === type.id 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                          : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex justify-center mb-2 ${type.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Type Display */}
            {currentType && (
              <div className="mb-6 bg-emerald-50 p-4 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <currentType.icon className="h-5 w-5 text-emerald-500 mr-2" />
                  <span className="text-emerald-700">{currentType.name}</span>
                </div>
              </div>
            )}
            
            {/* Dynamic Form */}
            <div className="mb-6">
              {renderForm()}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={generateQR}
                disabled={loading}
                className="flex-1 py-6 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </Button>
              
              <Button 
                onClick={downloadQR}
                disabled={!qrCode || loading}
                className="py-6 bg-slate-200 hover:bg-slate-300 text-slate-700"
                variant="ghost"
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div>
            <Tabs value={designTab} onValueChange={setDesignTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="frame" className="text-emerald-600">Frame</TabsTrigger>
                <TabsTrigger value="shape">Shape</TabsTrigger>
                <TabsTrigger value="logo">Logo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="frame" className="mt-6">
                {renderDesignContent()}
              </TabsContent>
              
              <TabsContent value="shape" className="mt-6">
                {renderDesignContent()}
              </TabsContent>
              
              <TabsContent value="logo" className="mt-6">
                {renderDesignContent()}
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={generateQR}
                disabled={loading}
                className="flex-1 py-6 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </Button>
              
              <Button 
                onClick={downloadQR}
                disabled={!qrCode || loading}
                className="py-6 bg-slate-200 hover:bg-slate-300 text-slate-700"
                variant="ghost"
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;

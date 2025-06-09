import { useState, useEffect } from 'react';
import { generateQRCode, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR, createImageQR } from '@/lib/qr-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Link as LinkIcon, Mail, MessageSquare, Phone, Wifi, User, Calendar, MessageCircle, Upload, QrCode, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageControls } from '@/components/ImageControls';

type QRType = 'url' | 'email' | 'text' | 'phone' | 'sms' | 'whatsapp' | 'wifi' | 'vcard' | 'event' | 'image';

const QRPreview = ({ loading, qrCode }: { loading: boolean; qrCode: string | null }) => {
  if (loading) {
    return (
      <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-gray-300 rounded-lg relative">
            <div className="absolute inset-2 grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-400 rounded-sm animate-pulse"
                  style={{
                    animationDelay: `${(i % 8) * 0.1}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-gray-500">
            <QrCode className="h-4 w-4 animate-spin" />
            <span className="text-sm">Generating...</span>
          </div>
        </div>
      </div>
    );
  }

  if (qrCode) {
    return <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />;
  }

  return (
    <div className="w-48 h-48 mx-auto">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
};

const QRForm = ({
  qrType,
  setQrType,
  url,
  setUrl,
  email,
  setEmail,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  text,
  setText,
  phone,
  setPhone,
  smsPhone,
  setSmsPhone,
  smsMessage,
  setSmsMessage,
  whatsappPhone,
  setWhatsappPhone,
  whatsappMessage,
  setWhatsappMessage,
  wifiSSID,
  setWifiSSID,
  wifiPassword,
  setWifiPassword,
  wifiSecurity,
  setWifiSecurity,
  vcardName,
  setVcardName,
  vcardPhone,
  setVcardPhone,
  vcardEmail,
  setVcardEmail,
  vcardOrg,
  setVcardOrg,
  eventTitle,
  setEventTitle,
  eventLocation,
  setEventLocation,
  eventStart,
  setEventStart,
  eventEnd,
  setEventEnd,
  imageData,
  setImageData,
  qrTypes,
}: {
  qrType: QRType;
  setQrType: (value: QRType) => void;
  url: string;
  setUrl: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  emailSubject: string;
  setEmailSubject: (value: string) => void;
  emailBody: string;
  setEmailBody: (value: string) => void;
  text: string;
  setText: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  smsPhone: string;
  setSmsPhone: (value: string) => void;
  smsMessage: string;
  setSmsMessage: (value: string) => void;
  whatsappPhone: string;
  setWhatsappPhone: (value: string) => void;
  whatsappMessage: string;
  setWhatsappMessage: (value: string) => void;
  wifiSSID: string;
  setWifiSSID: (value: string) => void;
  wifiPassword: string;
  setWifiPassword: (value: string) => void;
  wifiSecurity: string;
  setWifiSecurity: (value: string) => void;
  vcardName: string;
  setVcardName: (value: string) => void;
  vcardPhone: string;
  setVcardPhone: (value: string) => void;
  vcardEmail: string;
  setVcardEmail: (value: string) => void;
  vcardOrg: string;
  setVcardOrg: (value: string) => void;
  eventTitle: string;
  setEventTitle: (value: string) => void;
  eventLocation: string;
  setEventLocation: (value: string) => void;
  eventStart: string;
  setEventStart: (value: string) => void;
  eventEnd: string;
  setEventEnd: (value: string) => void;
  imageData: string;
  setImageData: (value: string) => void;
  qrTypes: { id: string; name: string; icon: React.ComponentType<any>; color: string }[];
}) => {
  const currentType = qrTypes.find(type => type.id === qrType);

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

      case 'image':
        return (
          <div className="space-y-4">
            <ImageUpload
              onImageUpload={setImageData}
              onImageRemove={() => setImageData('')}
              currentImage={imageData}
              label="Upload Image for QR Code"
              maxWidth={150}
              maxHeight={150}
            />
            {imageData && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium">Image QR Code Tips:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Images are highly compressed for QR compatibility</li>
                  <li>Use simple images with high contrast for best results</li>
                  <li>QR scanner apps may show a text representation or small thumbnail</li>
                  <li>The actual image data is embedded in the QR code</li>
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* QR Type Selector */}
      <div>
        <Select value={qrType} onValueChange={(value) => setQrType(value as QRType)}>
          <SelectTrigger className="w-full bg-emerald-50 border-emerald-200 text-emerald-700 h-12">
            <div className="flex items-center">
              {currentType && <currentType.icon className="h-5 w-5 mr-3" />}
              <SelectValue placeholder="Select QR type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {qrTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center">
                    <IconComponent className={`h-4 w-4 mr-3 ${type.color}`} />
                    {type.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      {/* Dynamic Form */}
      <div className="space-y-4">
        {renderForm()}
      </div>
    </div>
  );
};

const QRGenerator = () => {
  const [qrType, setQrType] = useState<QRType>('url');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
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

  // Image field
  const [imageData, setImageData] = useState('');

  // Design options state
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameFont, setFrameFont] = useState('Sans-Serif');
  const [frameColor, setFrameColor] = useState('#000000');
  const [selectedShape, setSelectedShape] = useState('classic');
  const [shapeColor, setShapeColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [gradient, setGradient] = useState(false);
  const [borderStyle, setBorderStyle] = useState('square');
  const [borderColor, setBorderColor] = useState('#000000');
  const [centerStyle, setCenterStyle] = useState('square');
  const [centerColor, setCenterColor] = useState('#000000');
  const [selectedLogo, setSelectedLogo] = useState('none');

  // New image-related state
  const [customLogo, setCustomLogo] = useState<string>('');
  const [logoSize, setLogoSize] = useState(15);
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [logoPosition, setLogoPosition] = useState('center');
  const [logoShape, setLogoShape] = useState('original');

  const qrTypes = [
    { id: 'url', name: 'Link', icon: LinkIcon, color: 'text-emerald-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'text-blue-600' },
    { id: 'text', name: 'Text', icon: MessageSquare, color: 'text-orange-500' },
    { id: 'phone', name: 'Phone', icon: Phone, color: 'text-emerald-500' },
    { id: 'sms', name: 'SMS', icon: MessageCircle, color: 'text-blue-600' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'wifi', name: 'WiFi', icon: Wifi, color: 'text-emerald-500' },
    { id: 'vcard', name: 'VCard', icon: User, color: 'text-blue-600' },
    { id: 'event', name: 'Event', icon: Calendar, color: 'text-orange-500' },
    { id: 'image', name: 'Image', icon: ImageIcon, color: 'text-purple-500' },
  ];

  // Replace frame options with working ones only
  const frameOptions = [
    { id: 'none', label: 'No Frame', preview: '✕' },
    { id: 'basic', label: 'Basic Frame', preview: '⬜' },
    { id: 'rounded', label: 'Rounded Frame', preview: '🔲' },
    { id: 'banner', label: 'Banner Frame', preview: '🏷️' },
    { id: 'badge', label: 'Badge Frame', preview: '🎫' }
  ];

  // New Shape options with SVG previews - exactly matching QR.io
  const shapeOptions = [
    { 
      id: 'square', 
      label: 'Square',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="4" height="4" fill="#000000"/>
          <rect x="9" y="3" width="4" height="4" fill="#000000"/>
          <rect x="15" y="3" width="4" height="4" fill="#000000"/>
          <rect x="3" y="9" width="4" height="4" fill="#000000"/>
          <rect x="15" y="9" width="4" height="4" fill="#000000"/>
          <rect x="3" y="15" width="4" height="4" fill="#000000"/>
          <rect x="9" y="15" width="4" height="4" fill="#000000"/>
          <rect x="15" y="15" width="4" height="4" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'circle', 
      label: 'Circle',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="5" cy="5" r="2" fill="#000000"/>
          <circle cx="11" cy="5" r="2" fill="#000000"/>
          <circle cx="17" cy="5" r="2" fill="#000000"/>
          <circle cx="5" cy="11" r="2" fill="#000000"/>
          <circle cx="17" cy="11" r="2" fill="#000000"/>
          <circle cx="5" cy="17" r="2" fill="#000000"/>
          <circle cx="11" cy="17" r="2" fill="#000000"/>
          <circle cx="17" cy="17" r="2" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'rounded', 
      label: 'Rounded',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="4" height="4" rx="1" fill="#000000"/>
          <rect x="9" y="3" width="4" height="4" rx="1" fill="#000000"/>
          <rect x="15" y="3" width="4" height="4" rx="1" fill="#000000"/>
          <rect x="3" y="9" width="4" height="4" rx="1" fill="#000000"/>
          <rect x="15" y="9" width="4" height="4" rx="1" fill="#000000"/>
          <rect x="3" y="15" width="4" height="4" rx="1" fill="#000000"/>
          <rect x="9" y="15" width="4" height="4" rx="1" fill="#000000"/>
          <rect x="15" y="15" width="4" height="4" rx="1" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'diamond', 
      label: 'Diamond',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polygon points="5,3 7,5 5,7 3,5" fill="#000000"/>
          <polygon points="11,3 13,5 11,7 9,5" fill="#000000"/>
          <polygon points="17,3 19,5 17,7 15,5" fill="#000000"/>
          <polygon points="5,9 7,11 5,13 3,11" fill="#000000"/>
          <polygon points="17,9 19,11 17,13 15,11" fill="#000000"/>
          <polygon points="5,15 7,17 5,19 3,17" fill="#000000"/>
          <polygon points="11,15 13,17 11,19 9,17" fill="#000000"/>
          <polygon points="17,15 19,17 17,19 15,17" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'vertical', 
      label: 'Vertical',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="2" height="4" fill="#000000"/>
          <rect x="10" y="3" width="2" height="4" fill="#000000"/>
          <rect x="16" y="3" width="2" height="4" fill="#000000"/>
          <rect x="4" y="9" width="2" height="4" fill="#000000"/>
          <rect x="16" y="9" width="2" height="4" fill="#000000"/>
          <rect x="4" y="15" width="2" height="4" fill="#000000"/>
          <rect x="10" y="15" width="2" height="4" fill="#000000"/>
          <rect x="16" y="15" width="2" height="4" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'horizontal', 
      label: 'Horizontal',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="4" height="2" fill="#000000"/>
          <rect x="9" y="4" width="4" height="2" fill="#000000"/>
          <rect x="15" y="4" width="4" height="2" fill="#000000"/>
          <rect x="3" y="10" width="4" height="2" fill="#000000"/>
          <rect x="15" y="10" width="4" height="2" fill="#000000"/>
          <rect x="3" y="16" width="4" height="2" fill="#000000"/>
          <rect x="9" y="16" width="4" height="2" fill="#000000"/>
          <rect x="15" y="16" width="4" height="2" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'small-square', 
      label: 'Small Square',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="2" height="2" fill="#000000"/>
          <rect x="10" y="4" width="2" height="2" fill="#000000"/>
          <rect x="16" y="4" width="2" height="2" fill="#000000"/>
          <rect x="4" y="10" width="2" height="2" fill="#000000"/>
          <rect x="16" y="10" width="2" height="2" fill="#000000"/>
          <rect x="4" y="16" width="2" height="2" fill="#000000"/>
          <rect x="10" y="16" width="2" height="2" fill="#000000"/>
          <rect x="16" y="16" width="2" height="2" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'leaf', 
      label: 'Leaf',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 5 Q5 3 7 5 Q5 7 3 5" fill="#000000"/>
          <path d="M9 5 Q11 3 13 5 Q11 7 9 5" fill="#000000"/>
          <path d="M15 5 Q17 3 19 5 Q17 7 15 5" fill="#000000"/>
          <path d="M3 11 Q5 9 7 11 Q5 13 3 11" fill="#000000"/>
          <path d="M15 11 Q17 9 19 11 Q17 13 15 11" fill="#000000"/>
          <path d="M3 17 Q5 15 7 17 Q5 19 3 17" fill="#000000"/>
          <path d="M9 17 Q11 15 13 17 Q11 19 9 17" fill="#000000"/>
          <path d="M15 17 Q17 15 19 17 Q17 19 15 17" fill="#000000"/>
        </svg>
      )
    }
  ];

  // New Border options with SVG previews - exactly matching QR.io
  const borderOptions = [
    { 
      id: 'square', 
      label: 'Square',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" stroke="#000000" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      id: 'rounded', 
      label: 'Rounded',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" stroke="#000000" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      id: 'circle', 
      label: 'Circle',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#000000" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      id: 'diamond', 
      label: 'Diamond',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,12 12,22 2,12" stroke="#000000" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      id: 'leaf-left', 
      label: 'Leaf Left',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 12 Q2 2 12 2 Q22 2 22 12 Q22 22 12 22 Q2 22 2 12" stroke="#000000" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      id: 'leaf-right', 
      label: 'Leaf Right',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M22 12 Q22 2 12 2 Q2 2 2 12 Q2 22 12 22 Q22 22 22 12" stroke="#000000" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      id: 'dashed', 
      label: 'Dashed',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" stroke="#000000" strokeWidth="2" strokeDasharray="3,3" fill="none"/>
        </svg>
      )
    },
    { 
      id: 'rounded-bottom', 
      label: 'Rounded Bottom',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 2 L22 2 L22 12 Q22 22 12 22 Q2 22 2 12 Z" stroke="#000000" strokeWidth="2" fill="none"/>
        </svg>
      )
    }
  ];

  // New Center options with SVG previews - exactly matching QR.io
  const centerOptions = [
    { 
      id: 'square', 
      label: 'Square',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="8" y="8" width="8" height="8" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'rounded', 
      label: 'Rounded',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="8" y="8" width="8" height="8" rx="2" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'circle', 
      label: 'Circle',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'diamond', 
      label: 'Diamond',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polygon points="12,8 16,12 12,16 8,12" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'star', 
      label: 'Star',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polygon points="12,8 13.2,10.8 16,10.8 13.8,12.6 14.4,15.2 12,13.6 9.6,15.2 10.2,12.6 8,10.8 10.8,10.8" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'heart', 
      label: 'Heart',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 16 Q8 12 8 10 Q8 8 10 8 Q12 10 12 10 Q12 10 14 8 Q16 8 16 10 Q16 12 12 16" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'flower', 
      label: 'Flower',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="1.5" fill="#000000"/>
          <circle cx="15" cy="12" r="1.5" fill="#000000"/>
          <circle cx="12" cy="15" r="1.5" fill="#000000"/>
          <circle cx="9" cy="12" r="1.5" fill="#000000"/>
          <circle cx="12" cy="12" r="1" fill="#000000"/>
        </svg>
      )
    },
    { 
      id: 'plus', 
      label: 'Plus',
      preview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="11" y="8" width="2" height="8" fill="#000000"/>
          <rect x="8" y="11" width="8" height="2" fill="#000000"/>
        </svg>
      )
    }
  ];

  // Logo options - only working logos
  const logoOptions = [
    { 
      id: 'none', 
      icon: '✕', 
      label: 'No Logo',
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    { 
      id: 'custom', 
      icon: '📁', 
      label: 'Custom Upload',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    { 
      id: 'link', 
      icon: '🔗', 
      label: 'Link',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      id: 'location', 
      icon: '📍', 
      label: 'Location',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    { 
      id: 'email', 
      icon: '✉️', 
      label: 'Email',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    { 
      id: 'whatsapp', 
      icon: '💬', 
      label: 'WhatsApp',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      id: 'wifi', 
      icon: '📶', 
      label: 'WiFi',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      id: 'vcard', 
      icon: '👤', 
      label: 'Contact',
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  const compressImageForQR = async (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      if (!imageData.startsWith('data:')) {
        resolve(imageData);
        return;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Start with smaller dimensions for QR compatibility
        let width = Math.min(img.width, 64);
        let height = Math.min(img.height, 64);
        
        // Maintain aspect ratio
        const aspectRatio = img.width / img.height;
        if (width / height > aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Use JPEG with low quality for maximum compression
          const compressed = canvas.toDataURL('image/jpeg', 0.5);
          
          // Check size and compress further if needed
          const base64Data = compressed.split(',')[1];
          const sizeInBytes = (base64Data.length * 3) / 4;
          
          if (sizeInBytes > 1000) {
            // Further reduce quality
            const veryCompressed = canvas.toDataURL('image/jpeg', 0.3);
            resolve(veryCompressed);
          } else {
            resolve(compressed);
          }
        } else {
          resolve(imageData);
        }
      };
      
      img.onerror = () => resolve(imageData);
      img.src = imageData;
    });
  };

  const generateQRData = async (): Promise<string> => {
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
      case 'image':
        return createImageQR(imageData);
      default:
        return '';
    }
  };

  const generateQR = async () => {
    const qrData = await generateQRData();
    
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
      
      // Use higher error correction for images and complex data
      const errorCorrectionLevel = qrType === 'image' ? 'H' : 'M';
      
      const options: QROptions = {
        data: qrData,
        size: 300,
        margin: 4,
        color: {
          dark: shapeColor,
          light: transparentBackground ? '#00000000' : backgroundColor,
        },
        errorCorrectionLevel: errorCorrectionLevel,
        design: {
          frame: selectedFrame,
          frameText: frameText,
          frameFont: frameFont,
          frameColor: frameColor,
          shape: selectedShape,
          borderStyle: borderStyle,
          borderColor: borderColor,
          centerStyle: centerStyle,
          centerColor: centerColor,
          logo: selectedLogo === 'custom' ? undefined : selectedLogo,
          customLogo: selectedLogo === 'custom' ? customLogo : undefined,
          logoSize: logoSize,
          logoOpacity: logoOpacity,
          logoPosition: logoPosition,
          logoShape: logoShape,
          gradient: gradient
        }
      };
      
      const qrDataUrl = await generateQRCode(options);
      setQrCode(qrDataUrl);
      setHasGenerated(true);
    } catch (error) {
      console.error('QR Generation Error:', error);
      toast({
        title: "Error",
        description: qrType === 'image' 
          ? "Image is too large for QR code. Try using a smaller, simpler image."
          : "Failed to generate QR code. Please try with smaller content.",
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

  const handleButtonClick = () => {
    if (!hasGenerated) {
      generateQR();
    } else {
      downloadQR();
    }
  };

  const resetGeneration = () => {
    setQrCode(null);
    setHasGenerated(false);
  };

  // Reset generation when QR type or content changes
  useEffect(() => {
    resetGeneration();
  }, [qrType, url, email, text, phone, smsPhone, whatsappPhone, wifiSSID, vcardName, eventTitle, imageData]);

  // Reset generation when design options change
  useEffect(() => {
    resetGeneration();
  }, [selectedFrame, frameText, frameFont, frameColor, selectedShape, shapeColor, backgroundColor, transparentBackground, gradient, borderStyle, borderColor, centerStyle, centerColor, selectedLogo, customLogo, logoSize, logoOpacity, logoPosition, logoShape]);

  // Listen for QR type selection events from the landing page
  useEffect(() => {
    const handleQRTypeSelect = (event: CustomEvent) => {
      const { type } = event.detail;
      if (type && qrTypes.find(t => t.id === type)) {
        setQrType(type as QRType);
      }
    };

    window.addEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    
    return () => {
      window.removeEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    };
  }, []);

  return (
    <div className="w-full bg-gray-50 rounded-2xl p-6">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm flex flex-col">
        {/* Header */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Preview QR Code</h2>
          
          {/* QR Code Preview */}
          <div className="bg-gray-100 rounded-xl p-8 mb-6 mx-4">
            <QRPreview loading={loading} qrCode={qrCode} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mx-4 mb-6">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-4 rounded-l-xl flex items-center justify-center font-medium transition-all ${
              activeTab === 'content' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <span className={`${activeTab === 'content' ? 'bg-white text-emerald-500' : 'bg-gray-400 text-white'} rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm font-bold`}>1</span>
            Content
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-3 px-4 rounded-r-xl flex items-center justify-center font-medium transition-all ${
              activeTab === 'design' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <span className={`${activeTab === 'design' ? 'bg-white text-emerald-500' : 'bg-gray-400 text-white'} rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm font-bold`}>2</span>
            Design
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pb-4">
          {activeTab === 'content' && (
            <QRForm
              qrType={qrType}
              setQrType={setQrType}
              url={url}
              setUrl={setUrl}
              email={email}
              setEmail={setEmail}
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
              emailBody={emailBody}
              setEmailBody={setEmailBody}
              text={text}
              setText={setText}
              phone={phone}
              setPhone={setPhone}
              smsPhone={smsPhone}
              setSmsPhone={setSmsPhone}
              smsMessage={smsMessage}
              setSmsMessage={setSmsMessage}
              whatsappPhone={whatsappPhone}
              setWhatsappPhone={setWhatsappPhone}
              whatsappMessage={whatsappMessage}
              setWhatsappMessage={setWhatsappMessage}
              wifiSSID={wifiSSID}
              setWifiSSID={setWifiSSID}
              wifiPassword={wifiPassword}
              setWifiPassword={setWifiPassword}
              wifiSecurity={wifiSecurity}
              setWifiSecurity={setWifiSecurity}
              vcardName={vcardName}
              setVcardName={setVcardName}
              vcardPhone={vcardPhone}
              setVcardPhone={setVcardPhone}
              vcardEmail={vcardEmail}
              setVcardEmail={setVcardEmail}
              vcardOrg={vcardOrg}
              setVcardOrg={setVcardOrg}
              eventTitle={eventTitle}
              setEventTitle={setEventTitle}
              eventLocation={eventLocation}
              setEventLocation={setEventLocation}
              eventStart={eventStart}
              setEventStart={setEventStart}
              eventEnd={eventEnd}
              setEventEnd={setEventEnd}
              imageData={imageData}
              setImageData={setImageData}
              qrTypes={qrTypes}
            />
          )}

          {activeTab === 'design' && (
            <div>
              <Tabs value={designTab} onValueChange={setDesignTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="frame">Frame</TabsTrigger>
                  <TabsTrigger value="shape">Shape</TabsTrigger>
                  <TabsTrigger value="logo">Logo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="frame" className="mt-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
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
                          <div className="text-2xl mb-1">{frame.preview}</div>
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
                            <div className="flex gap-2 items-center">
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
                </TabsContent>
                
                <TabsContent value="shape" className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <Label className="block text-slate-700 mb-3">Shape & Color</Label>
                      
                      <div className="mb-4">
                        <Label className="block text-slate-700 mb-2">Shape style</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {shapeOptions.map((shape) => (
                            <button
                              key={shape.id}
                              onClick={() => setSelectedShape(shape.id)}
                              className={`p-3 rounded-lg border text-center transition-colors relative ${
                                selectedShape === shape.id 
                                  ? 'bg-blue-50 border-blue-500' 
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <div>{shape.preview}</div>
                                <div className="text-xs">{shape.label}</div>
                              </div>
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
                          <div className="grid grid-cols-2 gap-3">
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
                                <div className="flex flex-col items-center space-y-2">
                                  <div>{border.preview}</div>
                                  <div className="text-xs">{border.label}</div>
                                </div>
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
                          <div className="grid grid-cols-2 gap-3">
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
                                <div className="flex flex-col items-center space-y-2">
                                  <div>{center.preview}</div>
                                  <div className="text-xs">{center.label}</div>
                                </div>
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
                </TabsContent>
                
                <TabsContent value="logo" className="mt-4">
                  <div className="space-y-6">
                    {selectedLogo === 'custom' && (
                      <ImageUpload
                        onImageUpload={setCustomLogo}
                        onImageRemove={() => setCustomLogo('')}
                        currentImage={customLogo}
                        label="Upload Custom Logo"
                        maxWidth={200}
                        maxHeight={200}
                      />
                    )}

                    <div>
                      <Label className="block text-slate-700 mb-3">Choose Logo Type</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {logoOptions.map((logo) => (
                          <button
                            key={logo.id}
                            onClick={() => setSelectedLogo(logo.id)}
                            className={`relative p-3 rounded-lg border transition-all duration-200 ${
                              selectedLogo === logo.id 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div 
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${logo.bgColor}`}
                              >
                                <span 
                                  className={`${logo.iconColor} text-lg font-bold`}
                                >
                                  {logo.icon}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 text-center leading-tight">
                                {logo.label}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {(selectedLogo !== 'none' && (selectedLogo === 'custom' ? customLogo : true)) && (
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
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Generate/Download Button */}
        <div className="px-4 pb-4">
          <Button 
            onClick={handleButtonClick}
            disabled={loading}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <>
                <QrCode className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : !hasGenerated ? (
              <>
                <QrCode className="h-5 w-5 mr-2" />
                Generate QR Code
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Download QR Code
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;

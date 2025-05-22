
import { useState, useEffect } from 'react';
import { generateQRCode, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR } from '@/lib/qr-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Download, Copy, Share, Settings, Mail, Phone, Link, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QRGenerator = () => {
  const [qrData, setQrData] = useState('https://example.com');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(4);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('url');
  
  // Email specific fields
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // Phone specific field
  const [phoneNumber, setPhoneNumber] = useState('');

  const generateQR = async () => {
    let finalData = qrData;
    
    // Format data based on active tab
    if (activeTab === 'url') {
      finalData = createUrlQR(qrData);
    } else if (activeTab === 'email') {
      finalData = createEmailQR(emailAddress, emailSubject, emailBody);
    } else if (activeTab === 'phone') {
      finalData = createPhoneQR(phoneNumber);
    } else if (activeTab === 'text') {
      finalData = createTextQR(qrData);
    }
    
    if (!finalData.trim()) {
      toast({
        title: "Error",
        description: "Please enter valid content",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const options: QROptions = {
        data: finalData,
        size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: errorLevel,
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

  const copyQR = async () => {
    if (!qrCode) return;
    
    try {
      // Fetch the image as a blob from the data URL
      const response = await fetch(qrCode);
      const blob = await response.blob();
      
      // Copy the image to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      toast({
        title: "Success",
        description: "QR code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR code",
        variant: "destructive",
      });
    }
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    generateQR();
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-8 border-r">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span>URL</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Text</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-base font-medium">Enter Website URL</Label>
                <Textarea
                  id="url"
                  placeholder="https://example.com"
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  className="min-h-[120px] resize-none text-base"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text" className="text-base font-medium">Enter Plain Text</Label>
                <Textarea
                  id="text"
                  placeholder="Your text message here..."
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  className="min-h-[120px] resize-none text-base"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="mt-1 text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-base font-medium">Subject (Optional)</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Email Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="mt-1 text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="body" className="text-base font-medium">Email Body (Optional)</Label>
                  <Textarea
                    id="body"
                    placeholder="Email content..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="min-h-[80px] resize-none text-base mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-base"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span className="font-medium text-base">Design Options</span>
              </div>
              <Switch
                id="advanced"
                checked={advancedOptions}
                onCheckedChange={setAdvancedOptions}
              />
            </div>
            
            {advancedOptions && (
              <div className="space-y-6 rounded-lg p-6 bg-slate-50 border">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="size" className="text-base">QR Code Size</Label>
                    <span className="text-sm text-muted-foreground font-mono">{size}px</span>
                  </div>
                  <Slider
                    id="size"
                    min={100}
                    max={1000}
                    step={10}
                    value={[size]}
                    onValueChange={(value) => setSize(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="margin" className="text-base">Quiet Zone</Label>
                    <span className="text-sm text-muted-foreground font-mono">{margin}</span>
                  </div>
                  <Slider
                    id="margin"
                    min={0}
                    max={10}
                    step={1}
                    value={[margin]}
                    onValueChange={(value) => setMargin(value[0])}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="darkColor" className="text-base">Foreground Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="darkColor"
                        type="color"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="w-14 h-12 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lightColor" className="text-base">Background Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="lightColor"
                        type="color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-14 h-12 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="errorLevel" className="text-base">Error Correction Level</Label>
                  <Select 
                    value={errorLevel} 
                    onValueChange={(value) => setErrorLevel(value as 'L' | 'M' | 'Q' | 'H')}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select error correction level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher levels improve error correction but make the QR code more complex
                  </p>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full mt-6 py-6 text-lg" 
              onClick={generateQR}
              disabled={loading}
              size="lg"
            >
              <QrCode className="mr-2 h-5 w-5" /> 
              Generate QR Code
            </Button>
          </div>
        </div>
        
        <div className="p-8 bg-slate-50">
          <div className="text-center">
            <h3 className="font-semibold text-xl mb-6">Your QR Code</h3>
            
            <div className="flex flex-col items-center">
              {qrCode ? (
                <>
                  <div className="bg-white p-8 rounded-lg shadow-sm mb-8 border">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="mx-auto max-w-full h-auto"
                      style={{ maxHeight: '300px' }} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
                    <Button variant="outline" onClick={copyQR} className="flex flex-col items-center h-auto py-3 px-1">
                      <Copy className="h-5 w-5 mb-1" />
                      <span>Copy</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center h-auto py-3 px-1">
                      <Share className="h-5 w-5 mb-1" />
                      <span>Share</span>
                    </Button>
                    <Button variant="default" onClick={downloadQR} className="flex flex-col items-center h-auto py-3 px-1 bg-primary">
                      <Download className="h-5 w-5 mb-1" />
                      <span>Download</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center bg-white border rounded-lg">
                  <QrCode className="h-16 w-16 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;

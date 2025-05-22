
import { useState, useEffect } from 'react';
import { generateQRCode, QROptions } from '@/lib/qr-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Download, Copy, Share, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QRGenerator = () => {
  const [url, setUrl] = useState('https://example.com');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(4);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('url');

  const generateQR = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL or text",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const options: QROptions = {
        data: url,
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

  useEffect(() => {
    generateQR();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-8 border-r">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full mb-6">
              <TabsTrigger value="url" className="flex-1">URL</TabsTrigger>
              <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
              <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
              <TabsTrigger value="phone" className="flex-1">Phone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Enter Website URL</Label>
                <Textarea
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Enter Plain Text</Label>
                <Textarea
                  id="text"
                  placeholder="Your text message here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  onChange={(e) => setUrl(`mailto:${e.target.value}`)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  onChange={(e) => setUrl(`tel:${e.target.value}`)}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Design Options</span>
              </div>
              <Switch
                id="advanced"
                checked={advancedOptions}
                onCheckedChange={setAdvancedOptions}
              />
            </div>
            
            {advancedOptions && (
              <div className="space-y-5 rounded-lg p-5 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="size">Size</Label>
                    <span className="text-sm text-muted-foreground">{size}px</span>
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
                    <Label htmlFor="margin">Margin</Label>
                    <span className="text-sm text-muted-foreground">{margin}</span>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="darkColor">Foreground Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="darkColor"
                        type="color"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="w-12 h-10 p-0 border-none"
                      />
                      <Input
                        type="text"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lightColor">Background Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="lightColor"
                        type="color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-12 h-10 p-0 border-none"
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
                
                <div className="space-y-2">
                  <Label htmlFor="errorLevel">Error Correction Level</Label>
                  <Select 
                    value={errorLevel} 
                    onValueChange={(value) => setErrorLevel(value as 'L' | 'M' | 'Q' | 'H')}
                  >
                    <SelectTrigger>
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
              className="w-full mt-6" 
              onClick={generateQR}
              disabled={loading}
              size="lg"
            >
              <QrCode className="mr-2 h-5 w-5" /> 
              Generate QR Code
            </Button>
          </div>
        </div>
        
        <div className="p-8 bg-gray-50">
          <div className="text-center">
            <h3 className="font-semibold text-xl mb-6">Your QR Code</h3>
            
            <div className="flex flex-col items-center">
              {qrCode ? (
                <>
                  <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="mx-auto max-w-full h-auto"
                      style={{ maxHeight: '300px' }} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <Button variant="outline" onClick={copyQR} className="flex flex-col items-center h-auto py-3">
                      <Copy className="h-5 w-5 mb-1" />
                      <span>Copy</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center h-auto py-3">
                      <Share className="h-5 w-5 mb-1" />
                      <span>Share</span>
                    </Button>
                    <Button variant="default" onClick={downloadQR} className="flex flex-col items-center h-auto py-3">
                      <Download className="h-5 w-5 mb-1" />
                      <span>Download</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center bg-muted-foreground/10 animate-pulse rounded-lg">
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

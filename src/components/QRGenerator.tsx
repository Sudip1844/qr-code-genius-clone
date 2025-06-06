import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CreditCard, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Globe, Mail, Phone, MapPin, Camera, Music, Gamepad2, Heart } from 'lucide-react';
import { generateQRCode } from '@/lib/qr-service';
import { useToast } from "@/hooks/use-toast";

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState('none');
  const [logoSize, setLogoSize] = useState([20]);
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState([256]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const logoOptions = [
    { value: 'none', label: 'No Logo', icon: null },
    { value: 'paypal', label: 'PayPal', icon: CreditCard },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'location', label: 'Location', icon: MapPin },
    { value: 'camera', label: 'Camera', icon: Camera },
    { value: 'music', label: 'Music', icon: Music },
    { value: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { value: 'heart', label: 'Heart', icon: Heart },
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const qrCode = await generateQRCode({
        data: file,
        logo: selectedLogo,
        logoSize: logoSize[0],
        foregroundColor: qrColor,
        backgroundColor: bgColor,
        size: size[0],
        canvas: canvasRef.current
      });
      setQrDataUrl(qrCode);
      toast({
        title: "Success",
        description: "QR code generated from image successfully!"
      });
    } catch (error) {
      console.error('Error generating QR code from image:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code from image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate QR code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const qrCode = await generateQRCode({
        data: text,
        logo: selectedLogo,
        logoSize: logoSize[0],
        foregroundColor: qrColor,
        backgroundColor: bgColor,
        size: size[0],
        canvas: canvasRef.current
      });
      setQrDataUrl(qrCode);
      toast({
        title: "Success",
        description: "QR code generated successfully!"
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Generate QR codes from text or images with custom logos and styling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <div>
                  <Label htmlFor="text">Enter Text or URL</Label>
                  <Input
                    id="text"
                    type="text"
                    placeholder="Enter text, URL, or any content..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleTextGenerate} disabled={isLoading} className="w-full">
                  {isLoading ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>💡 Tips for better QR code scanning:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Use high contrast images</li>
                    <li>Keep file sizes reasonable (&lt;1MB)</li>
                    <li>Simple images work better than complex ones</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            {/* Customization Options */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Customization</h3>
              
              <div>
                <Label>Logo</Label>
                <Select value={selectedLogo} onValueChange={setSelectedLogo}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a logo" />
                  </SelectTrigger>
                  <SelectContent>
                    {logoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon && <option.icon className="w-4 h-4" />}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Logo Size: {logoSize[0]}%</Label>
                <Slider
                  value={logoSize}
                  onValueChange={setLogoSize}
                  max={30}
                  min={10}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qrColor">QR Color</Label>
                  <Input
                    id="qrColor"
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="mt-1 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="bgColor">Background Color</Label>
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="mt-1 h-10"
                  />
                </div>
              </div>

              <div>
                <Label>Size: {size[0]}px</Label>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  max={512}
                  min={128}
                  step={32}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {qrDataUrl ? (
                <div className="space-y-4">
                  <img 
                    src={qrDataUrl} 
                    alt="Generated QR Code" 
                    className="border rounded-lg"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <Button onClick={downloadQR} className="w-full">
                    Download QR Code
                  </Button>
                </div>
              ) : (
                <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">QR code will appear here</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRGenerator;

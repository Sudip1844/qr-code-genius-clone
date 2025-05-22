
import { useState, useEffect } from 'react';
import { generateQRCode, QROptions } from '@/lib/qr-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { QrCode, Download, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create QR Code</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Enter URL or Text</Label>
              <Textarea
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <div className="flex items-center space-x-2 mb-6">
              <Switch
                id="advanced"
                checked={advancedOptions}
                onCheckedChange={setAdvancedOptions}
              />
              <Label htmlFor="advanced">Advanced Options</Label>
            </div>
            
            {advancedOptions && (
              <div className="space-y-6 border rounded-lg p-4 bg-muted/20">
                <div className="space-y-2">
                  <Label htmlFor="size">Size: {size}px</Label>
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
                  <Label htmlFor="margin">Margin: {margin}</Label>
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
                    <div className="flex items-center space-x-2">
                      <Input
                        id="darkColor"
                        type="color"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="w-14 h-10 p-1"
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
                    <div className="flex items-center space-x-2">
                      <Input
                        id="lightColor"
                        type="color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-14 h-10 p-1"
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
                  <div className="grid grid-cols-4 gap-2">
                    {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                      <Button
                        key={level}
                        type="button"
                        variant={errorLevel === level ? "default" : "outline"}
                        onClick={() => setErrorLevel(level)}
                        className="flex-1"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Higher levels improve error correction but make the QR code more complex
                  </p>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={generateQR}
              disabled={loading}
            >
              <QrCode className="mr-2 h-4 w-4" /> 
              Generate QR Code
            </Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Your QR Code</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center">
              {qrCode ? (
                <>
                  <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="mx-auto" 
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={copyQR}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button onClick={downloadQR}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-[300px] h-[300px] bg-muted-foreground/20 animate-pulse rounded-lg"></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;

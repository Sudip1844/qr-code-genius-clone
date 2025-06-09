
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { QROptions } from '@/lib/qr-service';

interface QRGeneratorProps {
  onGenerate: (options: QROptions) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onGenerate }) => {
  const [options, setOptions] = useState<QROptions>({
    data: '',
    size: 300,
    margin: 4,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'M',
    design: {
      frame: 'none',
      shape: 'square',
      centerStyle: 'square',
      logo: 'none',
      gradient: false
    }
  });

  const handleGenerate = () => {
    if (options.data.trim()) {
      onGenerate(options);
    }
  };

  // Shape options with SVG previews in 4x2 grid
  const shapeOptions = [
    { value: 'square', label: 'Square', svg: <rect x="2" y="2" width="20" height="20" fill="currentColor" /> },
    { value: 'circle', label: 'Circle', svg: <circle cx="12" cy="12" r="10" fill="currentColor" /> },
    { value: 'rounded', label: 'Rounded', svg: <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" /> },
    { value: 'diamond', label: 'Diamond', svg: <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" /> },
    { value: 'vertical', label: 'Vertical', svg: <rect x="8" y="2" width="8" height="20" fill="currentColor" /> },
    { value: 'horizontal', label: 'Horizontal', svg: <rect x="2" y="8" width="20" height="8" fill="currentColor" /> },
    { value: 'small-square', label: 'Small Square', svg: <rect x="6" y="6" width="12" height="12" fill="currentColor" /> },
    { value: 'leaf', label: 'Leaf', svg: <path d="M2,12 Q2,2 12,2 Q22,12 12,22 Q2,12 2,12" fill="currentColor" /> }
  ];

  // Center style options in 4x2 grid
  const centerOptions = [
    { value: 'square', label: 'Square', svg: <rect x="2" y="2" width="20" height="20" fill="currentColor" /> },
    { value: 'circle', label: 'Circle', svg: <circle cx="12" cy="12" r="10" fill="currentColor" /> },
    { value: 'rounded', label: 'Rounded', svg: <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" /> },
    { value: 'diamond', label: 'Diamond', svg: <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" /> },
    { value: 'star', label: 'Star', svg: <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="currentColor" /> },
    { value: 'heart', label: 'Heart', svg: <path d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z" fill="currentColor" /> },
    { value: 'flower', label: 'Flower', svg: <g fill="currentColor"><circle cx="12" cy="5" r="3"/><circle cx="19" cy="12" r="3"/><circle cx="12" cy="19" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="12" cy="12" r="2"/></g> },
    { value: 'plus', label: 'Plus', svg: <path d="M12,2 L12,22 M2,12 L22,12" stroke="currentColor" strokeWidth="3" fill="none" /> }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="data">Content</Label>
          <Input
            id="data"
            value={options.data}
            onChange={(e) => setOptions(prev => ({ ...prev, data: e.target.value }))}
            placeholder="Enter text, URL, or content"
          />
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                type="number"
                min="100"
                max="800"
                value={options.size}
                onChange={(e) => setOptions(prev => ({ ...prev, size: parseInt(e.target.value) || 300 }))}
              />
            </div>

            <div>
              <Label htmlFor="darkColor">Dark Color</Label>
              <Input
                id="darkColor"
                type="color"
                value={options.color?.dark}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  color: { ...prev.color, dark: e.target.value } 
                }))}
              />
            </div>

            <div>
              <Label htmlFor="lightColor">Light Color</Label>
              <Input
                id="lightColor"
                type="color"
                value={options.color?.light}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  color: { ...prev.color, light: e.target.value } 
                }))}
              />
            </div>

            <div>
              <Label htmlFor="errorCorrection">Error Correction</Label>
              <Select
                value={options.errorCorrectionLevel}
                onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => 
                  setOptions(prev => ({ ...prev, errorCorrectionLevel: value }))
                }
              >
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
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div>
              <Label>Shape Style</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {shapeOptions.map((shape) => (
                  <button
                    key={shape.value}
                    onClick={() => setOptions(prev => ({ 
                      ...prev, 
                      design: { ...prev.design, shape: shape.value } 
                    }))}
                    className={`p-2 border rounded-lg flex flex-col items-center gap-1 text-xs transition-colors ${
                      options.design?.shape === shape.value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
                      {shape.svg}
                    </svg>
                    <span className="text-[10px] text-center leading-tight">{shape.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Center Style</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {centerOptions.map((center) => (
                  <button
                    key={center.value}
                    onClick={() => setOptions(prev => ({ 
                      ...prev, 
                      design: { ...prev.design, centerStyle: center.value } 
                    }))}
                    className={`p-2 border rounded-lg flex flex-col items-center gap-1 text-xs transition-colors ${
                      options.design?.centerStyle === center.value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
                      {center.svg}
                    </svg>
                    <span className="text-[10px] text-center leading-tight">{center.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="gradient"
                checked={options.design?.gradient || false}
                onCheckedChange={(checked) => setOptions(prev => ({ 
                  ...prev, 
                  design: { ...prev.design, gradient: checked } 
                }))}
              />
              <Label htmlFor="gradient">Enable Gradient</Label>
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleGenerate} className="w-full" disabled={!options.data.trim()}>
          Generate QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;

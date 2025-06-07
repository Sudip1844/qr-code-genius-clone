import React, { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { useForm } from "react-hook-form"
import { QROptions } from '@/lib/qr-service';

interface QRGeneratorProps {
  onGenerate: (options: QROptions) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onGenerate }) => {
  const [options, setOptions] = useState<QROptions>({
    data: 'https://example.com',
    size: 300,
    margin: 4,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'M',
    design: {
      frame: 'none',
      shape: 'square',
      borderStyle: 'square',
      centerStyle: 'square',
      logo: 'none',
      gradient: false,
    },
  });

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOptions(prev => ({ ...prev, data: e.target.value }));
  };

  const handleSizeChange = (value: number[]) => {
    setOptions(prev => ({ ...prev, size: value[0] }));
  };

  const handleMarginChange = (value: number[]) => {
    setOptions(prev => ({ ...prev, margin: value[0] }));
  };

  const handleDarkColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, color: { ...prev.color, dark: e.target.value } }));
  };

  const handleLightColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, color: { ...prev.color, light: e.target.value } }));
  };

  const handleErrorCorrectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' }));
  };

  const handleFrameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ design: { ...prev.design, frame: e.target.value } }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ design: { ...prev.design, logo: e.target.value } }));
  };

  const handleGradientChange = (checked: boolean) => {
    setOptions(prev => ({ design: { ...prev.design, gradient: checked } }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Input Section */}
      <div className="w-full md:w-1/2 space-y-6">
        <div>
          <Label htmlFor="data" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Data
          </Label>
          <Input type="text" id="data" placeholder="Enter data" value={options.data} onChange={handleDataChange} />
        </div>

        <div>
          <Label htmlFor="size" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Size
          </Label>
          <Slider
            id="size"
            defaultValue={[options.size || 300]}
            max={500}
            min={100}
            step={10}
            onValueChange={handleSizeChange}
          />
        </div>

        <div>
          <Label htmlFor="margin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Margin
          </Label>
          <Slider
            id="margin"
            defaultValue={[options.margin || 4]}
            max={20}
            min={0}
            step={1}
            onValueChange={handleMarginChange}
          />
        </div>

        <div>
          <Label htmlFor="darkColor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Dark Color
          </Label>
          <Input type="color" id="darkColor" value={options.color?.dark} onChange={handleDarkColorChange} />
        </div>

        <div>
          <Label htmlFor="lightColor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Light Color
          </Label>
          <Input type="color" id="lightColor" value={options.color?.light} onChange={handleLightColorChange} />
        </div>

        <div>
          <Label htmlFor="errorCorrection" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Error Correction
          </Label>
          <Select onValueChange={(value) => setOptions(prev => ({ ...prev, errorCorrectionLevel: value as 'L' | 'M' | 'Q' | 'H' }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" defaultValue={options.errorCorrectionLevel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="Q">Q</SelectItem>
              <SelectItem value="H">H</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frame" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Frame
          </Label>
          <Select onValueChange={(value) => setOptions(prev => ({ design: { ...prev.design, frame: value } }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" defaultValue={options.design?.frame} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="badge">Badge</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="logo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Logo
          </Label>
          <Select onValueChange={(value) => setOptions(prev => ({ design: { ...prev.design, logo: value } }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" defaultValue={options.design?.logo} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="link">Link</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gradient" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Gradient
          </Label>
          <Switch id="gradient" checked={options.design?.gradient} onCheckedChange={handleGradientChange} />
        </div>
      </div>

      {/* Style Section */}
      <div className="w-full md:w-1/2 space-y-6">
          {/* Shape Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Shape Style</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'square', name: 'Square' },
                { id: 'circle', name: 'Circle' },
                { id: 'rounded', name: 'Rounded' },
                { id: 'diamond', name: 'Diamond' },
                { id: 'vertical', name: 'Vertical' },
                { id: 'horizontal', name: 'Horizontal' },
                { id: 'small-square', name: 'Small' },
                { id: 'leaf', name: 'Leaf' }
              ].map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => setOptions(prev => ({ 
                    ...prev, 
                    design: { ...prev.design, shape: shape.id } 
                  }))}
                  className={`p-3 border-2 rounded-lg transition-all hover:border-primary ${
                    options.design?.shape === shape.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
                      {shape.id === 'square' && <rect x="4" y="4" width="16" height="16" fill="currentColor" />}
                      {shape.id === 'circle' && <circle cx="12" cy="12" r="8" fill="currentColor" />}
                      {shape.id === 'rounded' && <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" />}
                      {shape.id === 'diamond' && <polygon points="12,4 20,12 12,20 4,12" fill="currentColor" />}
                      {shape.id === 'vertical' && (
                        <>
                          <rect x="8" y="4" width="2" height="16" fill="currentColor" />
                          <rect x="14" y="4" width="2" height="16" fill="currentColor" />
                        </>
                      )}
                      {shape.id === 'horizontal' && (
                        <>
                          <rect x="4" y="8" width="16" height="2" fill="currentColor" />
                          <rect x="4" y="14" width="16" height="2" fill="currentColor" />
                        </>
                      )}
                      {shape.id === 'small-square' && <rect x="8" y="8" width="8" height="8" fill="currentColor" />}
                      {shape.id === 'leaf' && <path d="M12 4C8 4 4 8 4 12C4 16 8 20 12 20C16 16 20 12 20 8C16 4 12 4 12 4Z" fill="currentColor" />}
                    </svg>
                    <span className="text-xs font-medium">{shape.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Border Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Border Style</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'square', name: 'Square' },
                { id: 'rounded', name: 'Rounded' },
                { id: 'circle', name: 'Circle' },
                { id: 'diamond', name: 'Diamond' },
                { id: 'leaf-left', name: 'Leaf L' },
                { id: 'leaf-right', name: 'Leaf R' },
                { id: 'dashed', name: 'Dashed' },
                { id: 'rounded-bottom', name: 'Round B' }
              ].map((border) => (
                <button
                  key={border.id}
                  type="button"
                  onClick={() => setOptions(prev => ({ 
                    ...prev, 
                    design: { ...prev.design, borderStyle: border.id } 
                  }))}
                  className={`p-3 border-2 rounded-lg transition-all hover:border-primary ${
                    options.design?.borderStyle === border.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                      {border.id === 'square' && <rect x="4" y="4" width="16" height="16" />}
                      {border.id === 'rounded' && <rect x="4" y="4" width="16" height="16" rx="4" />}
                      {border.id === 'circle' && <circle cx="12" cy="12" r="8" />}
                      {border.id === 'diamond' && <polygon points="12,4 20,12 12,20 4,12" />}
                      {border.id === 'leaf-left' && <path d="M4 12C4 8 8 4 12 4C16 4 20 8 20 12C16 20 4 20 4 12Z" />}
                      {border.id === 'leaf-right' && <path d="M20 12C20 16 16 20 12 20C8 20 4 16 4 12C8 4 20 4 20 12Z" />}
                      {border.id === 'dashed' && <rect x="4" y="4" width="16" height="16" strokeDasharray="2,2" />}
                      {border.id === 'rounded-bottom' && <path d="M4 4H20V12C20 16 16 20 12 20C8 20 4 16 4 12V4Z" />}
                    </svg>
                    <span className="text-xs font-medium">{border.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Center Style</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'square', name: 'Square' },
                { id: 'rounded', name: 'Rounded' },
                { id: 'circle', name: 'Circle' },
                { id: 'diamond', name: 'Diamond' },
                { id: 'star', name: 'Star' },
                { id: 'heart', name: 'Heart' },
                { id: 'flower', name: 'Flower' },
                { id: 'plus', name: 'Plus' }
              ].map((center) => (
                <button
                  key={center.id}
                  type="button"
                  onClick={() => setOptions(prev => ({ 
                    ...prev, 
                    design: { ...prev.design, centerStyle: center.id } 
                  }))}
                  className={`p-3 border-2 rounded-lg transition-all hover:border-primary ${
                    options.design?.centerStyle === center.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
                      {center.id === 'square' && <rect x="8" y="8" width="8" height="8" fill="currentColor" />}
                      {center.id === 'rounded' && <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" />}
                      {center.id === 'circle' && <circle cx="12" cy="12" r="4" fill="currentColor" />}
                      {center.id === 'diamond' && <polygon points="12,8 16,12 12,16 8,12" fill="currentColor" />}
                      {center.id === 'star' && <path d="M12 8L13.5 11L17 11L14.5 13.5L15.5 17L12 15L8.5 17L9.5 13.5L7 11L10.5 11Z" fill="currentColor" />}
                      {center.id === 'heart' && <path d="M12 16C8 13 6 10 8 8C10 6 12 8 12 8S14 6 16 8C18 10 16 13 12 16Z" fill="currentColor" />}
                      {center.id === 'flower' && (
                        <>
                          <circle cx="12" cy="8" r="2" fill="currentColor" />
                          <circle cx="16" cy="12" r="2" fill="currentColor" />
                          <circle cx="12" cy="16" r="2" fill="currentColor" />
                          <circle cx="8" cy="12" r="2" fill="currentColor" />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        </>
                      )}
                      {center.id === 'plus' && (
                        <>
                          <rect x="10" y="8" width="4" height="8" fill="currentColor" />
                          <rect x="8" y="10" width="8" height="4" fill="currentColor" />
                        </>
                      )}
                    </svg>
                    <span className="text-xs font-medium">{center.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default QRGenerator;


import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Palette, QrCode } from "lucide-react";
import { generateQRCode, downloadQRCode } from "@/lib/qr-service";
import { QRCodeType, QRCodeData, QRGenerationOptions } from "@/types/qr-types";

interface QRGeneratorProps {
  initialType?: QRCodeType;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ initialType = 'url' }) => {
  const [qrType, setQrType] = useState<QRCodeType>(initialType);
  const [qrData, setQrData] = useState<QRCodeData>({});
  const [qrOptions, setQrOptions] = useState<QRGenerationOptions>({
    size: 300,
    margin: 4,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M'
  });
  const [generatedQR, setGeneratedQR] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHome, setShowHome] = useState(false);

  // Handle the back to home functionality
  if (showHome) {
    window.location.reload();
    return null;
  }

  const handleDataChange = (field: string, value: string) => {
    setQrData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (value: string) => {
    setQrType(value as QRCodeType);
    setQrData({});
    setGeneratedQR('');
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const qrCodeUrl = await generateQRCode(qrType, qrData, qrOptions);
      setGeneratedQR(qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (generatedQR) {
      try {
        await downloadQRCode(generatedQR, `qr-${qrType}-${Date.now()}.png`);
      } catch (error) {
        console.error('Error downloading QR code:', error);
      }
    }
  };

  const renderFormFields = () => {
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
                value={qrData.url || ''}
                onChange={(e) => handleDataChange('url', e.target.value)}
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
                value={qrData.email || ''}
                onChange={(e) => handleDataChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={qrData.subject || ''}
                onChange={(e) => handleDataChange('subject', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="body">Message (Optional)</Label>
              <Textarea
                id="body"
                placeholder="Email message"
                value={qrData.body || ''}
                onChange={(e) => handleDataChange('body', e.target.value)}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                placeholder="Enter your text here"
                value={qrData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
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
                value={qrData.phone || ''}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={qrData.phone || ''}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="SMS message"
                value={qrData.message || ''}
                onChange={(e) => handleDataChange('message', e.target.value)}
              />
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={qrData.phone || ''}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="WhatsApp message"
                value={qrData.message || ''}
                onChange={(e) => handleDataChange('message', e.target.value)}
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
                value={qrData.ssid || ''}
                onChange={(e) => handleDataChange('ssid', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="WiFi Password"
                value={qrData.password || ''}
                onChange={(e) => handleDataChange('password', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="encryption">Security Type</Label>
              <Select value={qrData.encryption || 'WPA'} onValueChange={(value) => handleDataChange('encryption', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={qrData.firstName || ''}
                  onChange={(e) => handleDataChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={qrData.lastName || ''}
                  onChange={(e) => handleDataChange('lastName', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                placeholder="Company Name"
                value={qrData.organization || ''}
                onChange={(e) => handleDataChange('organization', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={qrData.phone || ''}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                value={qrData.email || ''}
                onChange={(e) => handleDataChange('email', e.target.value)}
              />
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                placeholder="Event Title"
                value={qrData.eventName || ''}
                onChange={(e) => handleDataChange('eventName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="Event Location"
                value={qrData.location || ''}
                onChange={(e) => handleDataChange('location', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={qrData.startDate || ''}
                  onChange={(e) => handleDataChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={qrData.endDate || ''}
                  onChange={(e) => handleDataChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => setShowHome(true)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <QrCode className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">QR Generator</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* QR Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Choose QR Code Type</CardTitle>
                <CardDescription>Select the type of QR code you want to create</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={qrType} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">Website URL</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="sms">SMS Message</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="wifi">WiFi Network</SelectItem>
                    <SelectItem value="vcard">Contact Card</SelectItem>
                    <SelectItem value="event">Calendar Event</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Content Form */}
            <Card>
              <CardHeader>
                <CardTitle>2. Enter Content</CardTitle>
                <CardDescription>Fill in the required information for your QR code</CardDescription>
              </CardHeader>
              <CardContent>
                {renderFormFields()}
                <div className="mt-6">
                  <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                    {isGenerating ? 'Generating...' : 'Generate QR Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  3. Customize Appearance
                </CardTitle>
                <CardDescription>Adjust the visual style of your QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foregroundColor">Foreground Color</Label>
                    <Input
                      id="foregroundColor"
                      type="color"
                      value={qrOptions.foregroundColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, foregroundColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={qrOptions.backgroundColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="size">Size (pixels)</Label>
                  <Input
                    id="size"
                    type="number"
                    min="100"
                    max="1000"
                    value={qrOptions.size}
                    onChange={(e) => setQrOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
                <CardDescription>Your generated QR code will appear here</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {generatedQR ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img src={generatedQR} alt="Generated QR Code" className="border rounded-lg" />
                    </div>
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Generate a QR code to see preview</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;

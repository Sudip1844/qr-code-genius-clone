
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  QrCode, 
  Download,
  Link as LinkIcon
} from "lucide-react";
import QRGenerator from "@/components/QRGenerator";
import { QRCodeType } from "@/types/qr-types";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedQRType, setSelectedQRType] = useState<QRCodeType>('url');
  const [url, setUrl] = useState('');

  const handleSelectQRType = (type: QRCodeType) => {
    setSelectedQRType(type);
    setShowGenerator(true);
  };

  const handleQuickGenerate = () => {
    if (url.trim()) {
      setSelectedQRType('url');
      setShowGenerator(true);
    }
  };

  if (showGenerator) {
    return <QRGenerator initialType={selectedQRType} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">QR Generator</h1>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Preview Area */}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Preview QR Code</h3>
              <div className="w-32 h-32 mx-auto bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            </div>

            {/* Content/Design Tabs */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content" className="text-sm">1 Content</TabsTrigger>
                <TabsTrigger value="design" className="text-sm">2 Design</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4 mt-4">
                {/* QR Type Selector */}
                <div className="space-y-2">
                  <Select defaultValue="url" onValueChange={(value) => setSelectedQRType(value as QRCodeType)}>
                    <SelectTrigger className="bg-green-50 border-green-200">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-green-600" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">Link</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="wifi">WiFi</SelectItem>
                      <SelectItem value="vcard">Contact Card</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                    Enter your Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-gray-500"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="space-y-4 mt-4">
                <div className="text-center text-gray-500 py-8">
                  <p>Design customization options will appear here</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Generate Button */}
            <Button 
              onClick={handleQuickGenerate}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white"
              disabled={!url.trim()}
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>

            {/* Quick Access to Other QR Types */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">Or choose a specific QR type:</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'email' as QRCodeType, label: 'Email', icon: '📧' },
                  { type: 'wifi' as QRCodeType, label: 'WiFi', icon: '📶' },
                  { type: 'vcard' as QRCodeType, label: 'Contact', icon: '👤' },
                  { type: 'text' as QRCodeType, label: 'Text', icon: '📝' },
                  { type: 'phone' as QRCodeType, label: 'Phone', icon: '📞' },
                  { type: 'sms' as QRCodeType, label: 'SMS', icon: '💬' }
                ].map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectQRType(item.type)}
                    className="flex flex-col h-16 text-xs"
                  >
                    <span className="text-lg mb-1">{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

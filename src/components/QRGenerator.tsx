
import { useState, useEffect } from 'react';
import { generateQRCode, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR } from '@/lib/qr-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Link as LinkIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const QRGenerator = () => {
  const [qrData, setQrData] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const generateQR = async () => {
    if (!qrData.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const finalData = createUrlQR(qrData);
      
      const options: QROptions = {
        data: finalData,
        size: 300,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
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
    // Generate a default QR code on initial load
    generateQR();
  }, []);

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
            <div className="mb-6 bg-emerald-50 p-4 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-emerald-700">Link</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div className="space-y-4 mb-6">
              <Label htmlFor="website" className="block text-slate-700">Enter your Website</Label>
              <div className="flex rounded-md overflow-hidden border">
                <div className="bg-slate-50 px-3 py-2 text-slate-500 border-r">https://</div>
                <Input
                  id="website"
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  placeholder="example.com"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <Button 
              onClick={downloadQR}
              disabled={!qrCode || loading}
              className="w-full py-6 bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
              variant="ghost"
            >
              <Download className="mr-2 h-5 w-5" /> 
              Download QR Code
            </Button>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="text-center p-6">
            <p className="text-slate-500">Design options will be available here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;

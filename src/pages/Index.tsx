
import QRGenerator from "@/components/QRGenerator";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <QrCode className="h-7 w-7 text-primary" />
              <span>QR <span className="text-primary">Code</span> Generator</span>
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started Free</Button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Create Professional QR Codes</h2>
              <p className="text-xl text-slate-600">
                Generate QR codes for URLs, text, contact information, and more.
                Customize colors and download in high quality.
              </p>
            </div>
            
            <QRGenerator />
          </div>
        </section>
        
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-sm border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Select QR Type</h3>
                  <p className="text-slate-600 text-center">
                    Choose from URL, text, email, or phone number to create the perfect QR code for your needs
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-8 shadow-sm border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Customize Design</h3>
                  <p className="text-slate-600 text-center">
                    Personalize colors, size, and error correction to match your brand and style
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-8 shadow-sm border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Download & Share</h3>
                  <p className="text-slate-600 text-center">
                    Get your QR code as a high-quality image ready to use in print or digital media
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to create professional QR codes?</h2>
              <p className="text-xl text-slate-600 mb-8">
                Generate unlimited QR codes for your business, marketing campaigns, or personal use.
              </p>
              <Button size="lg" className="gap-2 py-6 px-8 text-lg">
                Create Your QR Code <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                <QrCode className="h-5 w-5 text-primary" />
                QR Code Generator
              </h3>
              <p className="text-slate-600">
                Create custom QR codes quickly and easily for any purpose.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">QR Code Types</h4>
              <ul className="space-y-2 text-slate-600">
                <li>URL QR Codes</li>
                <li>Text QR Codes</li>
                <li>Email QR Codes</li>
                <li>Phone QR Codes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-600">
                <li>Help Center</li>
                <li>Tutorials</li>
                <li>API Documentation</li>
                <li>Contact Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li>About Us</li>
                <li>Blog</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-slate-500">
            <p>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import QRGenerator from "@/components/QRGenerator";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">QR</span> Code Generator
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Register Free</Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-4xl font-bold mb-4">Create Your Custom QR Codes</h2>
            <p className="text-xl text-muted-foreground">
              Generate QR codes for URLs, text, contact information, and more.
              Customize colors and download in high quality.
            </p>
          </div>
          
          <QRGenerator />
        </section>
        
        <section className="py-16 bg-gray-50 -mx-4 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Enter Your Content</h3>
                <p className="text-muted-foreground">
                  Add your URL, text, or contact information to generate a QR code
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Customize Your QR Code</h3>
                <p className="text-muted-foreground">
                  Change colors, size, and error correction levels to match your brand
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Download & Share</h3>
                <p className="text-muted-foreground">
                  Get your QR code as a high-quality PNG image ready to use anywhere
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to create professional QR codes?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Generate unlimited QR codes for your business, marketing campaigns, or personal use.
            </p>
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">QR Code Generator</h3>
              <p className="text-muted-foreground">
                Create custom QR codes quickly and easily for any purpose.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>URL QR Codes</li>
                <li>Text QR Codes</li>
                <li>Custom Colors</li>
                <li>High Resolution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Help Center</li>
                <li>Tutorials</li>
                <li>API Documentation</li>
                <li>Contact Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About Us</li>
                <li>Blog</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

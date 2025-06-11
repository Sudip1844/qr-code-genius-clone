import QRGenerator from "@/components/QRGenerator";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, MessageCircle, UserSquare, Briefcase, Megaphone, MousePointer, FileEdit, Send, Smartphone, List, Image, CheckCircle, Menu, X } from "lucide-react";
import { Link, Mail, Text, Phone, MessageSquare, Wifi, UserSquare as VCard, CalendarDays } from "lucide-react";
import { useRef, useState } from "react";

const Index = () => {
  const qrGeneratorRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleQRTypeSelect = (type: string) => {
    // Scroll to QR generator section
    qrGeneratorRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // Trigger QR type selection in the generator
    const event = new CustomEvent('qrTypeSelect', { detail: { type } });
    window.dispatchEvent(event);
  };

  const scrollToQRGenerator = () => {
    qrGeneratorRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Create refs for all sections
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutQRRef = useRef<HTMLDivElement>(null);
  const howToUseRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const qrTypesRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { label: "QR Generator", ref: qrGeneratorRef },
    { label: "Features", ref: featuresRef },
    { label: "About QR Codes", ref: aboutQRRef },
    { label: "How to Use", ref: howToUseRef },
    { label: "Why Choose QR.io", ref: benefitsRef },
    { label: "QR Code Types", ref: qrTypesRef }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="py-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="w-full px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="text-emerald-500">
                <QrCode className="h-7 w-7" />
              </div>
              <span className="text-slate-700">QR.io</span>
            </h1>
            <div className="relative">
              <button 
                className="block md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              
              {/* Mobile Menu */}
              {mobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          scrollToSection(item.ref);
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="w-full py-8">
        <div ref={qrGeneratorRef} className="px-4">
          <QRGenerator />
        </div>
        
        {/* Features section */}
        <div ref={featuresRef} className="mt-16 py-16 px-4 bg-white rounded-lg shadow-sm mx-4">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Powerful Features for Your QR Code Needs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Create, customize, and track your QR codes with our comprehensive suite of professional features
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <Smartphone className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">Custom Landing Pages</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <List className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">Advanced Analytics</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
              </div>
              <h3 className="font-medium text-lg text-slate-700">Design Customization</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <Image className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">Logo Integration</h3>
            </div>
          </div>
        </div>
        
        {/* What are QR Codes section */}
        <div ref={aboutQRRef} className="mt-16 py-16 px-4 bg-emerald-500 text-white rounded-lg mx-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-medium mb-3">What are QR Codes?</h2>
            <h3 className="text-4xl font-bold mb-6">QR stands for 'Quick Response'</h3>
            
            <p className="mb-6 text-lg opacity-90">
              QR Codes were invented in 1994 by Denso Wave for tracking automotive parts during manufacturing. 
              They gained massive popularity with the rise of smartphones, making it possible to scan codes 
              directly with your phone's camera.
            </p>
            
            <p className="mb-8 text-lg opacity-90">
              Today, QR Codes have revolutionized how we share information instantly. Let me show you the key 
              benefits and most popular QR Code applications that can transform your business.
            </p>
            
            <Button 
              variant="default" 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={scrollToQRGenerator}
            >
              Create QR Code <ArrowUp className="ml-2 rotate-45" />
            </Button>
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <MessageCircle size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Collect Customer Feedback</h4>
                <p className="text-slate-600">
                  Enable instant feedback collection by directing customers to review forms or surveys when they scan your QR Code.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <UserSquare size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Digital Business Cards</h4>
                <p className="text-slate-600">
                  Replace traditional paper business cards with smart digital profiles that can be instantly 
                  saved to contacts with a simple scan.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <Briefcase size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Business Information Hub</h4>
                <p className="text-slate-600">
                  Direct customers to detailed business information, instructions, or service pages 
                  to enhance their experience with your brand.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <Megaphone size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Event Promotion & Offers</h4>
                <p className="text-slate-600">
                  Promote special events, share exclusive discount codes, or announce limited-time 
                  offers through engaging QR Code campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* How to Use section */}
        <div ref={howToUseRef} className="mt-16 py-16 px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
              How to Use
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Creating QR Codes with QR.io is Simple and Fast
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes with our intuitive QR Code generator. Create unlimited dynamic and static QR Codes for any purpose.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col md:flex-row items-center mb-24">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">1. Choose QR Code Type</h3>
                <p className="text-slate-600 text-lg">
                  Select from 9 different QR Code types including URL, Email, WiFi, VCard, and more. 
                  Each type is optimized for specific use cases.
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <MousePointer className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-24">
              <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0 md:text-left">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">2. Fill Required Information</h3>
                <p className="text-slate-600 text-lg">
                  Enter the specific information for your chosen QR Code type. For example, 
                  a URL QR Code requires a website link, while a WiFi QR Code needs network credentials.
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <FileEdit className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 md:pr-12"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">3. Download & Share</h3>
                <p className="text-slate-600 text-lg">
                  Generate your QR Code instantly, download it in high quality, and start sharing. 
                  You can always come back to edit or track its performance.
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <Send className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={scrollToQRGenerator}
            >
              Start Creating <ArrowUp className="ml-2 rotate-45" />
            </Button>
          </div>
        </div>
        
        {/* Benefits from QR.io section */}
        <div ref={benefitsRef} className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Why Choose QR.io?</h2>
            
            <p className="mb-4 text-slate-600 text-lg">
              QR.io provides comprehensive analytics to track scan rates, locations, and timing data for all your QR Codes. 
              Make data-driven decisions to optimize your campaigns.
            </p>
            
            <p className="mb-8 text-slate-600 text-lg">
              Create stunning, fully customized landing pages for your QR Codes without any coding knowledge. 
              Our drag-and-drop interface makes professional design accessible to everyone.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Dynamic QR Codes with real-time editing</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Static QR Codes for permanent content</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Detailed analytics and scan tracking</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Custom landing pages and branding</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Color and shape customization</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">No coding or technical skills required</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">9+</div>
                  <div className="text-slate-600">QR Code Types</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                  <div className="text-slate-600">Unlimited Scans</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-slate-600">Analytics Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* QR Code Types section */}
        <div ref={qrTypesRef} className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">QR Code Types</h2>
            <p className="text-center text-slate-600 mb-12">Choose from our comprehensive collection of QR Code types for any business need.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Link QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-emerald-500 mb-4">
                  <Link className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Website URL</h3>
                <p className="text-slate-600 mb-4">Direct users to any website or landing page</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('url')}
                >
                  Select
                </Button>
              </div>
              
              {/* Email QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <Mail className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Email</h3>
                <p className="text-slate-600 mb-4">Pre-compose emails with subject and message</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('email')}
                >
                  Select
                </Button>
              </div>
              
              {/* Text QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-orange-500 mb-4">
                  <Text className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Plain Text</h3>
                <p className="text-slate-600 mb-4">Share any text message or information</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('text')}
                >
                  Select
                </Button>
              </div>
              
              {/* Call QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-emerald-500 mb-4">
                  <Phone className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Phone Call</h3>
                <p className="text-slate-600 mb-4">Enable one-tap calling to your number</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('phone')}
                >
                  Select
                </Button>
              </div>
              
              {/* SMS QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <MessageSquare className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">SMS Message</h3>
                <p className="text-slate-600 mb-4">Send pre-written text messages</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('sms')}
                >
                  Select
                </Button>
              </div>
              
              {/* WhatsApp QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-green-500 mb-4">
                  <MessageSquare className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">WhatsApp</h3>
                <p className="text-slate-600 mb-4">Start WhatsApp conversations instantly</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('whatsapp')}
                >
                  Select
                </Button>
              </div>
              
              {/* WiFi QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-emerald-500 mb-4">
                  <Wifi className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">WiFi Network</h3>
                <p className="text-slate-600 mb-4">Share WiFi credentials for easy connection</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('wifi')}
                >
                  Select
                </Button>
              </div>
              
              {/* VCard QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <VCard className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Contact Card</h3>
                <p className="text-slate-600 mb-4">Save contact information to phone</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('vcard')}
                >
                  Select
                </Button>
              </div>
              
              {/* Event QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-orange-500 mb-4">
                  <CalendarDays className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Calendar Event</h3>
                <p className="text-slate-600 mb-4">Add events directly to calendar apps</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('event')}
                >
                  Select
                </Button>
              </div>
              
              {/* Image QR - NEW */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-purple-500 mb-4">
                  <Image className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Image</h3>
                <p className="text-slate-600 mb-4">Embed images directly into QR codes</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('image')}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t mt-16 bg-white">
        <div className="w-full px-4">
          <div className="text-center text-slate-500">
            <p>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

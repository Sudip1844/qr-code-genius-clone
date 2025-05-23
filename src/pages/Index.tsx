import QRGenerator from "@/components/QRGenerator";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, MessageCircle, UserSquare, Briefcase, Megaphone, MousePointer, FileEdit, Send, Smartphone, List, Image } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="py-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="text-emerald-500">
                <QrCode className="h-7 w-7" />
              </div>
              <span className="text-slate-700">QR.io</span>
            </h1>
            <button className="block md:hidden">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
            <QRGenerator />
          </div>
          
          {/* What are QR Codes section */}
          <div className="mt-16 py-16 px-4 bg-emerald-500 text-white rounded-lg">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-medium mb-3">What are QR Codes?</h2>
              <h3 className="text-4xl font-bold mb-6">QR Codes stands for 'Quick Response'</h3>
              
              <p className="mb-6 text-lg opacity-90">
                They were created in 1994 by Denso Wave to track vehicles during manufacturing. They quickly
                gained popularity when it spread to smartphones. You can now even scan QR Codes from your
                phone camera.
              </p>
              
              <p className="mb-8 text-lg opacity-90">
                I will break down some of the benefits from using QR Codes and the most requested QR Codes
                features.
              </p>
              
              <Button 
                variant="default" 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Generate QR Code <ArrowUp className="ml-2 rotate-45" />
              </Button>
              
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="text-slate-500 p-4">
                      <MessageCircle size={48} />
                    </div>
                  </div>
                  <h4 className="text-slate-700 text-xl font-medium mb-4">Gather Feedback</h4>
                  <p className="text-slate-600">
                    You can ask users to give some feedback when they scan the QR Code.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="text-slate-500 p-4">
                      <UserSquare size={48} />
                    </div>
                  </div>
                  <h4 className="text-slate-700 text-xl font-medium mb-4">Profile Cards</h4>
                  <p className="text-slate-600">
                    Physical profile cards are every day more rare and digital profile cards are a great
                    alternative.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="text-slate-500 p-4">
                      <Briefcase size={48} />
                    </div>
                  </div>
                  <h4 className="text-slate-700 text-xl font-medium mb-4">Describe your Business</h4>
                  <p className="text-slate-600">
                    You can redirect your clients to some instruction page for your business when
                    they scan the QR Code.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="text-slate-500 p-4">
                      <Megaphone size={48} />
                    </div>
                  </div>
                  <h4 className="text-slate-700 text-xl font-medium mb-4">Promote Events & Discounts</h4>
                  <p className="text-slate-600">
                    You can promote any event or give discount codes when people scan the QR
                    Code.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* How to Use section */}
          <div className="mt-16 py-16">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
                How to Use
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Creating QR Codes with QR.io is pretty simple.
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Create an account and use our QR Code Generator to create unlimited dynamic & static QR Codes.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col md:flex-row items-center mb-24">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Choose QR Code Type</h3>
                  <p className="text-slate-600">
                    First step would be to choose your QR Code Type. This will define what your QR Code will do.
                  </p>
                </div>
                <div className="rounded-full w-12 h-12 bg-white border-4 border-emerald-500 flex items-center justify-center z-20">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 flex justify-start md:justify-center">
                  <div className="border-2 border-emerald-500 rounded-full p-12 relative">
                    <div className="text-blue-800">
                      <MousePointer className="h-12 w-12" />
                    </div>
                    <span className="absolute bottom-4 text-sm text-blue-800 font-medium">Choose QR Code Type</span>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-24">
                <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0 md:text-left">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Fill required fields</h3>
                  <p className="text-slate-600">
                    Then, you'll need to fill the required fields that the QR Code type is asking. For example, Type 'Link' will ask for a website URL.
                  </p>
                </div>
                <div className="rounded-full w-12 h-12 bg-white border-4 border-emerald-500 flex items-center justify-center z-20">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                </div>
                <div className="md:w-1/2 md:pr-12 flex justify-end md:justify-center">
                  <div className="border-2 border-emerald-500 rounded-full p-12 relative">
                    <div className="text-blue-800">
                      <FileEdit className="h-12 w-12" />
                    </div>
                    <span className="absolute bottom-4 text-sm text-blue-800 font-medium">Fill required fields</span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Download & Share QR Code</h3>
                  <p className="text-slate-600">
                    Finally, you can download and share your QR Code Generated from your dashboard and edit if needed.
                  </p>
                </div>
                <div className="rounded-full w-12 h-12 bg-white border-4 border-emerald-500 flex items-center justify-center z-20">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 flex justify-start md:justify-center">
                  <div className="border-2 border-emerald-500 rounded-full p-12 relative">
                    <div className="text-blue-800">
                      <Send className="h-12 w-12" />
                    </div>
                    <span className="absolute bottom-4 text-sm text-blue-800 font-medium">Download & Share QR Code</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 text-center">
              <Button 
                variant="default" 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Generate QR Code <ArrowUp className="ml-2 rotate-45" />
              </Button>
            </div>
          </div>
          
          <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <Smartphone className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">Fully customized landing pages</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <List className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">QR Code Statistics</h3>
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
              <h3 className="font-medium text-lg text-slate-700">Customized Colors & Shapes for QR Codes</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <Image className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">Add Logos to QR Codes</h3>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t mt-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-500">
            <p>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

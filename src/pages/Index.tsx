
import QRGenerator from "@/components/QRGenerator";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, MessageCircle, ProfileCards, Briefcase, Megaphone } from "lucide-react";

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
                      <ProfileCards size={48} />
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
          
          <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-slate-700">Fully customized landing pages</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3" y2="6" />
                  <line x1="3" y1="12" x2="3" y2="12" />
                  <line x1="3" y1="18" x2="3" y2="18" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-slate-700">QR Code Statistics</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-slate-700">Customized Colors & Shapes for QR Codes</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polygon points="21 15 16 10 5 21" />
                </svg>
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

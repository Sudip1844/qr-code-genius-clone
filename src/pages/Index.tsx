import QRGenerator from "@/components/QRGenerator";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, MessageCircle, UserSquare, Briefcase, Megaphone, MousePointer, FileEdit, Send, Smartphone, List, Image, CheckCircle } from "lucide-react";
import { Link, Mail, Text, Phone, MessageSquare, Wifi, UserSquare as VCard, CalendarDays } from "lucide-react";

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
          
          {/* Features section */}
          <div className="mt-16 py-16 px-4 bg-white rounded-lg shadow-sm">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
                Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Everything you need for your QR Codes
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Create, customize, and track your QR codes with our powerful features
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
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
          
          {/* Benefits from QR.io section */}
          <div className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Benefits from QR.io</h2>
              
              <p className="mb-4 text-slate-600">
                By using QR.io you will be able to keep track of how many people scan your QR Codes, from where and on what date.
              </p>
              
              <p className="mb-8 text-slate-600">
                Also, for those non-developers, you can create fully customized landing pages for your QR Codes. No Coding Required!
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-slate-700">Dynamic QR Codes</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-slate-700">Static QR Codes</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-slate-700">QR Code Statistics</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-slate-700">Fully customized landing pages</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-slate-700">Customized Colors & Shapes for QR Codes</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-slate-700">No Coding Required</span>
                </div>
              </div>
              
              <div className="mt-10">
                <img 
                  src="/lovable-uploads/6c1a237f-3ff5-4930-b9cb-496fbe82304f.png"
                  alt="QR Code Customization Features" 
                  className="rounded-lg shadow-md mx-auto"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            </div>
          </div>
          
          {/* QR Code Types section */}
          <div className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">QR Code Types</h2>
              <p className="text-center text-slate-600 mb-12">Different QR Code types you can use for Static QR Codes.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Link QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-emerald-500 mb-4">
                    <Link className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Link</h3>
                  <p className="text-slate-600 mb-4">Link to any Website URL</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* Email QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-blue-600 mb-4">
                    <Mail className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">E-mail</h3>
                  <p className="text-slate-600 mb-4">Send an email</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* Text QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-orange-500 mb-4">
                    <Text className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Text</h3>
                  <p className="text-slate-600 mb-4">Share Text</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* Call QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-emerald-500 mb-4">
                    <Phone className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Call</h3>
                  <p className="text-slate-600 mb-4">Make a call</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* SMS QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-blue-600 mb-4">
                    <MessageSquare className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">SMS</h3>
                  <p className="text-slate-600 mb-4">Send message</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* WhatsApp QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-orange-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 11.9a7.977 7.977 0 0 1 .904-3.687l-1.147-3.280 3.299 1.144a8 8 0 1 1 4.949 10.019" />
                      <path d="M8.73 14.633a29.667 29.667 0 0 0 5.871-2.283 10.079 10.079 0 0 0 3.12-2.885C18.723 8.421 19 7.277 19 6.166c0-2.089-1.09-3.313-2.949-3.313-1.036 0-1.797.248-2.285.741" />
                      <path d="M9.865 5.766c-.784.975-.995 2.252-.995 3.152 0 1.086.287 2.033.913 2.826.678.855 1.092 1.434 2.063 2.132 1.001.72 2.440 1.239 4.12 1.239 1.575 0 2.735-.465 3.421-1.211.69-.758.991-1.791.991-2.92 0-1.215-.347-2.209-.968-2.78-.502-.465-.97-.636-1.906-.636-1.992 0-3.444.943-3.444 2.328" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">WhatsApp</h3>
                  <p className="text-slate-600 mb-4">Send WhatsApp message</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* WiFi QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-emerald-500 mb-4">
                    <Wifi className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">WI-FI</h3>
                  <p className="text-slate-600 mb-4">Connect to WI-FI</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* VCard QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-blue-600 mb-4">
                    <VCard className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Vcard</h3>
                  <p className="text-slate-600 mb-4">Save a contact to the phone scanning</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
                
                {/* Event QR */}
                <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="text-orange-500 mb-4">
                    <CalendarDays className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Event</h3>
                  <p className="text-slate-600 mb-4">Invite people to your event</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Choose</Button>
                </div>
              </div>
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

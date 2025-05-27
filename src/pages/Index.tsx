
import QRGenerator from "@/components/QRGenerator";
import { QrCode } from "lucide-react";

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
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
            <QRGenerator />
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

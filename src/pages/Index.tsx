
import QRGenerator from "@/components/QRGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <header className="py-6 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            <span className="text-primary">QR</span> Code Generator
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Create your custom QR codes quickly and easily
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <QRGenerator />
        
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Content</h3>
              <p className="text-muted-foreground">
                Add your URL, text, or contact information
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize</h3>
              <p className="text-muted-foreground">
                Change colors, size, and error correction levels
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download</h3>
              <p className="text-muted-foreground">
                Get your QR code as a high-quality PNG image
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

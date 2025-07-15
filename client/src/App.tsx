import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/url-to-qr" element={<Index qrType="url" />} />
          <Route path="/email-to-qr" element={<Index qrType="email" />} />
          <Route path="/text-to-qr" element={<Index qrType="text" />} />
          <Route path="/phone-to-qr" element={<Index qrType="phone" />} />
          <Route path="/sms-to-qr" element={<Index qrType="sms" />} />
          <Route path="/whatsapp-to-qr" element={<Index qrType="whatsapp" />} />
          <Route path="/wifi-to-qr" element={<Index qrType="wifi" />} />
          <Route path="/contact-to-qr" element={<Index qrType="vcard" />} />
          <Route path="/event-to-qr" element={<Index qrType="event" />} />
          <Route path="/image-to-qr" element={<Index qrType="image" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generateSiteLinks } from "@/lib/seo-config";

interface SiteLinksProps {
  currentType?: string;
}

const SiteLinks = ({ currentType }: SiteLinksProps) => {
  const siteLinks = generateSiteLinks(currentType);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <h3 className="text-sm font-semibold mb-3 text-center">অন্যান্য QR সার্ভিস</h3>
      <div className="grid grid-cols-2 gap-2">
        {siteLinks.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className="block"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs p-2 h-auto text-left"
            >
              <div className="truncate">
                {link.title}
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SiteLinks;
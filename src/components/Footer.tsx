import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-gradient-dark text-secondary">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-extrabold text-xl mb-4">
            <span className="text-gradient-hero">Bulk</span>
            <span className="text-secondary">ur</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Pakistan's leading B2B wholesale marketplace connecting verified suppliers with buyers worldwide.</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@bulkur.pk</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +92 300 1234567</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lahore, Pakistan</div>
          </div>
        </div>
        {[
          { title: "Marketplace", links: [{ label: "Browse Products", to: "/products" }, { label: "Verified Suppliers", to: "/products" }, { label: "Post RFQ", to: "/" }, { label: "Categories", to: "/products" }] },
          { title: "For Sellers", links: [{ label: "Sell on Bulkur", to: "/seller/dashboard" }, { label: "Seller Dashboard", to: "/seller/dashboard" }, { label: "Pricing Plans", to: "/" }, { label: "Success Stories", to: "/" }] },
          { title: "Support", links: [{ label: "Help Center", to: "/" }, { label: "Contact Us", to: "/" }, { label: "Terms of Service", to: "/" }, { label: "Privacy Policy", to: "/" }] },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="font-display font-bold mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
        © 2026 Bulkur. All rights reserved. Made with ❤️ in Pakistan.
      </div>
    </div>
  </footer>
);

export default Footer;
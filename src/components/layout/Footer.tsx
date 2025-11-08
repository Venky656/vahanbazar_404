import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    support: [
      { label: 'Help & Support', href: '/help' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    services: [
      { label: 'Buy Vehicle', href: '/vehicles' },
      { label: 'Sell Vehicle', href: '/sell' },
      { label: 'EMI Calculator', href: '/emi-calculator' },
      { label: 'Find Dealers', href: '/dealers' },
    ],
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <span className="font-inter font-bold text-xl text-foreground">
                VahanBazar
              </span>
            </Link>
            <p className="text-muted-foreground font-open-sans max-w-md">
              Your complete two-wheeler marketplace. Discover, compare, and buy motorcycles, 
              scooters, and electric vehicles with confidence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="font-open-sans text-sm">info@vahanbazar.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="font-open-sans text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="font-open-sans text-sm">Prakasam, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-inter font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground font-open-sans text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-inter font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground font-open-sans text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h3 className="font-inter font-semibold text-foreground">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground font-open-sans text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground font-open-sans text-sm">
              © 2024 VahanBazar. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-muted-foreground font-open-sans text-sm hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-muted-foreground font-open-sans text-sm hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-muted-foreground font-open-sans text-sm hover:text-primary transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
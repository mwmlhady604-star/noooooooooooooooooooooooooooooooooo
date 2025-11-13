import React from 'react';
import NavItem from './shared/NavItem';

const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Resources', href: '#resources' },
    { label: 'About Us', href: '#about' }
  ];

  const socialMedia = [
    { name: 'LinkedIn', href: '#' },
    { name: 'X', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'YouTube', href: '#' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' }
  ];

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <NavItem
                  key={link.label}
                  href={link.href}
                  className="text-primary-200 hover:text-white block"
                >
                  {link.label}
                </NavItem>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-primary-200">
              <p>Email: info@companyregai.com</p>
              <p>Phone: +964 XXX XXX XXXX</p>
              <p>Office: Baghdad, Iraq</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-primary-200 hover:text-white transition-colors duration-200"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-primary-200 hover:text-white block transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-200">
          <p>© 2025 CompanyReg AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
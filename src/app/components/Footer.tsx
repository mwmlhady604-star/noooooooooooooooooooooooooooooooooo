import React from 'react';
import NavItem from './shared/NavItem';

const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'الخدمات', href: '#services' },
    { label: 'كيف يعمل', href: '#how-it-works' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
    { label: 'الموارد', href: '#resources' },
    { label: 'من نحن', href: '#about' }
  ];

  const socialMedia = [
    { name: 'LinkedIn', href: '#' },
    { name: 'X', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'YouTube', href: '#' }
  ];

  const legalLinks = [
    { label: 'سياسة الخصوصية', href: '#' },
    { label: 'شروط الخدمة', href: '#' }
  ];

  return (
    <footer className="bg-zinc-900 bg-gradient-to-b from-zinc-900 to-black text-zinc-400 py-12 font-sans relative overflow-hidden">
      {/* Floating particles (simulated with absolute divs and pulse/bounce) */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-orange-500 rounded-full opacity-20 animate-pulse duration-[6000ms]"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-orange-400 rounded-full opacity-20 animate-bounce duration-[6000ms]"></div>
      <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-orange-600 rounded-full opacity-30 animate-pulse duration-[6000ms]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <NavItem
                  key={link.label}
                  href={link.href}
                  className="text-zinc-400 hover:text-orange transition-colors duration-200 block"
                >
                  {link.label}
                </NavItem>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
            <div className="space-y-2 text-zinc-400">
              <p>البريد الإلكتروني: info@tawtheef.iq</p>
             
              <p>المكتب: بغداد، العراق</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تابعنا</h3>
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-zinc-400 hover:text-orange transition-colors duration-200"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">قانوني</h3>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-zinc-400 hover:text-orange block transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500">
          <p>© 2026 توظيف — صناع بغداد</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
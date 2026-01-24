import React, { useState } from 'react';
import Button from './shared/Button';
import NavItem from './shared/NavItem';
import { FiPhone, FiPhoneOff, FiChevronDown } from "react-icons/fi";

type NavBarProps = {
  onToggleConnection: () => void;
};

// Define types for mega menu items
type MegaMenuItem = {
  title: string;
  items: {
    title: string;
    description: string;
    href: string;
    icon?: React.ReactNode;
  }[];
};

type MegaMenuContent = {
  [key: string]: MegaMenuItem[];
};

const NavBar: React.FC<NavBarProps> = ({ onToggleConnection }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navItems = [

    { label: 'تحميل الدليل (PDF)', href: '/brm.pdf', download: true },
    { label: 'من نحن', href: '#about' },
  ];

  // Mega menu content data
  const megaMenuContent: MegaMenuContent = {

  };

  const handleToggleConnection = () => {
    setIsConnected(!isConnected);
    onToggleConnection();
  };

  const handleMenuEnter = (label: string) => {
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 font-sans border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/makers-logo.svg" alt="CompanyReg AI Logo" className="h-10 w-auto" />
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                {...(megaMenuContent[item.label] ? {
                  onMouseEnter: () => handleMenuEnter(item.label),
                  onMouseLeave: handleMenuLeave
                } : {})}
              >
                <NavItem href={item.href} className="flex items-center text-[17px] font-medium text-zinc-600 hover:text-orange transition-colors" download={item.download}>
                  {item.label}
                  {megaMenuContent[item.label] && <FiChevronDown className="ml-2 h-4 w-4" />}
                </NavItem>

                {/* Mega Menu Dropdown */}
                {activeMenu === item.label && megaMenuContent[item.label] && (
                  <div className="absolute left-0 w-screen max-w-7xl bg-white shadow-xl rounded-b-lg border-t border-primary-100 mt-0 py-8 px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {megaMenuContent[item.label]?.map((section, index) => (
                        <div key={index}>
                          <h3 className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-4">
                            {section.title}
                          </h3>
                          <ul className="space-y-3">
                            {section.items.map((link, linkIndex) => (
                              <li key={linkIndex}>
                                <a
                                  href={link.href}
                                  className="flex items-start p-3 -m-3 rounded-lg hover:bg-primary-50 transition duration-150 ease-in-out"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  {link.icon && (
                                    <span className="mr-4 text-lg flex-shrink-0 mt-0.5 text-primary-500">{link.icon}</span>
                                  )}
                                  <div>
                                    <p className="text-base font-medium text-dark-800">{link.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Optional: CTA section at the bottom of the mega menu */}
                    {item.label === "Services" && (
                      <div className="mt-10 pt-8 border-t border-primary-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-dark-800">هل تحتاج مساعدة في تسجيلك؟</h3>
                            <p className="text-gray-600 mt-1">تحدث إلى خبراء التسجيل لدينا للمساعدة الشخصية</p>
                          </div>
                          <Button variant="primary" size="sm">
                            احصل على مساعدة الخبراء
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4 hidden ">
            {/* Toggle Connection Button */}
            <button
              onClick={handleToggleConnection}
              className={`p-2.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isConnected
                ? 'bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500'
                : 'bg-orange-50 text-orange hover:bg-orange-100 focus:ring-orange-400'
                }`}
              aria-label={isConnected ? "End Connection" : "Start Connection"}
            >
              {isConnected ? <FiPhoneOff size={20} /> : <FiPhone size={20} />}
            </button>


          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
import React, { useState } from 'react';
import Button from './shared/Button';
import NavItem from './shared/NavItem';
import { FiPhone, FiPhoneOff, FiChevronDown } from "react-icons/fi";

type NavBarProps = {
  onToggleConnection: () => void;
  userType?: string;
  onResetUserType?: () => void;
};

const userTypeLabels: Record<string, { label: string; icon: string }> = {
  individual_entrepreneur: { label: "رائد أعمال فردي", icon: "👤" },
  existing_company:        { label: "شركة قائمة",       icon: "🏢" },
  student_researcher:      { label: "طالب / باحث",      icon: "🎓" },
  consultant_employee:     { label: "مستشار / موظف",    icon: "💼" },
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

const NavBar: React.FC<NavBarProps> = ({ onToggleConnection, userType, onResetUserType }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navItems = [

    { label: 'تحميل الدليل (PDF)', href: '/brm.pdf', download: true },
    { label: 'من نحن', href: 'https://makersiq.org/about' },
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

          {/* User Type Chip */}
          {userType && userTypeLabels[userType] && (
            <button
              onClick={onResetUserType}
              title="تغيير نوع المستخدم"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium hover:bg-orange-100 hover:border-orange-400 transition-all duration-200 group"
            >
              <span>{userTypeLabels[userType].icon}</span>
              <span className="hidden sm:inline">{userTypeLabels[userType].label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          )}

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
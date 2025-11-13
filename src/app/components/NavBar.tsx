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
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Resources', href: '#resources' },
    { label: 'About Us', href: '#about' },
  ];

  // Mega menu content data
  const megaMenuContent: MegaMenuContent = {
    Services: [
      {
        title: "Registration Types",
        items: [
          { title: "LLC Registration", description: "Limited Liability Company setup", href: "#llc", icon: "🏢" },
          { title: "Branch Registration", description: "Foreign company branch setup", href: "#branch", icon: "🌍" },
          { title: "Partnership", description: "Business partnership registration", href: "#partnership", icon: "🤝" },
          { title: "Sole Proprietorship", description: "Individual business registration", href: "#sole-proprietorship", icon: "👤" },
        ]
      },
      {
        title: "Support Services",
        items: [
          { title: "Legal Consultation", description: "Expert legal advice", href: "#legal-consultation", icon: "⚖️" },
          { title: "Document Review", description: "Professional document checking", href: "#document-review", icon: "📄" },
          { title: "Government Liaison", description: "Assistance with official procedures", href: "#government-liaison", icon: "🏛️" },
          { title: "Post-registration", description: "Ongoing compliance support", href: "#post-registration", icon: "🔄" },
        ]
      }
    ],
    "How It Works": [
      {
        title: "Process Steps",
        items: [
          { title: "Initial Consultation", description: "Understand your business needs", href: "#consultation", icon: "💬" },
          { title: "Document Preparation", description: "Prepare all required documents", href: "#preparation", icon: "📝" },
          { title: "Submission", description: "Submit to relevant authorities", href: "#submission", icon: "📤" },
          { title: "Tracking", description: "Monitor application progress", href: "#tracking", icon: "📊" },
        ]
      },
      {
        title: "Timeline",
        items: [
          { title: "Express Service", description: "Fast-track registration in 3 days", href: "#express", icon: "⚡" },
          { title: "Standard Service", description: "Regular processing in 7 days", href: "#standard", icon: "⏱️" },
          { title: "Complex Cases", description: "Specialized handling for 15 days", href: "#complex", icon: "🔍" },
        ]
      }
    ],
    FAQ: [
      {
        title: "Common Questions",
        items: [
          { title: "Required Documents", description: "What you need to prepare", href: "#documents", icon: "📋" },
          { title: "Costs", description: "Registration fees and pricing", href: "#costs", icon: "💰" },
          { title: "Timeline", description: "How long does it take", href: "#timeline-faq", icon: "⏰" },
          { title: "Legal Requirements", description: "Compliance and regulations", href: "#legal", icon: "📜" },
        ]
      },
      {
        title: "Troubleshooting",
        items: [
          { title: "Rejected Applications", description: "How to handle rejections", href: "#rejected", icon: "❌" },
          { title: "Amendments", description: "Making changes to registration", href: "#amendments", icon: "✏️" },
          { title: "Renewals", description: "License renewal process", href: "#renewals", icon: "🔁" },
        ]
      }
    ],
    Resources: [
      {
        title: "Guides",
        items: [
          { title: "Registration Guide", description: "Complete step-by-step process", href: "#registration-guide", icon: "📖" },
          { title: "Legal Framework", description: "Iraqi business laws", href: "#legal-framework", icon: "⚖️" },
          { title: "Tax Information", description: "Tax obligations and procedures", href: "#tax-info", icon: "🧾" },
          { title: "Best Practices", description: "Tips for successful registration", href: "#best-practices", icon: "⭐" },
        ]
      },
      {
        title: "Tools",
        items: [
          { title: "Document Templates", description: "Downloadable forms", href: "#templates", icon: "📄" },
          { title: "Checklist Generator", description: "Custom registration checklists", href: "#checklist", icon: "✅" },
          { title: "Cost Calculator", description: "Estimate registration expenses", href: "#calculator", icon: "🧮" },
        ]
      }
    ],
    "About Us": [
      {
        title: "Company",
        items: [
          { title: "Our Story", description: "How we help businesses register", href: "#our-story", icon: "📖" },
          { title: "Team", description: "Meet our registration experts", href: "#team", icon: "👥" },
          { title: "Careers", description: "Join our mission", href: "#careers", icon: "💼" },
        ]
      },
      {
        title: "Connect",
        items: [
          { title: "Contact Us", description: "Get in touch for assistance", href: "#contact", icon: "📞" },
          { title: "Support", description: "Customer service hours", href: "#support", icon: "🎧" },
          { title: "Feedback", description: "Help us improve our service", href: "#feedback", icon: "💬" },
        ]
      }
    ]
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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-600">CompanyReg AI</h1>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className="relative"
                onMouseEnter={() => handleMenuEnter(item.label)}
                onMouseLeave={handleMenuLeave}
              >
                <NavItem href={item.href} className="flex items-center">
                  {item.label}
                  <FiChevronDown className="ml-1" size={16} />
                </NavItem>
                
                {/* Mega Menu Dropdown */}
                {activeMenu === item.label && (
                  <div className="absolute left-0 w-screen max-w-6xl bg-white shadow-xl rounded-b-lg border-t border-gray-100 mt-0 py-6 px-8">
                    <div className="grid grid-cols-3 gap-8">
                      {megaMenuContent[item.label]?.map((section, index) => (
                        <div key={index}>
                          <h3 className="text-sm font-semibold text-primary-900 uppercase tracking-wider mb-4">
                            {section.title}
                          </h3>
                          <ul className="space-y-4">
                            {section.items.map((link, linkIndex) => (
                              <li key={linkIndex}>
                                <a 
                                  href={link.href} 
                                  className="flex items-start p-2 -m-2 rounded-lg hover:bg-gray-50 transition duration-150"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  {link.icon && (
                                    <span className="mr-3 text-lg flex-shrink-0">{link.icon}</span>
                                  )}
                                  <div>
                                    <p className="text-base font-medium text-primary-900">{link.title}</p>
                                    <p className="text-sm text-gray-500 mt-1">{link.description}</p>
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
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-primary-900">Need help with your registration?</h3>
                            <p className="text-gray-500 mt-1">Talk to our registration experts for personalized guidance</p>
                          </div>
                          <Button variant="primary" size="sm">
                            Get Expert Help
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
          <div className="flex items-center space-x-4">
            {/* Toggle Connection Button */}
            <button
              onClick={handleToggleConnection}
              className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isConnected 
                  ? 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 focus:ring-secondary-500' 
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200 focus:ring-primary-500'
              }`}
              aria-label={isConnected ? "End Connection" : "Start Connection"}
            >
              {isConnected ? <FiPhoneOff size={20} /> : <FiPhone size={20} />}
            </button>

            {/* CTA Button */}
            <Button variant="primary" size="sm">
             My Account
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
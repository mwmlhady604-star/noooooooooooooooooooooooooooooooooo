import React from 'react';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, children, className = '' }) => {
  return (
    <a
      href={href}
      className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium ${className}`}
    >
      {children}
    </a>
  );
};

export default NavItem;
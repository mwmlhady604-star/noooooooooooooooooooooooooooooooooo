import React from 'react';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  download?: boolean; // Add download prop
}

const NavItem: React.FC<NavItemProps> = ({ href, children, className = '', download = false }) => {
  // Check if the href is for downloading a file
  const isDownloadLink = download || href.includes('githubusercontent') || href.endsWith('.pdf');
  
  return (
    <a
      href={href}
      className={`text-dark-800 hover:text-primary-500 transition-colors duration-200 font-medium font-montserrat ${className}`}
      {...(isDownloadLink ? { download: true } : {})}
    >
      {children}
    </a>
  );
};

export default NavItem;
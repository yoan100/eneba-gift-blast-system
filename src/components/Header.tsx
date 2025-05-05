
import React from 'react';

const Header = () => {
  return (
    <header className="bg-custom-purple py-4 px-6 flex justify-between items-center shadow-lg">
      <div className="flex items-center">
        <a href="https://www.eneba.com" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://s3.eu-central-1.amazonaws.com/co.lever.eu.client-logos/c77a4902-a703-4ef8-9e87-178cac8f7812-1633076860304.png" 
            alt="Eneba Logo" 
            className="h-12"
          />
        </a>
        <span className="ml-4 text-white font-medium hidden sm:inline">Official Gift Distribution</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="https://www.eneba.com/giveaways" className="text-white hover:text-custom-yellow hidden md:block">Giveaways</a>
        <a href="https://www.eneba.com/store" className="text-white hover:text-custom-yellow hidden md:block">Store</a>
        <div className="text-white">
          Need help? Click <a href="https://www.eneba.com/support" target="_blank" rel="noopener noreferrer" className="underline hover:text-custom-yellow">here</a>
        </div>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-custom-purple py-4 px-6 flex justify-between items-center">
      <a href="https://www.eneba.com" target="_blank" rel="noopener noreferrer">
        <img 
          src="https://s3.eu-central-1.amazonaws.com/co.lever.eu.client-logos/c77a4902-a703-4ef8-9e87-178cac8f7812-1633076860304.png" 
          alt="Eneba Logo" 
          className="h-12"
        />
      </a>
      <div className="text-white">
        Need help? Click <a href="https://www.eneba.com/support" target="_blank" rel="noopener noreferrer" className="underline">here</a>.
      </div>
    </header>
  );
};

export default Header;

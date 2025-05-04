
import axios from 'axios';

interface UserSystemInfo {
  ip: string;
  browser: string;
  os: string;
  device: string;
  language: string;
  screenSize: string;
  timeZone: string;
  referrer: string;
  userAgent: string;
}

export const getIpAddress = async (): Promise<string> => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'unknown';
  }
};

export const getUserSystemInfo = (): UserSystemInfo => {
  const userAgent = navigator.userAgent;
  
  // Get browser info
  let browser = 'Unknown';
  if (userAgent.indexOf('Firefox') > -1) browser = 'Mozilla Firefox';
  else if (userAgent.indexOf('SamsungBrowser') > -1) browser = 'Samsung Browser';
  else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) browser = 'Opera';
  else if (userAgent.indexOf('Trident') > -1) browser = 'Internet Explorer';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Microsoft Edge (Legacy)';
  else if (userAgent.indexOf('Edg') > -1) browser = 'Microsoft Edge (Chromium)';
  else if (userAgent.indexOf('Chrome') > -1) browser = 'Google Chrome';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  
  // Get OS info
  let os = 'Unknown';
  if (userAgent.indexOf('Win') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';
  
  // Get device type
  let device = 'Desktop';
  if (userAgent.indexOf('Mobi') > -1 || userAgent.indexOf('Android') > -1) device = 'Mobile';
  else if (userAgent.indexOf('iPad') > -1 || userAgent.indexOf('Tablet') > -1) device = 'Tablet';
  
  return {
    ip: 'Loading...',
    browser,
    os,
    device,
    language: navigator.language || 'Unknown',
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
    referrer: document.referrer || 'Direct',
    userAgent
  };
};

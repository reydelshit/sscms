import { useEffect } from 'react';

function useScreenShareDetection() {
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia)
      return;

    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;

    navigator.mediaDevices.getDisplayMedia = async function (constraints) {
      console.log('Screen share initiated');
      // You can send analytics or update state here
      return originalGetDisplayMedia.call(this, constraints);
    };

    return () => {
      navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
    };
  }, []);
}

export default useScreenShareDetection;

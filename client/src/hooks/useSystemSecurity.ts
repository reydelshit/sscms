import { useEffect, useRef, useState } from 'react';
import { toast } from './use-toast';

export function useSystemSecurity({
  password,
  onLogout,
}: {
  password: string;
  onLogout: () => void;
}) {
  const [locked, setLocked] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const modalTimer = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (modalTimer.current) clearTimeout(modalTimer.current);

    inactivityTimer.current = setTimeout(() => setLocked(true), 5 * 60 * 1000); // 5 mins
    // inactivityTimer.current = setTimeout(() => setLocked(true), 10 * 1000); // 10 seconds

    modalTimer.current = setTimeout(
      () => {
        if (locked) onLogout(); // 15 mins locked = auto logout
      },
      15 * 60 * 1000, //15 mins
      // 20 * 1000, // 20 seconds
    );
  };

  const handleUnlock = () => {
    if (inputPassword === password) {
      setLocked(false);
      setInputPassword('');
      setAttempts(0);
      resetInactivityTimer();
    } else {
      setAttempts((prev) => prev + 1);
      toast({
        title: 'Incorrect Password',
        description: `Attempt ${attempts + 1} of 3`,
        variant: 'destructive',
      });

      if (attempts + 1 >= 3) onLogout();
    }
  };

  // Detect screen recorders / debugger
  useEffect(() => {
    const detectDevTools = () => {
      const start = new Date().getTime();
      debugger;
      const end = new Date().getTime();
      if (end - start > 150) {
        toast({
          title: 'Warning',
          description: 'DevTools detected!',
          variant: 'destructive',
        });
      }
    };

    // const checkRecordingDevices = () => {
    //   navigator.mediaDevices?.enumerateDevices().then((devices) => {
    //     console.log(devices);
    //     const screenSharing = devices.some((d) =>
    //       d.label.toLowerCase().includes('screen'),
    //     );
    //     if (screenSharing) {
    //       toast({
    //         title: 'Warning',
    //         description: 'Screen recording device detected!',
    //         variant: 'destructive',
    //       });
    //     }
    //   });
    // };

    const checkRecordingDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        toast({
          title: 'Warning',
          description: 'Screen sharing started!',
          variant: 'destructive',
        });

        stream.getTracks().forEach((track) => {
          track.onended = () => {
            toast({
              title: 'Notice',
              description: 'Screen sharing stopped.',
            });
          };
        });
      } catch (err) {
        console.log('Screen sharing not allowed or cancelled:', err);
      }
    };

    // const checkRecordingDevices = () => {
    //   navigator.mediaDevices
    //     .getDisplayMedia({ video: true })
    //     .then((stream) => {
    //       toast({
    //         title: 'Warning',
    //         description: 'Screen recording started!',
    //         variant: 'destructive',
    //       });

    //       // Optional: track when sharing ends
    //       stream.getTracks().forEach((track) => {
    //         track.onended = () => {
    //           toast({
    //             title: 'Stopped',
    //             description: 'Screen sharing ended.',
    //           });
    //         };
    //       });
    //     })
    //     .catch((err) => {
    //       console.log('User denied screen share or error:', err);
    //     });
    // };

    const interval = setInterval(() => {
      detectDevTools();
      //   checkRecordingDevices();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Clipboard block
  useEffect(() => {
    const disableClipboard = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener('copy', disableClipboard);
    document.addEventListener('cut', disableClipboard);
    document.addEventListener('paste', disableClipboard);

    return () => {
      document.removeEventListener('copy', disableClipboard);
      document.removeEventListener('cut', disableClipboard);
      document.removeEventListener('paste', disableClipboard);
    };
  }, []);

  // Inactivity detection
  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown'];
    activityEvents.forEach((event) =>
      document.addEventListener(event, resetInactivityTimer),
    );
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) =>
        document.removeEventListener(event, resetInactivityTimer),
      );
    };
  }, [locked]);

  return {
    locked,
    inputPassword,
    setInputPassword,
    handleUnlock,
    attemptsLeft: 3 - attempts,
  };
}

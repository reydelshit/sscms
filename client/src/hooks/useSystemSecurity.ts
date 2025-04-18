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
  const blackoutOverlay = useRef<HTMLDivElement | null>(null);

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

    const interval = setInterval(() => {
      // detectDevTools();
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

  // Right-click block
  // useEffect(() => {
  //   const handleRightClick = (e: MouseEvent) => {
  //     e.preventDefault(); // Prevent the context menu from showing
  //     toast({
  //       title: 'Right-click is disabled',
  //       description: 'You cannot use right-click on this page.',
  //       variant: 'destructive',
  //     });
  //   };

  //   document.addEventListener('contextmenu', handleRightClick);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleRightClick);
  //   };
  // }, []);

  return {
    locked,
    inputPassword,
    setInputPassword,
    handleUnlock,
    blackoutOverlay,
    attemptsLeft: 3 - attempts,
  };
}

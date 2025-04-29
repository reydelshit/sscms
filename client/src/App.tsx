import { RouterProvider } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import './index.css'; // Tailwind included here
import { router } from './main';
import { useDevToolsStatus } from './hooks/useDevToolsStatus';

export default function App() {
  const blackoutRef = useRef<HTMLDivElement>(null);
  const isDevToolsOpen = useDevToolsStatus();

  const SecurityLockModal: React.FC = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
          <h2 className="text-xl font-semibold text-red-600">
            ⚠ Security Alert
          </h2>
          <p className="mt-4">
            Please close the developer tools to continue using the application.
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleScreenshotAttempt = () => {
      console.log('Screenshot detected!');

      // Show overlay
      if (blackoutRef.current) {
        blackoutRef.current.style.display = 'block';
        requestAnimationFrame(() => {
          if (blackoutRef.current) {
            blackoutRef.current.style.opacity = '1';
          }
        });
      }

      // Prepare security message
      const securityMessage = `Taking screenshots is not allowed on this website`;

      // Override clipboard with security message
      navigator.clipboard
        .writeText(securityMessage)
        .then(() => {
          console.log('Security message copied to clipboard');
        })
        .catch((err) => {
          console.error('Failed to copy security message:', err);
        });

      // Hide overlay after delay
      setTimeout(() => {
        if (blackoutRef.current) {
          blackoutRef.current.style.opacity = '0';
          setTimeout(() => {
            if (blackoutRef.current) {
              blackoutRef.current.style.display = 'none';
            }
          }, 1000);
        }
      }, 3000);
    };

    const handleKeyEvent = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        e.code === 'PrintScreen' ||
        e.keyCode === 44
      ) {
        e.preventDefault();
        handleScreenshotAttempt();
      }
    };

    // Detect Windows Snipping Tool (Win+Shift+S)
    const handleWindowsCombo = (e: KeyboardEvent) => {
      if (e.key === 'S' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        handleScreenshotAttempt();
      }
    };

    // Detect Mac screenshot shortcuts
    const handleMacCombo = (e: KeyboardEvent) => {
      if ((e.key === '3' || e.key === '4') && e.shiftKey && e.metaKey) {
        handleScreenshotAttempt();
      }
    };

    // Set up all event listeners
    document.addEventListener('keydown', handleKeyEvent, true);
    document.addEventListener('keyup', handleKeyEvent, true);
    document.addEventListener('keydown', handleWindowsCombo);
    document.addEventListener('keydown', handleMacCombo);

    return () => {
      document.removeEventListener('keydown', handleKeyEvent, true);
      document.removeEventListener('keyup', handleKeyEvent, true);
      document.removeEventListener('keydown', handleWindowsCombo);
      document.removeEventListener('keydown', handleMacCombo);
    };
  }, []);

  return (
    <>
      {isDevToolsOpen && <SecurityLockModal />}
      <div
        ref={blackoutRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            width: '80%',
            maxWidth: '600px',
            userSelect: 'text',
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#ff4444',
            }}
          >
            ⚠️ SCREENSHOT BLOCKED
          </h2>
          <p
            style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              lineHeight: '1.5',
            }}
          ></p>
          <div
            style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {' '}
            Security policy prevents capturing this content
          </div>
        </div>
      </div>
      <RouterProvider router={router} />
    </>
  );
}

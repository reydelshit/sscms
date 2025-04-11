import ButtonShadow from '@/components/ButtonShadow';
import Header, { handleLogout } from '@/components/structure/Header';
import { Toaster } from '@/components/ui/toaster';
import { Link, Outlet, useLocation } from 'react-router-dom';
import TransactionsAssistant from './TransactionsAssistant';
import NurseAssitant from '@/assets/assistant.png';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const RootAssistant = () => {
  const params = useLocation();
  const role = localStorage.getItem('sscms_role');

  const currentPath = window.location.pathname;

  console.log('Current Path:', currentPath);

  useEffect(() => {
    if (!role) {
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    } else if (role === 'nurse') {
      if (currentPath !== '/') {
        window.location.href = '/';
      }
    } else if (role === 'assistant') {
      if (currentPath !== '/assistant') {
        window.location.href = '/assistant';
      }
    } else {
      if (currentPath !== '/volunteer') {
        window.location.href = '/volunteer';
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="relative flex h-full w-full grow">
        <div className="sticky left-0 top-0 z-10 flex h-screen w-[280px] flex-col gap-2 bg-[#FF9B15] p-2 px-4">
          {role === 'assistant' && (
            <div className="my-4 flex items-center gap-2">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={NurseAssitant}
                alt="nurse avatar"
              />

              <h1 className="text-xl font-semibold">NURSE ASSISTANT</h1>
            </div>
          )}

          <Link to="/assistant">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname.includes('transactions')
                  ? 'bg-black text-white'
                  : ''
              }`}
            >
              TRANSACTIONS
            </Button>
          </Link>
          <Link to="/assistant/inventory">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname === '/inventory' ? 'bg-black text-white' : ''
              }`}
            >
              INVENTORY
            </Button>
          </Link>

          <Button
            onClick={() => handleLogout()}
            className="absolute bottom-4 left-5 w-[80%] bg-white text-start text-black hover:bg-black hover:text-white"
          >
            LOGOUT
          </Button>
        </div>

        <div className="w-full overflow-x-hidden">
          {params.pathname === '/assistant' ? (
            <TransactionsAssistant />
          ) : (
            <Outlet />
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default RootAssistant;

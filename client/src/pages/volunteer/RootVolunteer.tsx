import ButtonShadow from '@/components/ButtonShadow';
import Header, { handleLogout } from '@/components/structure/Header';
import { Toaster } from '@/components/ui/toaster';
import { Link, Outlet, useLocation } from 'react-router-dom';
import TransactionsVol from './TransactionsVol';
import DefaultProfile from '@/assets/default.webp';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const RootVolunteer = () => {
  const params = useLocation();
  const role = localStorage.getItem('sscms_role');
  const VolunteerName = localStorage.getItem('sscms_volunteer_name');

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
      {/* <Header /> */}
      <div className="relative flex h-full w-full grow">
        <div className="sticky left-0 top-0 z-10 flex h-screen w-[280px] flex-col gap-2 bg-[#FF9B15] p-2 px-4">
          {role === 'volunteer' && (
            <div className="my-4 flex items-center gap-2">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={DefaultProfile}
                alt="nurse avatar"
              />

              <div>
                <h1 className="text-xl font-semibold">{VolunteerName}</h1>
                <p>Volunteer</p>
              </div>
            </div>
          )}

          <Link to="/volunteer">
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

          <Link to="/volunteer/daily-time-record">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname.includes('transactions')
                  ? 'bg-black text-white'
                  : ''
              }`}
            >
              DAILY TIME RECORD
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
          {params.pathname === '/volunteer' ? <TransactionsVol /> : <Outlet />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default RootVolunteer;

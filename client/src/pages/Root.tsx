import NurseAvatar from '@/assets/nurse.png';
import { handleLogout } from '@/components/structure/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useSystemSecurity } from '@/hooks/useSystemSecurity';
import Dashboard from '@/pages/nurse/Dashboard';
import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
const Root = () => {
  const params = useLocation();
  const role = localStorage.getItem('sscms_role');

  const currentPath = window.location.pathname;
  const navigate = useNavigate();
  console.log('Current Path:', currentPath);

  const {
    locked,
    inputPassword,
    setInputPassword,
    handleUnlock,
    blackoutOverlay,
    attemptsLeft,
  } = useSystemSecurity({
    password: '1234', // ilisdi lang ni
    onLogout: () => {
      localStorage.clear();
      navigate('/login');
    },
  });

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
      {locked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="w-[450px] space-y-4 rounded bg-white p-6 text-center shadow-md">
            <h2 className="text-xl font-bold">Session Locked</h2>
            <Input
              type="password"
              placeholder="Enter Password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="border p-2"
            />
            <Button
              variant={'default'}
              onClick={handleUnlock}
              className="rounded px-4 py-2 text-white"
            >
              Unlock
            </Button>
            <p className="text-sm text-gray-500">
              Attempts left: {attemptsLeft}
            </p>
          </div>
        </div>
      )}
      {/* <Header /> */}
      <div className="relative flex h-full w-full grow">
        <div className="sticky left-0 top-0 z-10 flex h-screen w-[280px] flex-col gap-2 bg-[#FF9B15] p-2 px-4">
          {role === 'nurse' && (
            <div className="my-4 flex items-center gap-2">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={NurseAvatar}
                alt="nurse avatar"
              />

              <h1 className="text-xl font-semibold">NURSE</h1>
            </div>
          )}
          {/* <div className="sticky left-0 top-0 z-10 h-screen w-[280px] flex-col gap-2 border-r-[1px] bg-[#FED883] p-2 px-4 pt-[4rem]"> */}
          <Link to="/">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname === '/' ? 'bg-black text-white' : ''
              }`}
            >
              DASHBOARD
            </Button>
          </Link>

          <Link to="/transactions">
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

          <Link to="/medical-history">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname === '/medical-history'
                  ? 'bg-black text-white'
                  : ''
              }`}
            >
              MEDICAL HISTORY
            </Button>
          </Link>

          <Link to="/case-report">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname === '/case-report' ? 'bg-black text-white' : ''
              }`}
            >
              CASE REPORT
            </Button>
          </Link>

          <Link to="/inventory">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname === '/inventory' ? 'bg-black text-white' : ''
              }`}
            >
              INVENTORY
            </Button>
          </Link>

          <Link to="/volunteers">
            <Button
              className={`block w-full bg-white text-start text-black hover:bg-black hover:text-white ${
                params.pathname === '/volunteers' ? 'bg-black text-white' : ''
              }`}
            >
              VOLUNTEERS
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
          {/* This is where the child routes get rendered */}
          {params.pathname === '/' ? <Dashboard /> : <Outlet />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Root;

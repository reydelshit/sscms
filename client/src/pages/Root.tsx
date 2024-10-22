import NurseAvatar from '@/assets/nurse.png';
import ButtonShadow from '@/components/ButtonShadow';
import Header from '@/components/structure/Header';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/nurse/Dashboard';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
const Root = () => {
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
      <Header />
      <div className="relative flex h-full w-full grow">
        <div className="sticky left-0 top-0 z-10 flex h-screen w-[280px] flex-col gap-2 bg-[#FED883] p-2 px-4">
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
          <ButtonShadow
            to="/"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/' ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG={` ${params.pathname === '/' ? 'bg-black' : 'bg-black'}`}
          >
            {' '}
            DASHBOARD{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/transactions"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname.includes('transactions') ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            TRANSACTIONS{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/medical-history"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/medical-history' ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            MEDICAL HISTORY{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/case-report"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/case-report' ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            CASE REPORT{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/inventory"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/inventory' ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG="bg-black"
          >
            INVENTORY
          </ButtonShadow>

          <ButtonShadow
            to="/volunteers"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/volunteers' ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG="bg-black"
          >
            VOLUNTEERS
          </ButtonShadow>
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

import ButtonShadow from '@/components/ButtonShadow';
import Header from '@/components/structure/Header';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/nurse/Dashboard';
import { Outlet, useLocation } from 'react-router-dom';

const Root = () => {
  const params = useLocation();

  //   useEffect(() => {
  //     if (!localStorage.getItem('isLoggedIn_QR')) {
  //       window.location.href = '/login';
  //     }
  //   }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn_QR');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Header />
      <div className="relative flex h-full w-full grow">
        <div className="sticky left-0 top-0 z-10 flex h-screen w-[280px] flex-col gap-2 bg-[#FED883] p-2 px-4 pt-[4rem]">
          {/* <div className="sticky left-0 top-0 z-10 h-screen w-[280px] flex-col gap-2 border-r-[1px] bg-[#FED883] p-2 px-4 pt-[4rem]"> */}
          <ButtonShadow
            to="/"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            DASHBOARD{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/transactions"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/transactions' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            TRANSACTIONS{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/medical-history"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/medical-history' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            MEDICAL HISTORY{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/case-report"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/case-report' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            CASE REPORT{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/inventory"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/inventory' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            outsideBG="bg-black"
          >
            INVENTORY
          </ButtonShadow>

          <ButtonShadow
            to="/volunteers"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/volunteers' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
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

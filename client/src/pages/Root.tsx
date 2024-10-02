import ButtonShadow from '@/components/ButtonShadow';
import Header from '@/components/structure/Header';
import { Button } from '@/components/ui/button';
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
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Header />

      <div className="relative mx-auto flex h-full w-full">
        <div className="sticky left-0 top-0 flex h-screen w-[280px] flex-col gap-2 border-r-[1px] bg-[#FED883] p-2 px-4 pt-[4rem]">
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
            outsideBG="bg-[#F2700A]"
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
            outsideBG="bg-[#F2700A]"
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

          <Button
            onClick={handleLogout}
            className="absolute bottom-2 left-2 right-2"
          >
            Logout
          </Button>
        </div>

        <div className="h-full w-full">
          {/* This is where the child routes get rendered */}
          {params.pathname === '/' ? <Dashboard /> : <Outlet />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Root;

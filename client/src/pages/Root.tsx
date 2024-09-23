import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import {
  ChartBarBig,
  LayoutGrid,
  MailCheck,
  QrCode,
  ScrollText,
  UserCog,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

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
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative mx-auto flex h-full w-full gap-4">
        <div className="sticky left-0 top-0 flex h-screen w-[250px] flex-col gap-2 border-r-[1px] p-2 pt-[4rem]">
          <Button
            variant={'outline'}
            className={`border-none p-2 ${params.pathname === '/' ? 'bg-black text-white' : ''}`}
          >
            <Link
              className="text-md flex w-full items-center justify-start"
              to="/"
            >
              {' '}
              <LayoutGrid className="mr-2 w-[1.2rem]" /> Dashboard
            </Link>
          </Button>

          <Button
            variant={'outline'}
            className={`border-none p-2 ${params.pathname === '/student-management' ? 'bg-black text-white' : ''}`}
          >
            <Link
              className="text-md flex w-full items-center justify-start"
              to="/student-management"
            >
              <UserCog className="mr-2 w-[1.2rem]" /> Students
            </Link>
          </Button>

          <Button
            variant={'outline'}
            className={`border-none p-2 ${params.pathname === '/message' ? 'bg-black text-white' : ''}`}
          >
            <Link
              className="text-md flex w-full items-center justify-start"
              to="/message"
            >
              <MailCheck className="mr-2 w-[1.2rem]" /> Message
            </Link>
          </Button>

          <Button
            variant={'outline'}
            className={`border-none p-2 ${params.pathname === '/attendance-log' ? 'bg-black text-white' : ''}`}
          >
            <Link
              className="text-md flex w-full items-center justify-start"
              to="/attendance-log"
            >
              <ScrollText className="mr-2 w-[1.2rem]" /> Attendance
            </Link>
          </Button>
          <Button
            variant={'outline'}
            className={`border-none p-2 ${params.pathname === '/Reports' ? 'bg-black text-white' : ''}`}
          >
            <Link
              className="text-md flex w-full items-center justify-start"
              to="/Reports"
            >
              <ChartBarBig className="mr-2 w-[1.2rem]" /> Reports
            </Link>
          </Button>
          <Button
            variant={'outline'}
            className={`border-none p-2 ${params.pathname === '/ScanStation' ? 'bg-black text-white' : ''}`}
          >
            <Link
              className="text-md flex w-full items-center justify-start"
              to="/ScanStation"
            >
              {' '}
              <QrCode className="mr-2 w-[1.2rem]" /> Scan Station
            </Link>
          </Button>

          {/* <Button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute right-2 top-[50%] border-2 p-2"
          >
            Toggle Sidebar
          </Button> */}

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

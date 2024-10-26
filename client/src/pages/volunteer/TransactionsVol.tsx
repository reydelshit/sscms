import BGPage from '@/assets/bg-page.png';
import { Button } from '@/components/ui/button';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Prescription from '@/pages/nurse/transactions/Prescription';

const TransactionsVol = () => {
  const path = useLocation().pathname;
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="flex w-full justify-between gap-4 rounded-full bg-[#193F56] bg-opacity-75 p-4">
        <div className={`mb-2 h-full w-full rounded-full bg-[#193F56]`}>
          <Link to="/volunteer">
            <Button
              className={`mb-2 ml-1 h-[3rem] w-full rounded-full border-none bg-[#95CCD5] text-xl text-white hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/volunteer' ? 'bg-[#FFA114] text-white' : ''}`}
            >
              PRESCRIPTION
            </Button>
          </Link>
        </div>

        <div className="mb-2 h-full w-full rounded-full bg-[#193F56]">
          <Link to="/volunteer/transactions/medical-report">
            <Button
              className={`mb-2 ml-1 h-[3rem] w-full rounded-full border-none bg-[#95CCD5] text-xl uppercase text-white hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/volunteer/transactions/medical-report' ? 'bg-[#FFA114] text-white' : ''}`}
            >
              Medical Report
            </Button>
          </Link>
        </div>
      </div>

      {path === '/volunteer' ? <Prescription /> : <Outlet />}
    </div>
  );
};

export default TransactionsVol;

import BGPage from '@/assets/bg-page.png';
import { Button } from '@/components/ui/button';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Prescription from './transactions/Prescription';

const Transactions = () => {
  const path = useLocation().pathname;
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="flex w-full justify-between gap-4 rounded-full bg-[#193F56] bg-opacity-75 p-4">
        <div className={`mb-2 w-full rounded-full bg-[#193F56]`}>
          <Link to="/transactions">
            <Button
              className={`mb-2 ml-1 h-[3.5rem] w-full rounded-full border-none bg-[#95CCD5] text-xl text-white hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/transactions' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            >
              PRESCRIPTION
            </Button>
          </Link>
        </div>

        <div className="mb-2 w-full rounded-full bg-[#193F56]">
          <Link to="/transactions/medical-report">
            <Button
              className={`mb-2 ml-1 h-[3.5rem] w-full rounded-full border-none bg-[#95CCD5] text-xl uppercase text-white hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/transactions/medical-report' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            >
              Medical Report
            </Button>
          </Link>
        </div>

        <div className="mb-2 w-full rounded-full bg-[#193F56]">
          <Link to="/transactions/med-cert">
            <Button
              className={`mb-2 ml-1 h-[3.5rem] w-full rounded-full border-none bg-[#95CCD5] text-xl uppercase text-white hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/transactions/med-cert' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            >
              Medical Certificate
            </Button>
          </Link>
        </div>
      </div>

      {path === '/transactions' ? <Prescription /> : <Outlet />}
    </div>
  );
};

export default Transactions;

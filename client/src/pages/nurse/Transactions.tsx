import BGPage from '@/assets/bg-page.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Prescription from './transactions/Prescription';

const Transactions = () => {
  const path = useLocation().pathname;
  return (
    <div
      className="h-fit w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="flex w-full justify-between gap-4 rounded-full bg-[#526C71] p-4">
        <div className="mb-2 w-full rounded-full bg-[#F2700A]">
          <Link to="/transactions">
            <Button
              className={`mb-2 ml-1 w-full rounded-full border-none bg-[#FFA114] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/transactions' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            >
              PRESCRIPTION
            </Button>
          </Link>
        </div>

        <div className="mb-2 w-full rounded-full bg-[#F2700A]">
          <Link to="/transactions/medical-report">
            <Button
              className={`mb-2 ml-1 w-full rounded-full border-none bg-[#FFA114] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/transactions/medical-report' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            >
              Medical Report
            </Button>
          </Link>
        </div>

        <div className="mb-2 w-full rounded-full bg-[#F2700A]">
          <Link to="/transactions/med-cert">
            <Button
              className={`mb-2 ml-1 w-full rounded-full border-none bg-[#FFA114] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${path === '/transactions/med-cert' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            >
              Medical Certificate
            </Button>
          </Link>
        </div>

        <Input placeholder="search" className="w-[25rem]" />
      </div>

      {path === '/transactions' ? <Prescription /> : <Outlet />}
    </div>
  );
};

export default Transactions;

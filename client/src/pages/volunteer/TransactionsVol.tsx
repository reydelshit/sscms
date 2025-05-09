import { Button } from '@/components/ui/button';
import Prescription from '@/pages/nurse/transactions/Prescription';
import { Link, Outlet, useLocation } from 'react-router-dom';

const TransactionsVol = () => {
  const path = useLocation().pathname;
  return (
    <div className="min-h-screen w-full bg-cover bg-center p-8">
      <div className="flex w-full justify-between gap-4 rounded-full bg-[#D4D5D6] bg-opacity-75 p-4">
        <div className={`mb-2 h-full w-full rounded-full bg-[#D4D5D6]`}>
          <Link to="/volunteer">
            <Button
              className={`ml-1 block h-[3rem] w-full rounded-2xl border-none bg-white text-start text-black hover:text-[#D4D5D6] ${path === '/transactions' ? 'bg-black text-white' : ''}`}
            >
              PRESCRIPTION
            </Button>
          </Link>
        </div>

        <div className="mb-2 h-full w-full rounded-full bg-[#D4D5D6]">
          <Link to="/volunteer/transactions/medical-report">
            <Button
              className={`ml-1 block h-[3rem] w-full rounded-2xl border-none bg-white text-start text-black hover:text-[#D4D5D6] ${path === '/transactions' ? 'bg-black text-white' : ''}`}
            >
              MEDICAL REPORT
            </Button>
          </Link>
        </div>
      </div>

      {path === '/volunteer' ? <Prescription /> : <Outlet />}
    </div>
  );
};

export default TransactionsVol;

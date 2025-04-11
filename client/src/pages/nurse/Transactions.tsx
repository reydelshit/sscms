import { Button } from '@/components/ui/button';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Prescription from './transactions/Prescription';

const Transactions = () => {
  const path = useLocation().pathname;
  return (
    <div className="min-h-screen w-full bg-cover bg-center p-8">
      <div className="flex w-full justify-between gap-4 rounded-full bg-[#D4D5D6] bg-opacity-75 p-4">
        <Link className="w-full" to="/transactions">
          <Button
            className={`ml-1 block h-[3rem] w-full rounded-2xl border-none bg-white text-start text-black hover:text-[#D4D5D6] ${path === '/transactions' ? 'bg-black text-white' : ''}`}
          >
            PRESCRIPTION
          </Button>
        </Link>

        <Link className="w-full" to="/transactions/medical-report">
          <Button
            className={`rounded2xl ml-1 block h-[3rem] w-full border-none bg-white text-start uppercase text-black hover:text-[#D4D5D6] ${path === '/transactions/medical-report' ? 'bg-black text-white' : ''}`}
          >
            Medical Report
          </Button>
        </Link>
        <Link className="w-full" to="/transactions/med-cert">
          <Button
            className={`rounded2xl ml-1 block h-[3rem] w-full border-none bg-white text-start uppercase text-black hover:text-[#D4D5D6] ${path === '/transactions/med-cert' ? 'bg-black text-white' : ''}`}
          >
            med cert / referral
          </Button>
        </Link>
      </div>

      {path === '/transactions' ? <Prescription /> : <Outlet />}
    </div>
  );
};

export default Transactions;

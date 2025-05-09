import { Button } from '@/components/ui/button';
import Prescription from '@/pages/nurse/transactions/Prescription';
import { Link, Outlet, useLocation } from 'react-router-dom';

const TransactionsAssistant = () => {
  const path = useLocation().pathname;
  return (
    <div className="min-h-screen w-full bg-cover bg-center p-8">
      <div className="flex w-full justify-between gap-4 rounded-full bg-[#D4D5D6] bg-opacity-75 p-4">
        <Link className="w-full" to="/assistant">
          <Button
            className={`ml-1 block h-[3rem] w-full rounded-2xl border-none bg-white text-start text-black hover:text-[#D4D5D6] ${path === '/assistant' ? 'bg-black text-white' : ''}`}
          >
            PRESCRIPTION
          </Button>
        </Link>

        <Link className="w-full" to="/assistant/transactions/medical-report">
          <Button
            className={`rounded2xl ml-1 block h-[3rem] w-full border-none bg-white text-start uppercase text-black hover:text-[#D4D5D6] ${path === '/assistant/transactions/medical-report' ? 'bg-black text-white' : ''}`}
          >
            Medical Report
          </Button>
        </Link>
      </div>

      {path === '/assistant' ? <Prescription /> : <Outlet />}
    </div>
  );
};

export default TransactionsAssistant;

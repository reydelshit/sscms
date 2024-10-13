import Header from '@/components/structure/Header';
import { Toaster } from '@/components/ui/toaster';
import { Outlet, useLocation } from 'react-router-dom';
import ButtonShadow from '@/components/ButtonShadow';
import TransactionsAssistant from './TransactionsAssistant';

const RootAssistant = () => {
  const params = useLocation();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Header />
      <div className="relative flex h-full w-full grow">
        <div className="sticky left-0 top-0 z-10 flex h-screen w-[280px] flex-col gap-2 bg-[#FED883] p-2 px-4 pt-[4rem]">
          <ButtonShadow
            to="/assistant"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/transactions' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            TRANSACTIONS{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/assistant/inventory"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/transactions' ? 'bg-[#FDF3C0] text-[#193F56]' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            INVENTORY
          </ButtonShadow>
        </div>

        <div className="w-full overflow-x-hidden">
          {/* This is where the child routes get rendered */}
          {params.pathname === '/assistant' ? (
            <TransactionsAssistant />
          ) : (
            <Outlet />
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default RootAssistant;

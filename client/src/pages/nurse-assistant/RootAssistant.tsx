import ButtonShadow from '@/components/ButtonShadow';
import Header from '@/components/structure/Header';
import { Toaster } from '@/components/ui/toaster';
import { Outlet, useLocation } from 'react-router-dom';
import TransactionsAssistant from './TransactionsAssistant';
import NurseAssitant from '@/assets/assistant.png';

const RootAssistant = () => {
  const params = useLocation();
  const role = localStorage.getItem('sscms_role');

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Header />
      <div className="relative flex h-full w-full grow">
        <div className="sticky left-0 top-0 z-10 flex h-screen w-[280px] flex-col gap-2 bg-[#FED883] p-2 px-4">
          {role === 'assistant' && (
            <div className="my-4 flex items-center gap-2">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={NurseAssitant}
                alt="nurse avatar"
              />

              <h1 className="text-xl font-semibold">NURSE ASSISTANT</h1>
            </div>
          )}

          <ButtonShadow
            to="/assistant"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/assistant' ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            TRANSACTIONS{' '}
          </ButtonShadow>

          <ButtonShadow
            to="/assistant/inventory"
            className={`w-full bg-[#193F56] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56] ${params.pathname === '/assistant/inventory' ? 'bg-[#FFA114] text-white' : ''}`}
            outsideBG="bg-black"
          >
            {' '}
            INVENTORY
          </ButtonShadow>
        </div>

        <div className="w-full overflow-x-hidden">
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

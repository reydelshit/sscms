import ButtonShadow from '@/components/ButtonShadow';
import { Input } from '@/components/ui/input';
import BGPage from '@/assets/bg-page.png';

const Transactions = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="flex w-full justify-between gap-4 rounded-full bg-[#193F56] p-4">
        <ButtonShadow
          outsideBG="bg-[#193F56]"
          className="h-full w-full bg-[#95CCD5] text-white"
        >
          PRESCRIPTION
        </ButtonShadow>
        <ButtonShadow
          outsideBG="bg-[#F2700A]"
          className="h-full w-full bg-[#FFA114] text-[#FED883]"
        >
          MEDICAL REPORT
        </ButtonShadow>
        <ButtonShadow
          outsideBG="bg-[#193F56]"
          className="h-full w-full bg-[#95CCD5] text-white"
        >
          MED CER/REFERRAL
        </ButtonShadow>

        <Input placeholder="search" className="w-[25rem]" />
      </div>

      <div className="mt-[2rem] h-[70%] rounded-3xl bg-[#193F56]"></div>
    </div>
  );
};

export default Transactions;

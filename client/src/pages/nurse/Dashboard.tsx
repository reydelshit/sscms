import BGPage from '@/assets/bg-page.png';
const Dashboard = () => {
  return (
    <div
      className="h-full min-h-screen w-full overflow-y-hidden bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[1rem] h-fit w-full rounded-3xl bg-[#193F56] bg-opacity-75 p-4 text-center"></div>
    </div>
  );
};

export default Dashboard;

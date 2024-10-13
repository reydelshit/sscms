import Logo from '@/assets/LOGO.svg';
import ButtonShadow from '../ButtonShadow';
const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('sscms_role');
    window.location.href = '/login';
  };
  return (
    <div className="flex h-[6rem] w-full items-center justify-between bg-[#FFA114] px-4">
      <img className="w-20" src={Logo} alt="Logo" />

      <div className="w-[8rem]">
        <ButtonShadow
          className="w-full bg-[#D71111] hover:bg-[#FDF3C0] hover:text-[#193F56]"
          outsideBG="bg-black"
          onClick={handleLogout}
        >
          {' '}
          Logout{' '}
        </ButtonShadow>
      </div>
    </div>
  );
};

export default Header;

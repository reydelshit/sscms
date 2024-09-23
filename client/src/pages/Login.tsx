import Logo from '@/assets/LOGO.svg';
import BGImage from '@/assets/SSCMS v2.0.png';
import ButtonShadow from '@/components/ButtonShadow';
import InputShadow from '@/components/InputShadow';
import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      className="grid h-screen w-screen place-content-center place-items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <div className="flex h-[35rem] w-[30rem] flex-col items-center rounded-2xl bg-[#FDF3C0] px-[5rem]">
        <img src={Logo} alt="Logo" />
        <h1 className="my-2 text-center text-4xl font-bold text-[#193F56]">
          Login
        </h1>

        <InputShadow
          placeholder="Username"
          outsideBG="bg-[#F2700A]"
          insideBG="bg-[#FFA114]"
          customStyles="h-[3.5rem] rounded-full"
          onChange={(e) => setUsername(e.target.value)}
        />

        <InputShadow
          placeholder="Password"
          outsideBG="bg-[#F2700A]"
          insideBG="bg-[#FFA114]"
          customStyles="h-[3.5rem] rounded-full"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <ButtonShadow
          content="Login"
          outsideBG="bg-[#5D7576] w-[10rem]"
          insideBG="bg-[#193F56]"
          customStyles="h-[3.5rem] rounded-full w-full text-[2rem] uppercase text-[#FDF3C0] font-bold"
          onClick={() => console.log('Login')}
        />
      </div>
    </div>
  );
};

export default Login;

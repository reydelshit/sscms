import Logo from '@/assets/LOGO.svg';
import BGImage from '@/assets/SSCMS v2.0.png';
import InputShadow from '@/components/InputShadow';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isNurse = username.includes('nurse');
  const isAssistant = username.includes('assistant');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNurse) {
      if (
        username === import.meta.env.VITE_NURSE_USERNAME &&
        password === import.meta.env.VITE_NURSE_PASSWORD
      ) {
        window.location.href = '/';

        localStorage.setItem('sscms_role', 'nurse');
      }
    } else if (isAssistant) {
      if (
        username === import.meta.env.VITE_ASSISTANT_USERNAME &&
        password === import.meta.env.VITE_ASSISTANT_PASSWORD
      ) {
        window.location.href = '/assistant';

        localStorage.setItem('sscms_role', 'assistant');
      }
    } else {
      window.location.href = '/volunteer';

      localStorage.setItem('sscms_role', 'volunteer');
    }
  };

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
        <form
          onSubmit={handleSubmit}
          className="flex h-full w-full flex-col items-center"
        >
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
          <div className="w-[10rem]">
            <div className={`mb-2 w-full rounded-full bg-[#5D7576]`}>
              <Button
                className={`mb-2 ml-1 h-[3.5rem] w-full rounded-full border-none bg-[#193F56] text-[2rem] font-bold uppercase text-[#FDF3C0]`}
                type="submit"
              >
                Login{' '}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

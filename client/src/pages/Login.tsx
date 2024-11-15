import Logo from '@/assets/LOGO.svg';
import BGImage from '@/assets/SSCMS v2.0.png';
import InputShadow from '@/components/InputShadow';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface VolunteerItem {
  student_id: string;
  student_name: string;
  course: string;
  year: string;
  phone_number: string;
  email: string;
  created_at: string;
  volunteer_id: string;
}
const useFetchCredentials = (username: string, password: string) => {
  return useQuery<VolunteerItem>({
    queryKey: ['volunteerData', username, password],
    queryFn: async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/login`,
        {
          username,
          password,
        },
      );
      if (response.data.length === 0) {
        throw new Error('Invalid credentials');
      }
      return response.data[0] as VolunteerItem;
    },
    enabled: false,
    retry: false,
  });
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { data, refetch } = useFetchCredentials(username, password);

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
      } else {
        setError('Invalid Credentials, Please try again');
      }
    } else if (isAssistant) {
      console.log('Assistant:', username, password);

      console.log(import.meta.env.VITE_ASSISTANT_USERNAME);
      console.log(import.meta.env.VITE_ASSISTANT_PASSWORD);
      if (
        username === import.meta.env.VITE_ASSISTANT_USERNAME &&
        password === import.meta.env.VITE_ASSISTANT_PASSWORD
      ) {
        window.location.href = '/assistant';

        localStorage.setItem('sscms_role', 'assistant');
      } else {
        setError('Invalid Credentials, Please try again');
      }
    } else {
      const result = await refetch();

      if (result.isSuccess) {
        toast({
          title: 'Login successful',
          description: 'Redirecting to dashboard',
        });
      }

      if (result.isError) {
        setError('Invalid Credentials, Please try again');
        return;
      }

      if (result.data?.volunteer_id) {
        console.log('Volunteer:', result.data);
        localStorage.setItem('volunteer_id', result.data.volunteer_id);
        localStorage.setItem('sscms_volunteer_name', result.data.student_name);
        localStorage.setItem('sscms_email', result.data.email);

        toast({
          title: 'Login successful',
          description: 'Redirecting to dashboard',
        });

        setTimeout(() => {
          window.location.href = '/volunteer';
        }, 2000);
        localStorage.setItem('sscms_role', 'volunteer');
      }
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
            customStyles="h-[3.5rem] rounded-full text-white"
            onChange={(e) => setUsername(e.target.value)}
          />

          <InputShadow
            placeholder="Password"
            outsideBG="bg-[#F2700A]"
            insideBG="bg-[#FFA114]"
            customStyles="h-[3.5rem] rounded-full text-white"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.length > 0 && (
            <div className="my-4 text-center text-red-500">{error}</div>
          )}
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

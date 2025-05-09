import Logo from '@/assets/LOGO.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import DOMPurify from 'dompurify';

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
  // xss payload
  // <img src='nevermind' onerror="alert('HACKED USING XSS');" />

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { data, refetch } = useFetchCredentials(username, password);

  // sanitize dom input
  const sanitizeUsername = DOMPurify.sanitize(username);

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
    <div className="flex h-screen w-screen justify-between gap-4 bg-cover bg-center">
      <div className="flex h-screen w-[30rem] flex-col items-start justify-center rounded-r-2xl bg-[#FF9B15] px-[2rem] text-white">
        <h1 className="my-2 text-start text-6xl font-bold">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center"
        >
          <Input
            className="my-4 h-[3rem] w-full rounded-full border-none p-4 text-black"
            placeholder="Enter username"
            type="text"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <div dangerouslySetInnerHTML={{ __html: username }} />

          <Input
            className="mb-4 h-[3rem] w-full rounded-full border-none p-4 text-black"
            placeholder="Enter password"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error.length > 0 && (
            <div className="my-4 bg-white p-2 text-center text-red-500">
              {error}
            </div>
          )}
          <Button
            className={`mb-2 ml-1 h-[3rem] w-[15rem] rounded-full border-none bg-white uppercase text-black`}
            variant={'secondary'}
            type="submit"
          >
            Login{' '}
          </Button>
        </form>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-cover bg-center">
        <div className="flex flex-row items-center">
          <h1 className="text-8xl font-bold">SSCMS</h1>

          <img src={Logo} alt="Logo" />
        </div>

        <p>SEAIT School Clinic Management System</p>
      </div>
    </div>
  );
};

export default Login;

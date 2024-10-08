import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface FormDataType {
  student_id: string;
  student_name: string;
  course_year: string;
  phone_number: string;
  email: string;
}

const useCreateVolunteer = () => {
  return useMutation({
    mutationFn: async (data: { formData: FormDataType }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/volunteer/create`,
        {
          ...data.formData,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        console.log('Item added successfully', data);
        toast({
          title: 'Item added successfully',
          description: new Date().toLocaleTimeString(),
        });
      }
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({
        title: 'Error adding item',
        description: error.message || 'Something went wrong.',
      });
    },
  });
};

const AddVolunteer = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    course_year: '',
    phone_number: '',
    email: '',
  });

  const createMutation = useCreateVolunteer();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createMutation.mutate({
      formData,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <Label>Student ID:</Label>
          <Input
            type="text"
            name="student_id"
            onChange={handleInputChange}
            className="border-none bg-[#FDF3C0] text-[#193F56]"
          />
        </div>

        <div>
          <Label>Student Name:</Label>
          <Input
            name="student_name"
            onChange={handleInputChange}
            type="text"
            className="border-none bg-[#FDF3C0] text-[#193F56]"
          />
        </div>

        <div>
          <Label>Course / Year:</Label>
          <Input
            name="course_year"
            onChange={handleInputChange}
            type="text"
            className="border-none bg-[#FDF3C0] text-[#193F56]"
          />
        </div>

        <div>
          <Label>Phone Number:</Label>
          <Input
            name="phone_number"
            onChange={handleInputChange}
            type="text"
            className="border-none bg-[#FDF3C0] text-[#193F56]"
          />
        </div>

        <div>
          <Label>Email:</Label>
          <Input
            name="email"
            onChange={handleInputChange}
            type="email"
            className="border-none bg-[#FDF3C0] text-[#193F56]"
          />
        </div>

        <div className="my-4 flex gap-4">
          <Button
            type="submit"
            className="w-full bg-[#FFA114] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56]"
          >
            {' '}
            ADD{' '}
          </Button>
          <Button className="w-full bg-[#FFA114] text-[#FDF3C0] hover:bg-[#FDF3C0] hover:text-[#193F56]">
            {' '}
            CLEAR{' '}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddVolunteer;

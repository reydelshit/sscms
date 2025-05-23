import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Students } from '@/data/students';
import { toast } from '@/hooks/use-toast';
import useSendSMS from '@/hooks/useSendSMS';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      course: string;
      year: string;
      student_name: string;
      password: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/volunteer/create`,
        {
          ...data.formData,
          course: data.course,
          year: data.year,
          student_name: data.student_name,
          password: data.password,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        console.log('Volunteer added successfully', data);
        toast({
          title: 'Volunteer added successfully and credentials sent via SMS',
          description: new Date().toLocaleTimeString(),
        });
      }
      queryClient.invalidateQueries({ queryKey: ['volunteerData'] });
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({
        title: 'Error adding Volunteer',
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

  const [search, setSearch] = useState<string>('');
  const [studentFullname, setStudentFullname] = useState<string>('');
  const [studentCourseYear, setStudentCourseYear] = useState<string>('');
  const [studentDepartment, setStudentDepartment] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  const [contactNumber, setContactNumber] = useState('');
  const { sendSMS } = useSendSMS();

  const createMutation = useCreateVolunteer();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generatePasswordRandom = async () => {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
  };

  const handleSelectChange = (name: string, value: string) => {
    const filterStudents = Students.filter((stud) => stud.student_id === value);

    if (filterStudents.length === 0) {
      return;
    }

    setStudentFullname(
      `${filterStudents[0].f_name} ${filterStudents[0].m_init} ${filterStudents[0].l_name}`,
    );
    setStudentCourseYear(filterStudents[0].year);
    setStudentDepartment(filterStudents[0].course);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const password = await generatePasswordRandom();
    // setPassword(password);

    if (password !== '') {
      createMutation.mutate({
        formData,
        course: studentDepartment,
        year: studentCourseYear,
        student_name: studentFullname,
        password: password,
      });
    }

    if (contactNumber !== '') {
      handleSendSMS(password);
    }

    setFormData({
      student_id: '',
      student_name: '',
      course_year: '',
      phone_number: '',
      email: '',
    });

    setContactNumber('');
    setStudentFullname('');
    setStudentCourseYear('');
    setStudentDepartment('');
  };

  const handleSendSMS = async (password: string) => {
    const messageContent = `
      Hi ${studentFullname},
      Your volunteer account has been created. 
      Your email/username ${formData.email} and password is ${password}.
      Please be reminded to keep your password confidential.`;
    const recipient = contactNumber;

    // Log the contact number
    console.log('contactNumber:', recipient);

    console.log('Sending SMS with content:', messageContent, 'to:', recipient);

    await sendSMS({
      content: messageContent,
      to: recipient,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="studentId">STUDENT ID:</Label>
          <Select
            onValueChange={(value) => handleSelectChange('student_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ID" />
            </SelectTrigger>
            <SelectContent>
              <Input
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID"
                className="border-none"
              />
              {Students.filter(
                (stud) =>
                  stud.f_name.includes(search.toLowerCase()) ||
                  stud.student_id.includes(search),
              ).map((id, index) => (
                <SelectItem key={index} value={id.student_id}>
                  {id.student_id} - {id.f_name} {id.l_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Student Name:</Label>
          <Input
            name="student_name"
            value={studentFullname}
            onChange={handleInputChange}
            type="text"
            className="text-[#193F56]"
          />
        </div>

        <div>
          <Label>Year:</Label>
          <Input
            name="year"
            value={studentCourseYear}
            onChange={handleInputChange}
            type="text"
            className="text-[#193F56]"
          />
        </div>

        <div>
          <Label>Course:</Label>
          <Input
            name="course"
            value={studentDepartment}
            onChange={handleInputChange}
            type="text"
            className="text-[#193F56]"
          />
        </div>

        <div>
          <Label>Phone Number:</Label>
          <Input
            name="phone_number"
            value={contactNumber}
            onChange={(e) => {
              setContactNumber(e.target.value);
              handleInputChange(e);
            }}
            type="number"
            className="text-[#193F56]"
          />
        </div>

        <div>
          <Label>Email:</Label>
          <Input
            name="email"
            onChange={handleInputChange}
            value={formData.email}
            type="email"
            className="text-[#193F56]"
          />
        </div>

        <div className="my-4 flex gap-4">
          <Button type="submit" variant={'default'} className="w-[10rem]">
            {' '}
            ADD{' '}
          </Button>

          <DialogClose asChild>
            <Button variant={'outline'}> CANCEL </Button>
          </DialogClose>
        </div>
      </form>
    </div>
  );
};

export default AddVolunteer;

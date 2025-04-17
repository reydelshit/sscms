import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Students } from '@/data/students';
import { toast } from '@/hooks/use-toast';
import useSendSMS from '@/hooks/useSendSMS';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

type FormDataType = {
  date: string;
  studentId: string;
  remarks: string;
  recom: string;
};

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

const useAddMedicalReport = () => {
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      studentId: string;
      course: string;
      year: string;
      studentName: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/transaction/medical-report/create`,
        {
          ...data.formData,
          studentId: data.studentId,
          course: data.course,
          year: data.year,
          studentName: data.studentName,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        console.log('Success', data);
        toast({
          title: 'Success',
          description: new Date().toLocaleTimeString(),
        });
      }
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
      });
    },
  });
};

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

const MedicalReport = () => {
  const [formData, setFormData] = useState({
    date: '',
    studentId: '',
    remarks: '',
    recom: '',
  });

  const [selectedStudentID, setSelectedStudentID] = useState('');
  const [search, setSearch] = useState('');
  const [studentFullname, setStudentFullname] = useState('');
  const [studentCourseYear, setStudentCourseYear] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const { sendSMS } = useSendSMS();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('sscms_role');
  const userEmail = localStorage.getItem('sscms_email') || '';

  const [open, setOpen] = useState(false);

  const { data, refetch } = useFetchCredentials(userEmail || '', password);

  const handleInputChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addMedicalReport = useAddMedicalReport();

  const handleSelectChange = (value: string) => {
    const filterStudents = Students.filter((stud) => stud.student_id === value);

    if (filterStudents.length === 0) {
      return;
    }

    setContactNumber(filterStudents[0].contact_num);
    setStudentFullname(
      `${filterStudents[0].f_name} ${filterStudents[0].m_init} ${filterStudents[0].l_name}`,
    );
    setStudentCourseYear(filterStudents[0].year);
    setStudentDepartment(filterStudents[0].course);

    setSelectedStudentID(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicalReport.mutate({
      formData,
      studentId: selectedStudentID,
      course: studentDepartment,
      year: studentCourseYear,
      studentName: studentFullname,
    });

    if (contactNumber) {
      handleSendSMS();
    }

    console.log('Form submitted:', {
      ...formData,
      studentId: selectedStudentID,
      course: studentDepartment,
      year: studentCourseYear,
      studentName: studentFullname,
    });
  };

  const handleClear = () => {
    setFormData({
      date: '',
      studentId: '',
      remarks: '',
      recom: '',
    });

    setStudentCourseYear('');
    setStudentDepartment('');
    setStudentFullname('');
  };

  const handleSendSMS = () => {
    sendSMS({
      content: `Hello, the parent/guardian of ${studentFullname}. We would like to inform you that your student has been admitted to the clinic on ${new Date()}.`,
      to: contactNumber,
    });
  };

  return (
    <div className="mt-[2rem] h-[70%] rounded-3xl bg-[#D4D5D6] bg-opacity-75 p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transNo" className="text-black">
              TRANS NO.
            </Label>
            <Input
              disabled
              id="transNo"
              name="transNo"
              placeholder="[Auto-Generated]"
              className="rounded-full border-none bg-white text-black"
              required
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-black">
              DATE:
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="rounded-full border-none bg-white text-black"
              required
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-2 place-content-center gap-4">
          <div>
            <div>
              <Label htmlFor="studentName" className="text-black">
                STUDENT NAME:
              </Label>
              <Input
                id="studentName"
                name="studentName"
                value={studentFullname}
                onChange={handleInputChange}
                className="rounded-full border-none bg-white text-black"
                required
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="year" className="text-black">
                COURSE/YEAR:
              </Label>
              <Input
                id="year"
                name="year"
                value={studentCourseYear}
                onChange={handleInputChange}
                className="rounded-full border-none bg-white text-black"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="studentId" className="text-black">
              STUDENT ID:
            </Label>
            <Select onValueChange={(value) => handleSelectChange(value)}>
              <SelectTrigger className="rounded-full border-none bg-white text-black">
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

            <div className="mb-6">
              <Label htmlFor="course" className="text-black">
                COURSE:
              </Label>
              <Input
                id="course"
                name="course"
                value={studentDepartment}
                onChange={handleInputChange}
                className="rounded-full border-none bg-white text-black"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-2 flex h-[250px] gap-4">
          <Textarea
            placeholder="FINDINGS/SYMPTOMS/REMARKS:"
            onChange={handleInputChange}
            name="remarks"
            value={formData.remarks}
            className="h-full rounded-2xl border-none bg-white text-black"
          />
          <Textarea
            placeholder="TREATMENT/RECOMMENDATION:"
            onChange={handleInputChange}
            name="recom"
            value={formData.recom}
            className="h-full rounded-2xl border-none bg-white text-black"
          />
        </div>

        <div className="flex w-full justify-between">
          <div className="flex gap-4">
            <Button variant={'secondary'} type="button" onClick={handleClear}>
              CLEAR
            </Button>
            {userRole === 'volunteer' ? (
              <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);

                  console.log('Is open:', isOpen);
                  if (!isOpen) {
                    setPassword('');
                    setError('');
                  }
                }}
              >
                <DialogTrigger>
                  <Button
                    onClick={() => setOpen(true)}
                    type="button"
                    variant={'default'}
                    className="w-fit rounded-full bg-black text-white"
                  >
                    CONFIRM
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[50%]">
                  <DialogHeader>
                    <DialogTitle>Please confirm your password?</DialogTitle>
                    <DialogDescription>
                      This action is a must to confirm your identity.
                    </DialogDescription>
                  </DialogHeader>

                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                  />

                  <div className="flex justify-end">
                    <Button
                      onClick={async (e) => {
                        e.preventDefault();

                        if (password === '') {
                          toast({
                            title: 'Error',
                            description:
                              'Please enter your password to confirm.',
                          });
                          return;
                        }

                        try {
                          const result = await refetch();

                          if (result.isError) {
                            setError('Incorrect Password, Please try again');
                            return;
                          }

                          setOpen(false);

                          const mainForm = document.querySelector('form');
                          mainForm?.requestSubmit();

                          handleClear();
                          setError('');
                        } catch (error) {
                          setError(
                            'An error occurred while validating credentials',
                          );
                        }
                      }}
                      type="submit"
                      variant={'default'}
                      className="w-fit rounded-full bg-black text-white"
                    >
                      CONFIRM
                    </Button>
                  </div>

                  {error.length > 0 && (
                    <div className="my-4 text-center text-red-500">{error}</div>
                  )}
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                type="submit"
                variant={'default'}
                className="w-[10rem] rounded-full bg-black text-white"
              >
                CONFIRM
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MedicalReport;

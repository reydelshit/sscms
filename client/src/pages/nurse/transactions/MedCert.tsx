import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { Students } from '@/data/students';

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

type FormDataType = {
  date: string;
  studentName: string;
  studentId: string;
  address: string;
  age: string;
  gender: string;
  diagnosis: string;
  ref_reason: string;
  referenceClassification: string;
  reffered: string;
};

const useAddMedCert = () => {
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      studentId: string;
      studentName: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/transaction/medical-certificate/create`,
        {
          ...data.formData,
          studentId: data.studentId,
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

const MedCert = () => {
  const [formData, setFormData] = useState({
    date: '',
    studentName: '',
    studentId: '',
    address: '',
    age: '',
    gender: '',
    diagnosis: '',
    ref_reason: '',
    referenceClassification: '',
    reffered: '',
  });
  const [search, setSearch] = useState('');
  const [studentFullname, setStudentFullname] = useState('');
  const [studentCourseYear, setStudentCourseYear] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');

  const addMedCert = useAddMedCert();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleCheckboxChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      gender: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addMedCert.mutate({
      formData,
      studentId: formData.studentId,
      studentName: studentFullname,
    });
    console.log('Form submitted:', formData);
  };

  const handleClear = () => {
    setFormData({
      date: '',
      studentName: '',
      studentId: '',
      address: '',
      age: '',
      gender: '',
      diagnosis: '',
      ref_reason: '',
      referenceClassification: '',
      reffered: '',
    });
  };

  return (
    <div className="mt-[2rem] h-fit rounded-3xl bg-[#193F56] bg-opacity-75 p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="transNo" className="text-yellow-100">
              TRANS NO.
            </Label>
            <Input
              id="transNo"
              name="transNo"
              disabled
              placeholder="[Auto-Generated]"
              className="rounded-full border-none bg-yellow-100"
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-yellow-100">
              DATE:
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="rounded-full border-none bg-yellow-100"
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="studentName" className="text-yellow-100">
              STUDENT NAME:
            </Label>
            <Input
              id="studentName"
              name="studentName"
              value={studentFullname}
              onChange={handleInputChange}
              className="rounded-full border-none bg-yellow-100"
            />
          </div>
          <div>
            <Label htmlFor="studentId" className="text-yellow-100">
              STUDENT ID:
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange('studentId', value)}
            >
              <SelectTrigger className="rounded-full border-none bg-[#FFD863] text-[#193F56]">
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
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="address" className="text-yellow-100">
              ADDRESS:
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="rounded-full border-none bg-yellow-100"
            />
          </div>
          <div>
            <Label htmlFor="age" className="text-yellow-100">
              AGE:
            </Label>
            <Input
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="rounded-full border-none bg-yellow-100"
            />
          </div>
          <div className="mb-6">
            <Label className="text-yellow-100">GENDER:</Label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <Checkbox
                  id="male"
                  checked={formData.gender === 'M'}
                  onCheckedChange={() => handleCheckboxChange('M')}
                />
                <label htmlFor="male" className="ml-2 text-yellow-100">
                  M
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="female"
                  checked={formData.gender === 'F'}
                  onCheckedChange={() => handleCheckboxChange('F')}
                />
                <label htmlFor="female" className="ml-2 text-yellow-100">
                  F
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="diagnosis" className="text-yellow-100">
              DIAGNOSIS:
            </Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              className="h-32 rounded-2xl border-none bg-yellow-100"
            />
          </div>
          <div>
            <Label htmlFor="	ref_reason" className="text-yellow-100">
              REFERENCE REASON:
            </Label>
            <Textarea
              id="ref_reason"
              name="ref_reason"
              value={formData.ref_reason}
              onChange={handleInputChange}
              className="h-32 rounded-2xl border-none bg-yellow-100"
            />
          </div>
        </div>
        <div className="mb-6">
          <Label htmlFor="referenceClassification" className="text-yellow-100">
            REFERENCE CLASSIFICATION (RISK LEVEL):
          </Label>
          <Textarea
            id="referenceClassification"
            name="referenceClassification"
            value={formData.referenceClassification}
            onChange={handleInputChange}
            className="h-24 rounded-2xl border-none bg-yellow-100"
          />
        </div>
        <div className="my-4 flex w-full items-center justify-between">
          <div className="w-[40%]">
            <Label htmlFor="reffered" className="text-yellow-100">
              REFFERED TO:
            </Label>
            <Input
              id="reffered"
              name="reffered"
              value={formData.reffered}
              onChange={handleInputChange}
              className="rounded-full border-none bg-yellow-100"
            />
          </div>

          <Button
            type="button"
            className="mt-[1rem] rounded-full bg-red-500 text-white"
          >
            NOTIFY EMERGENCY CONTACT
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-x-4">
            <Button
              type="submit"
              className="rounded-full bg-green-500 text-white hover:bg-green-600"
            >
              CONFIRM & PRINT
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              className="rounded-full bg-yellow-500 text-white hover:bg-yellow-600"
            >
              CLEAR
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MedCert;

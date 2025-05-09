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

import { usePrintPDF } from '@/components/PrintPDF';
import { Students } from '@/data/students';
import useSendSMS from '@/hooks/useSendSMS';

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
  const [contactNumber, setContactNumber] = useState('');
  const generatePDF = usePrintPDF<Record<string, string>>();
  const { sendSMS } = useSendSMS();

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

    setContactNumber(filterStudents[0].contact_num);
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

    if (contactNumber) {
      handleSendSMS();
    }

    generatePDF({
      data: medCertDate,
      fileName: studentFullname + '_MEDICAL_CERTIFICATE',
      title: 'MEDICAL CERTIFICATE',
      subtitle: 'SSCMS',
      footer: [
        'This is a computer-generated document and it does not require a signature.',
        'This document is valid without an authorized signature.',
      ],
    });
  };

  const medCertDate: Record<string, string> = {
    date: formData.date,
    studentName: studentFullname,
    studentId: formData.studentId || 'N/A',
    address: formData.address,
    age: formData.age,
    gender: formData.gender,
    diagnosis: formData.diagnosis,
    ref_reason: formData.ref_reason,
    referenceClassification: formData.referenceClassification,
    reffered: formData.reffered,
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

  const handleSendSMS = () => {
    sendSMS({
      content: `Hello, the parent/guardian of ${studentFullname}. We would like to inform you that your student has been admitted to the clinic on ${formData.date}.`,
      to: contactNumber,
    });
  };

  return (
    <div className="mt-[2rem] h-fit rounded-3xl bg-[#D4D5D6] bg-opacity-75 p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="transNo" className="text-black">
              TRANS NO.
            </Label>
            <Input
              id="transNo"
              name="transNo"
              disabled
              placeholder="[Auto-Generated]"
              className="rounded-full border-none bg-white"
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
              className="rounded-full border-none bg-white"
              required
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="studentName" className="text-black">
              STUDENT NAME:
            </Label>
            <Input
              id="studentName"
              name="studentName"
              value={studentFullname}
              onChange={handleInputChange}
              className="rounded-full border-none bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="studentId" className="text-black">
              STUDENT ID:
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange('studentId', value)}
            >
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
          </div>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="address" className="text-black">
              ADDRESS:
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="rounded-full border-none bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="age" className="text-black">
              AGE:
            </Label>
            <Input
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="rounded-full border-none bg-white"
              required
            />
          </div>
          <div className="mb-6">
            <Label className="text-black">GENDER:</Label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <Checkbox
                  id="male"
                  checked={formData.gender === 'M'}
                  onCheckedChange={() => handleCheckboxChange('M')}
                />
                <label htmlFor="male" className="ml-2 text-black">
                  M
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="female"
                  checked={formData.gender === 'F'}
                  onCheckedChange={() => handleCheckboxChange('F')}
                />
                <label htmlFor="female" className="ml-2 text-black">
                  F
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="diagnosis" className="text-black">
              DIAGNOSIS:
            </Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              className="h-32 rounded-2xl border-none bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="	ref_reason" className="text-black">
              REFERENCE REASON:
            </Label>
            <Textarea
              id="ref_reason"
              name="ref_reason"
              value={formData.ref_reason}
              onChange={handleInputChange}
              className="h-32 rounded-2xl border-none bg-white"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <Label htmlFor="referenceClassification" className="text-black">
            REFERENCE CLASSIFICATION (RISK LEVEL):
          </Label>
          <Textarea
            id="referenceClassification"
            name="referenceClassification"
            value={formData.referenceClassification}
            onChange={handleInputChange}
            className="h-24 rounded-2xl border-none bg-white"
            required
          />
        </div>
        <div className="my-4 flex w-full items-center justify-between">
          <div className="w-[40%]">
            <Label htmlFor="reffered" className="text-black">
              REFFERED TO:
            </Label>
            <Input
              id="reffered"
              name="reffered"
              value={formData.reffered}
              onChange={handleInputChange}
              className="rounded-full border-none bg-white"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-x-4">
            <Button variant={'secondary'} type="button" onClick={handleClear}>
              CLEAR
            </Button>
            <Button
              type="submit"
              variant={'default'}
              className="w-fit rounded-full bg-black text-white"
            >
              CONFIRM & PRINT
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MedCert;

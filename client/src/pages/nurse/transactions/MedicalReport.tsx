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
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

type FormDataType = {
  date: string;
  studentName: string;
  studentId: string;
  courseYear: string;
  remarks: string;
  recom: string;
};

const useAddPrescription = () => {
  return useMutation({
    mutationFn: async (data: { formData: FormDataType; studentId: string }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/transaction/medical-report/create`,
        {
          ...data.formData,
          studentId: data.studentId,
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

const MedicalReport = () => {
  const [formData, setFormData] = useState({
    date: '',
    studentName: '',
    studentId: '',
    courseYear: '',
    remarks: '',
    recom: '',
  });

  const handleClear = () => {
    setFormData({
      date: '',
      studentName: '',
      studentId: '',
      courseYear: '',
      remarks: '',
      recom: '',
    });
  };

  const [selectedStudentID, setSelectedStudentID] = useState('');

  const handleInputChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addMedicalReport = useAddPrescription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicalReport.mutate({
      formData,
      studentId: selectedStudentID,
    });

    console.log('Form submitted:', {
      ...formData,
      studentId: selectedStudentID,
    });
  };

  const studentIds = ['S12345', 'S23456', 'S34567', 'S45678'];

  return (
    <div className="mt-[2rem] h-[70%] rounded-3xl bg-[#526C71] p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transNo" className="text-yellow-100">
              TRANS NO.
            </Label>
            <Input
              disabled
              id="transNo"
              name="transNo"
              placeholder="[Auto-Generated]"
              className="border-none bg-[#FDF3C0] text-[#193F56]"
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
              className="border-none bg-[#FDF3C0] text-[#193F56]"
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-2 place-content-center gap-4">
          <div>
            <div>
              <Label htmlFor="studentName" className="text-yellow-100">
                STUDENT NAME:
              </Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="border-none bg-[#FDF3C0] text-[#193F56]"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="courseYear" className="text-yellow-100">
                COURSE/YEAR:
              </Label>
              <Input
                id="courseYear"
                name="courseYear"
                value={formData.courseYear}
                onChange={handleInputChange}
                className="border-none bg-[#FDF3C0] text-[#193F56]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="studentId" className="text-yellow-100">
              STUDENT ID:
            </Label>
            <Select onValueChange={(value) => setSelectedStudentID(value)}>
              <SelectTrigger className="border-none bg-[#FFD863] text-[#193F56]">
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent>
                <Input placeholder="Search ID" className="border-none" />
                {studentIds.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-2 flex h-[250px] gap-4">
          <Textarea
            placeholder="FINDINGS/SYMPTOMS/REMARKS:"
            onChange={handleInputChange}
            name="remarks"
            className="h-full border-none bg-[#FDF3C0] text-[#193F56]"
          />
          <Textarea
            placeholder="TREATMENT/RECOMMENDATION:"
            onChange={handleInputChange}
            name="recom"
            className="h-full border-none bg-[#FDF3C0] text-[#193F56]"
          />
        </div>

        <div className="flex w-full justify-between">
          <div className="flex gap-4">
            <Button
              type="submit"
              className="rounded-full bg-green-500 text-white hover:bg-green-600"
            >
              CONFIRM
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              className="w-[8rem] rounded-full bg-[#F2700A]"
            >
              CLEAR
            </Button>
          </div>

          <Button className="bg-red-500">NOTIFY EMERGENCY CONTACT</Button>
        </div>
      </form>
    </div>
  );
};

export default MedicalReport;

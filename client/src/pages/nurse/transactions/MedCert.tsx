import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

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
    mutationFn: async (data: { formData: FormDataType; studentId: string }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/transaction/medical-certificate/create`,
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
    <div className="mt-[2rem] h-fit rounded-3xl bg-[#526C71] p-4">
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
              className="border-none bg-yellow-100"
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
              className="border-none bg-yellow-100"
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
              value={formData.studentName}
              onChange={handleInputChange}
              className="border-none bg-yellow-100"
            />
          </div>
          <div>
            <Label htmlFor="studentId" className="text-yellow-100">
              STUDENT ID:
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange('studentId', value)}
            >
              <SelectTrigger className="border-none bg-yellow-100">
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id1">ID1</SelectItem>
                <SelectItem value="id2">ID2</SelectItem>
                <SelectItem value="id3">ID3</SelectItem>
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
              className="border-none bg-yellow-100"
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
              className="border-none bg-yellow-100"
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
              className="h-32 border-none bg-yellow-100"
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
              className="h-32 border-none bg-yellow-100"
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
            className="h-24 border-none bg-yellow-100"
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="reffered" className="text-yellow-100">
            REFFERED TO:
          </Label>
          <Input
            id="reffered"
            name="reffered"
            value={formData.reffered}
            onChange={handleInputChange}
            className="border-none bg-yellow-100"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-x-4">
            <Button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              CONFIRM & PRINT
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              CLEAR
            </Button>
          </div>
          <Button
            type="button"
            className="bg-red-500 text-white hover:bg-red-600"
          >
            NOTIFY EMERGENCY CONTACT
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedCert;

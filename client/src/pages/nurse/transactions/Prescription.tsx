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
import { useState } from 'react';

import { IllnessData } from '@/data/data';
import illnessJSON from '@/data/illness.json';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface InventoryItem {
  inventory_id: string;
  itemName: string;
  quantity: number;
  associated_Illnesses?: string;
  created_at: string;
  itemDescription: string;
  manufacturingDate: string;
  expiryDate: string;
  lotNo: string;
  category: string;
}

interface FormDataType {
  date: string;
  studentName: string;
  studentId: string;
  courseYear: string;
  illness: string;
  prescrip: string;
  quantity: string;
  sig: string;
}

const useAddPrescription = () => {
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      illness: string;
      prescrip: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/transaction/prescription/create`,
        {
          ...data.formData,
          illness: data.illness,
          prescrip: data.prescrip,
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

const useFetchInventory = () => {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventoryData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/inventory`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const Prescription = () => {
  const [formData, setFormData] = useState({
    date: '',
    studentName: '',
    studentId: '',
    courseYear: '',
    illness: '',
    prescrip: '',
    quantity: '',
    sig: '',
  });

  const [selectedIllness, setSelectedIllness] = useState('');
  const [associatedPrescription, setAssociatedPrescription] = useState<
    InventoryItem[]
  >([]);
  const [selectedPrescription, setSelectedPrescription] = useState<string>('');
  const studentIds = ['S12345', 'S23456', 'S34567', 'S45678'];

  const illnesses: IllnessData = illnessJSON;

  const { data: inventoryData } = useFetchInventory();
  const addPrescription = useAddPrescription();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectPrescription = (value: string) => {
    setSelectedPrescription(value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectIllness = (value: string) => {
    console.log('Selected value:', value);

    const { illness_id, illness } = JSON.parse(value);
    setSelectedIllness(illness);

    const filteredMedicine = inventoryData?.filter((item) => {
      const associatedIllnessArray = item.associated_Illnesses
        ?.split(',')
        .map((id) => id.trim());

      if (associatedIllnessArray?.includes(illness_id)) {
        console.log('Item:', item);
        return true;
      }
      return false;
    });

    console.log('Filtered medicine:', filteredMedicine);

    setAssociatedPrescription(filteredMedicine || []);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addPrescription.mutate({
      formData,
      illness: selectedIllness,
      prescrip: selectedPrescription,
    });
  };

  const handleClear = () => {
    setFormData({
      date: '',
      studentName: '',
      studentId: '',
      courseYear: '',
      illness: '',
      prescrip: '',
      quantity: '',
      sig: '',
    });
  };

  return (
    <div className="mt-[2rem] h-[70%] rounded-3xl bg-[#526C71] p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transNo" className="text-yellow-100">
              TRANS NO.
            </Label>
            <Input
              placeholder="[Auto-Generated]"
              disabled
              id="transNo"
              name="transNo"
              onChange={handleInputChange}
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
            <Select
              onValueChange={(value) => handleSelectChange('studentId', value)}
            >
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

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="w-full">
            <div>
              <Label htmlFor="illness" className="text-yellow-100">
                ILLNESS
              </Label>
              <Select onValueChange={handleSelectIllness}>
                <SelectTrigger className="border-none bg-[#FFD863] text-[#193F56]">
                  <SelectValue placeholder="Select illness" />
                </SelectTrigger>
                <SelectContent>
                  {illnesses.illness.map((ill, index) => (
                    <SelectItem
                      key={index}
                      value={JSON.stringify({
                        illness_id: ill.ill_id,
                        illness: ill.illness,
                      })}
                    >
                      {ill.illness}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prescription" className="text-yellow-100">
                SUGGESTED PRESCRIPTION
              </Label>
              <Select
                disabled={selectedIllness.length === 0}
                onValueChange={(value) => handleSelectPrescription(value)}
              >
                <SelectTrigger className="border-none bg-[#FFD863] text-[#193F56]">
                  <SelectValue placeholder="Select prescription" />
                </SelectTrigger>
                <SelectContent>
                  {associatedPrescription.map((pres, index) => (
                    <SelectItem key={index} value={pres.itemName}>
                      {pres.itemName} - {pres.quantity}qty
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-full">
                <Label htmlFor="quantity" className="text-yellow-100">
                  QUANTITY:
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="border-none bg-[#FFD863] text-[#193F56]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sig" className="text-yellow-100">
                SIG
              </Label>
              <Input
                id="sig"
                name="sig"
                value={formData.sig}
                onChange={handleInputChange}
                className="border-none bg-[#FDF3C0] text-[#193F56]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="submit"
            className="rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            CONFIRM & PRINT
          </Button>
          <Button
            type="button"
            onClick={handleClear}
            className="w-[8rem] rounded-full bg-[#F2700A]"
          >
            CLEAR
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Prescription;

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

import { IllnessData, PrescriptionData } from '@/data/data';
import illnessJSON from '@/data/illness.json';

import prescriptionJSON from '@/data/medicine.json';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
    transNo: '',
    date: '',
    studentName: '',
    studentId: '',
    courseYear: '',
    illness: '',
    prescription: '',
    quantity: '',
    sig: '',
  });

  const [selectedIllness, setSelectedIllness] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<string[]>(
    [],
  );

  const studentIds = ['S12345', 'S23456', 'S34567', 'S45678'];

  const illnesses: IllnessData = illnessJSON;
  const prescriptions: PrescriptionData = prescriptionJSON;

  const { data: inventoryData } = useFetchInventory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectIllness = (value: string) => {
    console.log('Selected value:', value);

    const { illness_id } = JSON.parse(value);

    const filteredMedicine = inventoryData
      ?.filter((item) => {
        const associatedIllnessArray = item.associated_Illnesses
          ?.split(',')
          .map((id) => id.trim());

        if (associatedIllnessArray?.includes(illness_id)) {
          console.log('Item:', item);
          // setSelectedPrescription([...item.itemName, item.itemName]);
          return true;
        }
        return false;
      })
      .map((item) => item.itemName);

    setSelectedPrescription(filteredMedicine || []);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
  };

  const handleClear = () => {
    setFormData({
      transNo: '',
      date: '',
      studentName: '',
      studentId: '',
      courseYear: '',
      illness: '',
      prescription: '',
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
              disabled
              id="transNo"
              name="transNo"
              value={formData.transNo}
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
                onValueChange={(value) =>
                  handleSelectChange('prescription', value)
                }
              >
                <SelectTrigger className="border-none bg-[#FFD863] text-[#193F56]">
                  <SelectValue placeholder="Select prescription" />
                </SelectTrigger>
                <SelectContent>
                  {selectedPrescription.map((pres, index) => (
                    <SelectItem key={index} value={pres}>
                      {pres}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

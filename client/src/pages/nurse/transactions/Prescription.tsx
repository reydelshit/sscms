import { usePrintPDF } from '@/components/PrintPDF';
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
import { Illness } from '@/data/illness';
import { Students } from '@/data/students';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

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
  studentId: string;
  illness: string;
  prescrip: string;
  quantity: string;
  sig: string;
}

interface StudentPrescriptionData {
  date: string;
  studentName: string;
  studentId: string;
  year: string;
  course: string;
  illness: string;
  quantity: string;
  suggestedPrescription: string;
  sig: string;
}

const useAddPrescription = () => {
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      illness: string;
      prescrip: string;
      year: string;
      course: string;
      studentName: string;
      inventory_id: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/transaction/prescription/create`,
        {
          ...data.formData,
          illness: data.illness,
          prescrip: data.prescrip,
          year: data.year,
          course: data.course,
          studentName: data.studentName,
          inventory_id: data.inventory_id,
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
    studentId: '',
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
  const [search, setSearch] = useState<string>('');
  const { data: inventoryData } = useFetchInventory();
  const addPrescription = useAddPrescription();

  const [studentFullname, setStudentFullname] = useState('');
  const [studentCourseYear, setStudentCourseYear] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [selectedPrescriptionID, setSelectedPrescriptionID] = useState('');
  const generatePDF = usePrintPDF<Record<string, string>>();

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
      year: studentCourseYear,
      course: studentDepartment,
      studentName: studentFullname,
      inventory_id: selectedPrescriptionID,
    });

    generatePDF({
      data: prescriptionData,
      fileName: studentFullname + '_prescription',
      title: 'Prescription',
      subtitle: 'Student Prescription',
      footer: ['Thank you for using our service.'],
    });
  };

  const prescriptionData: Record<string, string> = {
    date: formData.date,
    studentName: studentFullname,
    studentId: formData.studentId || '',
    year: studentCourseYear,
    course: studentDepartment,
    illness: selectedIllness,
    quantity: formData.quantity || '',
    suggestedPrescription: selectedPrescription,
    sig: formData.sig || '',
  };

  const handleClear = () => {
    setFormData({
      date: '',
      studentId: '',
      illness: '',
      prescrip: '',
      quantity: '',
      sig: '',
    });
  };

  return (
    <div className="mt-[2rem] h-[70%] rounded-3xl bg-[#193F56] bg-opacity-75 p-4">
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
              className="rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
              required
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
              className="rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
              required
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
                value={studentFullname}
                onChange={handleInputChange}
                className="rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
                required
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="year" className="text-yellow-100">
                YEAR:
              </Label>
              <Input
                id="year"
                name="year"
                value={studentCourseYear}
                onChange={handleInputChange}
                className="rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
                required
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
            <div className="mb-6">
              <Label htmlFor="course" className="text-yellow-100">
                COURSE:
              </Label>
              <Input
                id="course"
                name="course"
                value={studentDepartment}
                onChange={handleInputChange}
                className="rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="flex w-full gap-4">
            <div className="w-full">
              <div>
                <Label htmlFor="illness" className="text-yellow-100">
                  ILLNESS
                </Label>
                <Select onValueChange={handleSelectIllness}>
                  <SelectTrigger className="rounded-full border-none bg-[#FFD863] text-[#193F56]">
                    <SelectValue placeholder="Select illness" />
                  </SelectTrigger>
                  <SelectContent>
                    {Illness.map((ill, index) => (
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
                  onValueChange={(value) => {
                    const [itemName, inventoryID] = value.split('-');
                    // console.log('Selected prescription:', inventoryID);
                    setSelectedPrescriptionID(inventoryID);
                    handleSelectPrescription(itemName);
                  }}
                >
                  <SelectTrigger className="rounded-full border-none bg-[#FFD863] text-[#193F56]">
                    <SelectValue placeholder="Select prescription" />
                  </SelectTrigger>
                  <SelectContent>
                    {associatedPrescription.length === 0 ? (
                      <SelectItem value="No prescription available">
                        No prescription available
                      </SelectItem>
                    ) : (
                      associatedPrescription.map((pres, index) => (
                        <SelectItem
                          key={index}
                          value={pres.itemName + '-' + pres.inventory_id}
                        >
                          {pres.itemName} - {pres.quantity}qty
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full">
                <Label htmlFor="quantity" className="text-yellow-100">
                  QUANTITY:
                </Label>
                <Input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
                  required
                />
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
                  className="rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row-reverse gap-4">
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

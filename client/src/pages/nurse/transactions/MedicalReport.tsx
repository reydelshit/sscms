import { useState } from 'react';
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

const MedicalReport = () => {
  const [formData, setFormData] = useState({
    transNo: '',
    date: '',
    studentName: '',
    studentId: '',
    courseYear: '',
    remarks: '',
    recommendation: '',
  });

  const handleClear = () => {
    setFormData({
      transNo: '',
      date: '',
      studentName: '',
      studentId: '',
      courseYear: '',
      remarks: '',
      recommendation: '',
    });
  };

  const [selectedStudentID, setSelectedStudentID] = useState('');

  const handleStudentID = (value: string) => {
    setSelectedStudentID(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
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
            <Select onValueChange={(value) => handleStudentID(value)}>
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
            className="h-full border-none bg-[#FDF3C0] text-[#193F56]"
          />
          <Textarea
            placeholder="TREATMENT/RECOMMENDATIONS:"
            className="h-full border-none bg-[#FDF3C0] text-[#193F56]"
          />
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

export default MedicalReport;

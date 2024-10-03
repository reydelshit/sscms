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

const MedCert = () => {
  const [formData, setFormData] = useState({
    transNo: '',
    date: '',
    studentName: '',
    studentId: '',
    address: '',
    age: '',
    gender: '',
    diagnosis: '',
    referenceReason: '',
    referenceClassification: '',
    refferedTo: '',
  });

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
    console.log('Form submitted:', formData);
  };

  const handleClear = () => {
    setFormData({
      transNo: '',
      date: '',
      studentName: '',
      studentId: '',
      address: '',
      age: '',
      gender: '',
      diagnosis: '',
      referenceReason: '',
      referenceClassification: '',
      refferedTo: '',
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
              value={formData.transNo}
              onChange={handleInputChange}
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
          <div className="col-span-2">
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
            <Label htmlFor="referenceReason" className="text-yellow-100">
              REFERENCE REASON:
            </Label>
            <Textarea
              id="referenceReason"
              name="referenceReason"
              value={formData.referenceReason}
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
          <Label htmlFor="refferedTo" className="text-yellow-100">
            REFFERED TO:
          </Label>
          <Input
            id="refferedTo"
            name="refferedTo"
            value={formData.refferedTo}
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

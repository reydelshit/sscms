import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

type MedicalReportType = {
  date: string;
  studentName: string;
  studentId: string;
  course: string;
  year: string;
  remarks: string;
  recom: string;
};

const useFetchMedicalReportById = (id: string) => {
  return useQuery<MedicalReportType>({
    queryKey: ['medicalReportData', id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/medical-history/${id}`,
      );
      return response.data[0] as MedicalReportType;
    },
  });
};

const updateMedicalReportAPI = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: MedicalReportType;
}): Promise<MedicalReportType> => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_LINK}/medical-history/update/${id}`,
    { ...updatedData },
  );
  return response.data;
};

export const useUpdateMedicalHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMedicalReportAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalReportData'] });
      console.log('Successfully updated MedicalReport');
    },
    onError: (error: Error) => {
      console.error('Error updating MedicalReport:', error.message);
    },
  });
};

const EditMedicalHistory = ({
  medicalHistoryID,
}: {
  medicalHistoryID: string;
}) => {
  const {
    data: medicalReportData,
    isLoading,
    isError,
    isSuccess,
  } = useFetchMedicalReportById(medicalHistoryID.toString());

  const updateMutation = useUpdateMedicalHistory();
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    year: '',
    course: '',
    remarks: '',
    recom: '',
    date: '',
  });

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        studentId: medicalReportData.studentId,
        studentName: medicalReportData.studentName,
        year: medicalReportData.year,
        course: medicalReportData.course,
        remarks: medicalReportData.remarks,
        recom: medicalReportData.recom,
        date: medicalReportData.date,
      });
    }
  }, [isSuccess, medicalReportData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      studentId: formData.get('studentId') as string,
      studentName: formData.get('studentName') as string,
      year: formData.get('year') as string,
      course: formData.get('course') as string,
      remarks: formData.get('remarks') as string,
      recom: formData.get('recom') as string,
      date: formData.get('date') as string,
    };

    updateMutation.mutate({ id: medicalHistoryID, updatedData });

    console.log({
      id: medicalHistoryID,
      updatedData,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <Label>Student ID</Label>
          <Input
            defaultValue={formData.studentId}
            type="text"
            name="studentId"
          />
        </div>

        <div>
          <Label>Student Name</Label>
          <Input
            defaultValue={formData.studentName}
            type="text"
            name="studentName"
          />
        </div>

        <div>
          <Label>Year</Label>
          <Input defaultValue={formData.year} type="text" name="year" />
        </div>

        <div>
          <Label>Course</Label>
          <Input defaultValue={formData.course} type="text" name="course" />
        </div>

        <div>
          <Label>FINDINGS/SYMPTOMS/REMARKS</Label>
          <Input defaultValue={formData.remarks} type="text" name="remarks" />
        </div>

        <div>
          <Label>TREATMENT/RECOMMENDATION</Label>
          <Input defaultValue={formData.recom} type="text" name="recom" />
        </div>

        <div>
          <Label>Date</Label>
          <Input
            defaultValue={formData.date ? formData.date.split('T')[0] : ''}
            type="date"
            name="date"
          />
        </div>

        <div className="my-4 flex gap-2">
          <Button type="submit">Save</Button>
          <DialogClose>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </div>
      </form>
    </div>
  );
};

export default EditMedicalHistory;

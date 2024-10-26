import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface VolunteerItem {
  student_id: string;
  student_name: string;
  course: string;
  phone_number: string;
  email: string;
  created_at: string;
  volunteer_id: string;
  year: string;
}

type FormDataType = {
  student_id: string;
  student_name: string;
  course: string;
  phone_number: string;
  email: string;
  year: string;
};

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

const useFetchVolunteerById = (id: string) => {
  return useQuery<VolunteerItem>({
    queryKey: ['volunteerData', id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/volunteer/${id}`,
      );
      return response.data[0] as VolunteerItem;
    },
  });
};

const updateVolunteerAPI = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: FormDataType;
}): Promise<VolunteerItem> => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_LINK}/volunteer/update/${id}`,
    { ...updatedData },
  );
  return response.data;
};

export const useUpdateVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVolunteerAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteerList'] });
      console.log('Successfully updated Volunteer');

      toast({
        title: 'Volunteer updated successfully',
        description: new Date().toLocaleDateString(),
      });

      queryClient.invalidateQueries({ queryKey: ['volunteerList'] });
      queryClient.invalidateQueries({ queryKey: ['volunteerData'] });
    },
    onError: (error: Error) => {
      console.error('Error updating Volunteer:', error.message);
    },
  });
};

const EditVolunteer = ({ volunteerID }: { volunteerID: string }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    course: '',
    phone_number: '',
    email: '',
    year: '',
  });

  const updateMutation = useUpdateVolunteer();

  const {
    data: volunteerItem,
    isLoading,
    isError,
    isSuccess,
  } = useFetchVolunteerById(volunteerID.toString());

  useEffect(() => {
    if (isSuccess) {
      console.log(volunteerItem, 'ssss course');
      setFormData({
        student_id: volunteerItem.student_id,
        student_name: volunteerItem.student_name,
        course: volunteerItem.course,
        phone_number: volunteerItem.phone_number,
        email: volunteerItem.email,
        year: volunteerItem.year,
      });
    }
  }, [isSuccess, volunteerItem]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  if (!volunteerItem) return <div>No data found</div>;

  //   console.log('Data:', VolunteerItem);

  const handleInputChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((values) => ({ ...values, [name]: value }));
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');

    const updatedData = {
      ...formData,
    };

    console.log('Updated data:', updatedData);

    updateMutation.mutate({ id: volunteerID, updatedData });
  };

  return (
    <div className="flex w-full flex-col items-center gap-[1rem] p-2">
      <form className="w-full px-4 text-start" onSubmit={handleSubmitUpdate}>
        <div>
          <Label>Student ID:</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="student_id"
            defaultValue={volunteerItem?.student_id}
          />
        </div>

        <div>
          <Label>Student Name:</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="student_name"
            defaultValue={volunteerItem?.student_name}
          />
        </div>

        <div>
          <Label>Course</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="course"
            defaultValue={volunteerItem?.course}
          />
        </div>

        <div>
          <Label>Year</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="year"
            defaultValue={volunteerItem?.year}
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="phone_number"
            defaultValue={volunteerItem?.phone_number}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="email"
            defaultValue={volunteerItem?.email}
          />
        </div>

        <Button className="my-4" type="submit">
          Update Volunteer
        </Button>
      </form>
    </div>
  );
};

export default EditVolunteer;

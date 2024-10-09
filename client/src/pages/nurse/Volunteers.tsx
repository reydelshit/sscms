import BGPage from '@/assets/bg-page.png';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import PaginationTemplate from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/hooks/usePagination';
import Moment from '@/lib/Moment';
import { useState } from 'react';
import AddVolunteer from './volunteer/AddVolunteer';
import EditVolunteer from './volunteer/EditVolunteer';

interface VolunteerItem {
  student_id: string;
  student_name: string;
  course_year: string;
  phone_number: string;
  email: string;
  created_at: string;
  volunteer_id: string;
}

const useFetchVolunteer = () => {
  return useQuery<VolunteerItem[]>({
    queryKey: ['volunteerData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/volunteer`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const deleteVolunteer = async (id: string): Promise<void> => {
  await axios.delete(`${import.meta.env.VITE_API_LINK}/volunteer/delete/${id}`);
};

export const useDeleteVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteerData'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting Volunteer:', error.message);
    },
  });
};

const Volunteers = () => {
  const deleteMutation = useDeleteVolunteer();
  const { data, isLoading, error, isError } = useFetchVolunteer();
  const [search, setSearch] = useState<string>('');

  const filteredAttendance = data?.filter((item) =>
    item.student_name.toLowerCase().includes(search.toLowerCase()),
  );

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 5,
      data: filteredAttendance || [],
    });

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[2rem] h-[80%] rounded-3xl bg-[#526C71] bg-opacity-85 p-4 text-[#FDF3C0]">
        <Dialog>
          <DialogTrigger>
            <Button>ADD VOLUNTEEER</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="hidden">
                <DialogTitle>Edit student details</DialogTitle>
                <DialogDescription>
                  Fill in the form to edit student details
                </DialogDescription>
              </div>
            </DialogHeader>

            <AddVolunteer />
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table className="h-[300px] max-h-[300px] border-2">
            <TableHeader>
              <TableRow className="bg-[#99ACFF] !text-black">
                <TableHead className="text-black">STUDENT ID</TableHead>
                <TableHead className="text-black">STUDENT NAME</TableHead>
                <TableHead className="text-black">COURSE/YEAR</TableHead>
                <TableHead className="text-black">PHONE NUMBER.</TableHead>
                <TableHead className="text-black">EMAIL</TableHead>
                <TableHead className="text-black">CREATED AT</TableHead>
                <TableHead className="text-black">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems &&
                currentItems?.map((vol, index) => (
                  <TableRow className="bg-[#CDD6FF] text-black" key={index}>
                    <TableCell>{vol.student_id}</TableCell>
                    <TableCell>{vol.student_name}</TableCell>
                    <TableCell>{vol.course_year}</TableCell>
                    <TableCell>{vol.phone_number}</TableCell>
                    <TableCell>{vol.email}</TableCell>
                    <TableCell>
                      <Moment time={vol.created_at} />
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger>Update</DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <div className="hidden">
                                <DialogTitle>Edit student details</DialogTitle>
                                <DialogDescription>
                                  Fill in the form to edit student details
                                </DialogDescription>
                              </div>
                            </DialogHeader>

                            <EditVolunteer volunteerID={vol.volunteer_id} />
                          </DialogContent>
                        </Dialog>

                        <Button onClick={() => handleDelete(vol.volunteer_id)}>
                          DELETE
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

        <PaginationTemplate
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Volunteers;

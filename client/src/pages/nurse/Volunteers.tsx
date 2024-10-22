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

import DeleteMakeSure from '@/components/DeleteMakeSure';
import Moment from '@/components/Moment';
import PaginationTemplate from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/hooks/usePagination';
import { useState } from 'react';
import AddVolunteer from './volunteer/AddVolunteer';
import EditVolunteer from './volunteer/EditVolunteer';

interface VolunteerItem {
  student_id: string;
  student_name: string;
  course: string;
  year: string;
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
      <div className="mt-[2rem] h-[80%] rounded-3xl bg-[#193F56] bg-opacity-75 p-4 text-[#FDF3C0]">
        <div className="flex w-full justify-between gap-4">
          <h1 className="text-[2rem] font-semibold text-[#FDF3C0]">
            VOLUNTEERS
          </h1>
          <div className="flex w-[40%] items-end justify-end gap-4">
            <Dialog>
              <DialogTrigger>
                <Button className="rounded-3xl bg-green-500">
                  ADD VOLUNTEEER
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[50%]">
                <DialogHeader>
                  <div>
                    <DialogTitle>Add volunteer account</DialogTitle>
                    <DialogDescription>
                      Fill in the form to add a new volunteer account
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <AddVolunteer />
              </DialogContent>
            </Dialog>

            <Input
              placeholder="Search"
              className="w-[250px] rounded-full border-none bg-[#FDF3C0] text-[#193F56]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-[2rem] h-full overflow-hidden rounded-3xl">
            <Table className="h-[300px] max-h-[300px]">
              <TableHeader>
                <TableRow className="bg-[#99ACFF] !text-black">
                  <TableHead className="text-black">STUDENT ID</TableHead>
                  <TableHead className="text-black">STUDENT NAME</TableHead>
                  <TableHead className="text-black">COURSE</TableHead>
                  <TableHead className="text-black">YEAR</TableHead>
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
                      <TableCell>{vol.course}</TableCell>
                      <TableCell>{vol.year}</TableCell>
                      <TableCell>{vol.phone_number}</TableCell>
                      <TableCell>{vol.email}</TableCell>
                      <TableCell>
                        <Moment time={vol.created_at} />
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger className="w-full rounded-full bg-[#FFA114] p-2 font-semibold text-white">
                              Update
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <div className="hidden">
                                  <DialogTitle>
                                    Edit student details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Fill in the form to edit student details
                                  </DialogDescription>
                                </div>
                              </DialogHeader>

                              <EditVolunteer volunteerID={vol.volunteer_id} />
                            </DialogContent>
                          </Dialog>

                          <DeleteMakeSure
                            deleteAction={() => handleDelete(vol.volunteer_id)}
                          >
                            <Button className="w-full cursor-pointer rounded-full bg-red-500 p-2 font-semibold text-white">
                              DELETE
                            </Button>
                          </DeleteMakeSure>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
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

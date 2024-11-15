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
import { useEffect, useState } from 'react';
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

interface TimeEntry {
  dtr_id?: string;
  date: string;
  timeInMorning: string;
  timeOutMorning: string;
  timeInAfternoon: string;
  timeOutAfternoon: string;
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

const useFetchDTR = (userId: string) => {
  return useQuery<TimeEntry[]>({
    queryKey: ['dtrData', userId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/dtr/${userId}`,
      );
      return response.data;
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });
};

const Volunteers = () => {
  const deleteMutation = useDeleteVolunteer();
  const { data, isLoading, error, isError } = useFetchVolunteer();
  const [search, setSearch] = useState<string>('');
  const [userID, setUserID] = useState<string>('');

  const {
    data: entries,
    isLoading: isLoadingDTR,
    isError: isErrorDTR,
    refetch: triggerFetch,
  } = useFetchDTR(userID);

  useEffect(() => {
    if (userID) {
      triggerFetch();
    }
  }, [userID, triggerFetch]);

  const filteredAttendance = data?.filter((item) =>
    item.student_name.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    currentItems: DTRItems,
    totalPages: DTRTotalPages,
    currentPage: DTRCurrentPage,
    handlePageChange: DTRHandlePageCHange,
  } = usePagination({
    itemsPerPage: 5,
    data: entries || [],
  });

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

                          <Dialog>
                            <DialogTrigger
                              onClick={() => {
                                setUserID(vol.volunteer_id);
                                console.log(vol.volunteer_id);
                              }}
                              className="w-full rounded-full bg-[#536C70] p-2 font-semibold text-white"
                            >
                              View DTR
                            </DialogTrigger>
                            <DialogContent className="min-h-[40%] w-[60%] bg-[#536C70]">
                              <DialogHeader>
                                <div>
                                  <DialogTitle className="text-white">
                                    {vol.student_name}
                                  </DialogTitle>
                                  <DialogDescription className="text-white">
                                    View {vol.student_name}'s daily time record
                                  </DialogDescription>
                                </div>
                              </DialogHeader>

                              {isLoadingDTR ? (
                                <p>Loading...</p>
                              ) : isErrorDTR ? (
                                <p>
                                  Failed to load data. Please try again later.
                                </p>
                              ) : (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="bg-[#FFD699] text-black">
                                        Date
                                      </TableHead>
                                      <TableHead className="bg-[#95CCD5] text-black">
                                        Time In (Morning)
                                      </TableHead>
                                      <TableHead className="bg-[#95CCD5] text-black">
                                        Time Out (Morning)
                                      </TableHead>
                                      <TableHead className="bg-[#FFD863] text-black">
                                        Time In (Afternoon)
                                      </TableHead>
                                      <TableHead className="bg-[#FFD863] text-black">
                                        Time Out (Afternoon)
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="bg-[#99ACFF] !text-black">
                                    {entries && entries?.length > 0 ? (
                                      DTRItems?.map((entry) => (
                                        <TableRow key={entry.dtr_id}>
                                          <TableCell className="bg-[#FFEBCD] text-black">
                                            {entry.date}
                                          </TableCell>
                                          <TableCell className="bg-[#CDE9FF] text-black">
                                            {entry.timeInMorning}
                                          </TableCell>
                                          <TableCell className="bg-[#CDE9FF] text-black">
                                            {entry.timeOutMorning}
                                          </TableCell>
                                          <TableCell className="bg-[#FEF7E5] text-black">
                                            {entry.timeInAfternoon}
                                          </TableCell>
                                          <TableCell className="bg-[#FEF7E5] text-black">
                                            {entry.timeOutAfternoon}
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow className="text-center">
                                        <TableCell colSpan={5}>
                                          No records found
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              )}

                              <PaginationTemplate
                                totalPages={DTRTotalPages}
                                currentPage={DTRCurrentPage}
                                handlePageChange={DTRHandlePageCHange}
                              />
                            </DialogContent>
                          </Dialog>
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

import BGPage from '@/assets/bg-page.png';
import Dep from '@/assets/dep.png';
import { Input } from '@/components/ui/input';
import { SchoolDepartment } from '@/data/department';
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

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Moment from '@/lib/Moment';
import usePagination from '@/hooks/usePagination';
import { useState } from 'react';
import PaginationTemplate from '@/components/Pagination';

type MedicalReportType = {
  date: string;
  studentName: string;
  studentId: string;
  course: string;
  year: string;
  remarks: string;
  recom: string;
  med_rep_id: string;
};

const useFetchMedicalHistory = () => {
  return useQuery<MedicalReportType[]>({
    queryKey: ['medicalReportData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/medical-history`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const deleteVolunteer = async (id: string): Promise<void> => {
  await axios.delete(
    `${import.meta.env.VITE_API_LINK}/medical-history/delete/${id}`,
  );
};

export const useDeleteMedicalHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalReportData'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting Volunteer:', error.message);
    },
  });
};

const MedicalHistory = () => {
  const {
    data: medicalHistoryData,
    isLoading,
    error,
    isError,
  } = useFetchMedicalHistory();

  const [search, setSearch] = useState<string>('');
  const deleteMutation = useDeleteMedicalHistory();

  const filteredAttendance = medicalHistoryData?.filter((item) =>
    item.studentName.toLowerCase().includes(search.toLowerCase()),
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
      className="h-full min-h-screen w-full overflow-y-hidden bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[1rem] h-fit w-full rounded-3xl bg-[#526C71] p-4 text-[#FDF3C0]">
        <div className="my-2 flex items-center justify-between">
          <h1 className="text-[2rem]">MEDICAL HISTORY</h1>
          <Input className="w-[40%]" placeholder="Search Department" />
        </div>
        <div className="custom-scrollbar flex h-full max-h-[15rem] w-full flex-nowrap gap-4 overflow-x-auto scroll-smooth whitespace-nowrap rounded-full bg-[#274A5D] px-4">
          {SchoolDepartment.map((dep, index) => (
            <div
              key={index}
              className="flex w-[20rem] flex-none flex-col items-center justify-center gap-4 px-[4rem]"
            >
              <img src={Dep} alt="department" className="w-h-28 h-28" />
              <p className="mb-[1rem] w-full rounded-full bg-[#FFD863] p-2 text-center text-xl font-semibold text-black">
                {dep.course_name}
              </p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-[2rem] border-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#99ACFF] !text-black">
                  <TableHead className="text-black">STUDENT ID</TableHead>
                  <TableHead className="text-black">STUDENT NAME</TableHead>
                  <TableHead className="text-black">COURSE/YEAR</TableHead>
                  <TableHead className="text-black">
                    FINDINGS/SYMPTOMS/REMARKS{' '}
                  </TableHead>
                  <TableHead className="text-black">
                    TREATMENT/RECOMMENDATION
                  </TableHead>
                  <TableHead className="text-black">DATE</TableHead>
                  <TableHead className="text-black">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems &&
                  currentItems?.map((vol, index) => (
                    <TableRow
                      className="h-[1rem] bg-[#CDD6FF] text-sm text-black"
                      key={index}
                    >
                      <TableCell>{vol.studentId}</TableCell>
                      <TableCell>{vol.studentName}</TableCell>
                      <TableCell>
                        {vol.course} {vol.year}
                      </TableCell>
                      <TableCell>{vol.remarks}</TableCell>
                      <TableCell>{vol.recom}</TableCell>
                      <TableCell>
                        <Moment time={vol.date} />
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger>Update</DialogTrigger>
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

                              {/* <EditVolunteer volunteerID={vol.volunteer_id} /> */}
                            </DialogContent>
                          </Dialog>

                          <Button onClick={() => handleDelete(vol.med_rep_id)}>
                            DELETE
                          </Button>
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

export default MedicalHistory;

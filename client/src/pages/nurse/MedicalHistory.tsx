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

import PaginationTemplate from '@/components/Pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/hooks/usePagination';
import Moment from '@/components/Moment';
import { useState } from 'react';
import EditMedicalHistory from '../medical-history/EditMedicalHistory';
import { Button } from '@/components/ui/button';
import DeleteMakeSure from '@/components/DeleteMakeSure';

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

const deleteMedicalReport = async (id: string): Promise<void> => {
  await axios.delete(
    `${import.meta.env.VITE_API_LINK}/medical-history/delete/${id}`,
  );
};

export const useDeleteMedicalHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedicalReport,
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

  const deleteMutation = useDeleteMedicalHistory();
  const [searchDepartment, setSearchDepartment] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 3,
      data: medicalHistoryData || [],
    });

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[2rem] h-[70%] rounded-3xl bg-[#193F56] bg-opacity-75 p-4">
        <div className="my-2 flex items-center justify-between">
          <h1 className="text-[2rem] font-semibold text-[#FDF3C0]">
            MEDICAL HISTORY
          </h1>
          <Input
            onChange={(e) => setSearchDepartment(e.target.value)}
            className="w-[40%] rounded-full"
            placeholder="Search Department"
          />
        </div>
        <div className="custom-scrollbar flex h-screen max-h-[15rem] w-full flex-nowrap overflow-x-auto scroll-smooth whitespace-nowrap rounded-full bg-[#274A5D] px-4">
          <div className="flex w-[15rem] flex-none flex-col items-center justify-center gap-2 px-[4rem]">
            <img src={Dep} alt="department" className="w-h-28 h-28" />
            <span
              onClick={() => setSelectedDepartment('All')}
              className={`mb-[1rem] w-fit min-w-full cursor-pointer rounded-full ${selectedDepartment === 'All' ? 'bg-[#FFA114]' : 'bg-[#FFD863]'} p-2 text-center text-xl font-semibold text-black`}
            >
              All
            </span>
          </div>
          {SchoolDepartment.length > 0 ? (
            SchoolDepartment.filter((dep) =>
              dep.course_name
                .toLowerCase()
                .includes(searchDepartment.toLowerCase()),
            ).length > 0 ? (
              SchoolDepartment.filter((dep) =>
                dep.course_name
                  .toLowerCase()
                  .includes(searchDepartment.toLowerCase()),
              ).map((dep, index) => (
                <div
                  key={index}
                  className="flex w-[15rem] flex-none flex-col items-center justify-center gap-4 px-[4rem]"
                >
                  <img src={Dep} alt="department" className="w-h-28 h-28" />

                  <span
                    onClick={() => setSelectedDepartment(dep.course_name)}
                    className={`mb-[1rem] w-fit min-w-full cursor-pointer rounded-full ${selectedDepartment === dep.course_name ? 'bg-[#FFA114]' : 'bg-[#FFD863]'} p-2 text-center text-xl font-semibold text-black`}
                  >
                    {dep.course_name}
                  </span>
                </div>
              ))
            ) : (
              <p className="flex h-[10rem] items-center justify-center text-center text-white">
                No department found
              </p>
            )
          ) : (
            <p>No departments available</p>
          )}
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-[2rem] h-full overflow-hidden rounded-3xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FFD699] !text-black">
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
                currentItems?.filter(
                  (dep) =>
                    selectedDepartment === 'All' ||
                    dep.course
                      .toLowerCase()
                      .includes(selectedDepartment.toLowerCase()),
                ).length > 0 ? (
                  currentItems
                    ?.filter(
                      (dep) =>
                        selectedDepartment === 'All' ||
                        dep.course
                          .toLowerCase()
                          .includes(selectedDepartment.toLowerCase()),
                    )
                    .map((vol, index) => (
                      <TableRow
                        className="h-[1rem] bg-white text-sm text-black"
                        key={index}
                      >
                        <TableCell className="bg-[#FFEBCD]">
                          {vol.studentId}
                        </TableCell>
                        <TableCell className="bg-[#FFF4E3]">
                          {vol.studentName}
                        </TableCell>
                        <TableCell className="bg-[#FFF4E3]">
                          {vol.course} {vol.year}
                        </TableCell>
                        <TableCell className="bg-[#FFF4E3]">
                          {vol.remarks}
                        </TableCell>
                        <TableCell className="bg-[#FFF4E3]">
                          {vol.recom}
                        </TableCell>
                        <TableCell className="bg-[#FFF4E3]">
                          <Moment time={vol.date} />
                        </TableCell>

                        <TableCell className="bg-[#FFF4E3]">
                          <div className="flex flex-col gap-2">
                            <Dialog>
                              <DialogTrigger className="w-full rounded-full bg-[#FFA114] p-2 font-semibold text-white">
                                Update
                              </DialogTrigger>
                              <DialogContent className="w-[60%]">
                                <DialogHeader>
                                  <div>
                                    <DialogTitle>
                                      Edit Medical Report Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      Fill in the form to edit details
                                    </DialogDescription>
                                  </div>
                                </DialogHeader>

                                <EditMedicalHistory
                                  medicalHistoryID={vol.med_rep_id}
                                />
                              </DialogContent>
                            </Dialog>

                            <DeleteMakeSure
                              deleteAction={() => handleDelete(vol.med_rep_id)}
                            >
                              <Button className="w-full cursor-pointer rounded-full bg-red-500 p-2 font-semibold text-white">
                                DELETE
                              </Button>
                            </DeleteMakeSure>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow className="h-[8rem] bg-white text-sm text-black">
                    <TableCell colSpan={7} className="text-center">
                      No medical history found
                    </TableCell>
                  </TableRow>
                )}
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

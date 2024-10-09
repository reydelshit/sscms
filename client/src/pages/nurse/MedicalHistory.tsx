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
  const [searchDepartment, setSearchDepartment] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

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
      <div className="mt-[1rem] h-fit w-full rounded-3xl bg-[#526C71] p-4">
        <div className="my-2 flex items-center justify-between">
          <h1 className="text-[2rem] font-semibold text-[#FDF3C0]">
            MEDICAL HISTORY
          </h1>
          <Input
            onChange={(e) => setSearchDepartment(e.target.value)}
            className="w-[40%]"
            placeholder="Search Department"
          />
        </div>
        <div className="custom-scrollbar flex h-full max-h-[15rem] w-full flex-nowrap gap-2 overflow-x-auto scroll-smooth whitespace-nowrap rounded-full bg-[#274A5D] px-4">
          <div className="flex w-[15rem] flex-none flex-col items-center justify-center gap-4 px-[4rem]">
            <img src={Dep} alt="department" className="w-h-28 h-28" />
            <span
              onClick={() => setSelectedDepartment('All')}
              className="mb-[1rem] w-fit min-w-full cursor-pointer rounded-full bg-[#FFD863] p-2 text-center text-xl font-semibold text-black"
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
                    className="mb-[1rem] w-fit min-w-full cursor-pointer rounded-full bg-[#FFD863] p-2 text-center text-xl font-semibold text-black"
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
          <div className="mt-[2rem] border-2">
            {/* <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Student ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Student Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Course/Year
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Findings/Symptoms/Remarks
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Treatment/Recommendation
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Edit</span>
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems &&
                    currentItems?.map((med, index) => (
                      <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                        >
                          {med.studentId}
                        </th>
                        <td className="px-6 py-4">{med.studentName}</td>
                        <td className="px-6 py-4">
                          {med.course} - {med.year}
                        </td>
                        <td className="px-6 py-4">{med.remarks}</td>
                        <td className="px-6 py-4">{med.recom}</td>
                        <td className="px-6 py-4">
                          <Moment time={med.date} />
                        </td>

                        <td className="px-6 py-4 text-right">
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
                              </DialogContent>
                            </Dialog>

                            <span onClick={() => handleDelete(med.med_rep_id)}>
                              DELETE
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div> */}

            <Table>
              <TableHeader>
                <TableRow className="bg-white !text-black">
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
                    selectedDepartment === 'All' || // If 'All' is selected, display all items
                    dep.course
                      .toLowerCase()
                      .includes(selectedDepartment.toLowerCase()),
                ).length > 0 ? (
                  currentItems
                    ?.filter(
                      (dep) =>
                        selectedDepartment === 'All' || // Apply the same logic here
                        dep.course
                          .toLowerCase()
                          .includes(selectedDepartment.toLowerCase()),
                    )
                    .map((vol, index) => (
                      <TableRow
                        className="h-[1rem] bg-white text-sm text-black"
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
                              </DialogContent>
                            </Dialog>

                            <span onClick={() => handleDelete(vol.med_rep_id)}>
                              DELETE
                            </span>
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

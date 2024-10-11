import BGPage from '@/assets/bg-page.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import usePagination from '@/hooks/usePagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import PaginationTemplate from '@/components/Pagination';
import Moment from '@/lib/Moment';
import { ExportToPDF } from '@/components/ExportToPdf';

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

const CaseReport = () => {
  const {
    data: medicalHistoryData,
    isLoading,
    error,
    isError,
  } = useFetchMedicalHistory();

  const [search, setSearch] = useState('');
  const filteredAttendance = medicalHistoryData?.filter((item) =>
    item.studentName.toLowerCase().includes(search.toLowerCase()),
  );

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('All');

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 5,
      data: filteredAttendance || [],
    });

  return (
    <div
      className="h-full min-h-screen w-full overflow-y-hidden bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[1rem] h-fit w-full rounded-3xl bg-[#526C71] bg-opacity-85 p-4 text-center">
        <h1 className="text-2xl font-semibold text-[#FFD863]">
          MONTHLY CASE REPORT
        </h1>

        <div className="my-4 flex gap-4">
          <Select onValueChange={(value) => setSelectedMonth(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: new Date().getFullYear() - 1999 + 1 },
                (_, i) => (
                  <SelectItem
                    key={i}
                    value={(new Date().getFullYear() - i).toString()}
                  >
                    {new Date().getFullYear() - i}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full border-none bg-[#FFD863] text-[#193F56]"
          />

          <ExportToPDF
            data={currentItems?.filter((dep) => {
              const depYear = String(new Date(dep.date).getFullYear());
              const depMonth = String(new Date(dep.date).getMonth() + 1);

              if (!selectedYear || !selectedMonth) {
                return true;
              }

              const isYearMatch = selectedYear
                ? depYear === selectedYear
                : false;
              const isMonthMatch = selectedMonth
                ? depMonth === selectedMonth
                : false;

              return isYearMatch || isMonthMatch;
            })}
            fileName="case-report"
          />
        </div>

        <div>
          <h1 className="w-full text-start text-2xl font-semibold text-[#FFD863]">
            CASE REPORT
          </h1>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="mt-[2rem] border-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white !text-black">
                    <TableHead className="text-center text-black">
                      DATE
                    </TableHead>
                    <TableHead className="text-center text-black">
                      STUDENT NAME
                    </TableHead>
                    <TableHead className="text-center text-black">
                      COURSE/YEAR
                    </TableHead>
                    <TableHead className="text-center text-black">
                      CASE
                    </TableHead>
                    <TableHead className="text-center text-black">
                      TREATMENT
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems &&
                  currentItems?.filter((dep) => {
                    const depDate = new Date(dep.date);
                    const depYear = depDate.getFullYear().toString();
                    const depMonth = (depDate.getMonth() + 1).toString();

                    if (!selectedYear && selectedMonth === 'All') {
                      return true;
                    }

                    const isYearMatch =
                      !selectedYear || depYear === selectedYear;
                    const isMonthMatch =
                      selectedMonth === 'All' || depMonth === selectedMonth;

                    return isYearMatch && isMonthMatch;
                  }).length > 0 ? (
                    currentItems
                      ?.filter((dep) => {
                        const depYear = String(
                          new Date(dep.date).getFullYear(),
                        );
                        const depMonth = String(
                          new Date(dep.date).getMonth() + 1,
                        );

                        if (!selectedYear || !selectedMonth) {
                          return true;
                        }

                        const isYearMatch = selectedYear
                          ? depYear === selectedYear
                          : false;
                        const isMonthMatch = selectedMonth
                          ? depMonth === selectedMonth
                          : false;

                        return isYearMatch || isMonthMatch;
                      })
                      .map((vol, index) => (
                        <TableRow
                          className="h-[1rem] bg-white text-sm text-black"
                          key={index}
                        >
                          <TableCell>
                            <Moment time={vol.date} />
                          </TableCell>
                          <TableCell>{vol.studentName}</TableCell>
                          <TableCell>
                            {vol.course} {vol.year}
                          </TableCell>
                          <TableCell>{vol.remarks}</TableCell>
                          <TableCell>{vol.recom}</TableCell>
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
    </div>
  );
};

export default CaseReport;

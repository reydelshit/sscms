import BGPage from '@/assets/bg-page.png';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface TimeEntry {
  dtr_id?: string;
  date: string;
  timeInMorning: string;
  timeOutMorning: string;
  timeInAfternoon: string;
  timeOutAfternoon: string;
  user_id: string;
}

const API_URL = import.meta.env.VITE_API_LINK;

const useFetchDTR = (userId: string) => {
  return useQuery<TimeEntry[]>({
    queryKey: ['dtrData', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/dtr/${userId}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const useCreateOrUpdateDTR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TimeEntry) => {
      if (data.dtr_id) {
        // Update existing entry
        const response = await axios.put(
          `${API_URL}/dtr/update/${data.dtr_id}`,
          data,
        );
        return response.data;
      } else {
        // Create new entry
        const response = await axios.post(`${API_URL}/dtr/create`, data);
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        console.log('DTR successfully created/updated:', data);
        toast({
          title: 'DTR successfully created/updated',
          description: new Date().toLocaleTimeString(),
        });
        queryClient.invalidateQueries({ queryKey: ['dtrData'] });
      }
    },
    onError: (error) => {
      console.error('Error creating/updating DTR:', error);
      toast({
        title: 'Error creating/updating DTR',
        description: error.message || 'Something went wrong.',
      });
    },
  });
};

export default function DailyTimeRecord() {
  const userId = '1';
  const { data: entries, isLoading, isError } = useFetchDTR(userId);
  const createOrUpdateDTR = useCreateOrUpdateDTR();

  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-GB'));
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeClick = () => {
    setIsDialogOpen(true);
  };

  const confirmTimeLog = async () => {
    const todayEntry = entries?.find((entry) => entry.date === currentDate);
    let updatedEntry: TimeEntry = todayEntry
      ? { ...todayEntry }
      : {
          date: currentDate,
          timeInMorning: '',
          timeOutMorning: '',
          timeInAfternoon: '',
          timeOutAfternoon: '',
          user_id: userId,
        };

    if (!todayEntry || !todayEntry.timeInMorning) {
      updatedEntry.timeInMorning = currentTime;
    } else if (!todayEntry.timeOutMorning) {
      updatedEntry.timeOutMorning = currentTime;
    } else if (!todayEntry.timeInAfternoon) {
      updatedEntry.timeInAfternoon = currentTime;
    } else if (!todayEntry.timeOutAfternoon) {
      updatedEntry.timeOutAfternoon = currentTime;
    }

    try {
      await createOrUpdateDTR.mutateAsync(updatedEntry);
    } catch (error) {
      console.error('Error creating/updating DTR:', error);
      toast({
        title: 'Error creating/updating DTR',
        description:
          'Something went wrong while creating/updating the DTR entry.',
      });
    }

    setIsDialogOpen(false);
  };

  const handleNewEntry = () => {
    const newEntry: TimeEntry = {
      date: currentDate,
      timeInMorning: '',
      timeOutMorning: '',
      timeInAfternoon: '',
      timeOutAfternoon: '',
      user_id: userId,
    };

    createOrUpdateDTR.mutate(newEntry);
  };

  const isLogTimeDisabled: boolean = useMemo(() => {
    if (!entries) return false;
    const todayEntry = entries.find((entry) => entry.date === currentDate);
    return !!(
      todayEntry &&
      todayEntry.timeInMorning &&
      todayEntry.timeOutMorning &&
      todayEntry.timeInAfternoon &&
      todayEntry.timeOutAfternoon
    );
  }, [entries, currentDate]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading DTR entries</div>;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[2rem] rounded-3xl bg-[#193F56] bg-opacity-75 p-4 text-[#FDF3C0]">
        <div className="mb-4 rounded-lg p-4">
          <div className="inline-flex h-[8rem] w-full items-center rounded-3xl bg-[#FDF3C0]">
            <h2 className="mb-2 p-4 text-2xl font-semibold text-black">
              Date: {currentDate}
            </h2>
          </div>

          <div className="mt-2 inline-flex h-[8rem] w-full items-center rounded-3xl bg-[#FDF3C0]">
            <h2 className="mb-2 p-4 text-2xl font-semibold text-black">
              Time: {currentTime}
            </h2>
          </div>

          <div className="mt-4 flex w-full flex-row justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleTimeClick}
                  className="mr-2 h-[3rem] w-[10rem] rounded-full bg-[#FFA114] text-xl"
                  disabled={isLogTimeDisabled}
                >
                  Log Time
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Time Log</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to log the time {currentTime}? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={confirmTimeLog}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* <Button
              onClick={handleNewEntry}
              className="mr-2 h-[3rem] w-[10rem] rounded-full bg-[#FFA114] text-xl"
            >
              New Entry
            </Button> */}
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-3xl bg-[#CDD6FF] text-black">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-[#FFD699] text-black">Date</TableHead>
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
            <TableBody>
              {entries?.map((entry) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

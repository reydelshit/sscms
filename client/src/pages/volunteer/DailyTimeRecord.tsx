'use client';

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

// Custom hook to fetch DTR entries for a user
const useFetchDTR = (userId: string) => {
  return useQuery<TimeEntry[]>({
    queryKey: ['dtrData', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/dtr/${userId}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
  });
};

// Custom hook to create or update a DTR entry
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
  const userId = '1'; // Replace with actual user ID when available
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
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-2xl font-bold">Date: {currentDate}</h2>
        <h3 className="mb-4 text-xl">Time: {currentTime}</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleTimeClick}
              className="mr-2"
              disabled={isLogTimeDisabled}
            >
              Log Time
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Time Log</DialogTitle>
              <DialogDescription>
                Are you sure you want to log the time {currentTime}? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmTimeLog}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button onClick={handleNewEntry}>New Entry</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time In (Morning)</TableHead>
            <TableHead>Time Out (Morning)</TableHead>
            <TableHead>Time In (Afternoon)</TableHead>
            <TableHead>Time Out (Afternoon)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries?.map((entry) => (
            <TableRow key={entry.dtr_id}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.timeInMorning}</TableCell>
              <TableCell>{entry.timeOutMorning}</TableCell>
              <TableCell>{entry.timeInAfternoon}</TableCell>
              <TableCell>{entry.timeOutAfternoon}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

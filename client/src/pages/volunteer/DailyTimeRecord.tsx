import BGPage from '@/assets/bg-page.png';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface TimeEntry {
  dtr_id: number;
  date: string;
  timeInMorning: string | null;
  timeOutMorning: string | null;
  timeInAfternoon: string | null;
  timeOutAfternoon: string | null;
  user_id: number;
}

// Custom hook to fetch DTR entries for a user
const useFetchDTR = (id: string) => {
  return useQuery<TimeEntry[]>({
    queryKey: ['dtrData', id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/dtr/${id}`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
  });
};

// Custom hook to create a new DTR entry
const useCreateDTR = () => {
  return useMutation({
    mutationFn: async (data: { timeEntry: Partial<TimeEntry>; id: string }) => {
      const filteredEntry = Object.fromEntries(
        Object.entries(data.timeEntry).filter(([_, value]) => value !== ''),
      );
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/dtr/create`,
        {
          ...filteredEntry,
          user_id: data.id,
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        console.log('DTR successfully created:', data);
        toast({
          title: 'DTR successfully created',
          description: new Date().toLocaleTimeString(),
        });
      }
    },
    onError: (error) => {
      console.error('Error creating DTR:', error);
      toast({
        title: 'Error creating DTR',
        description: error.message || 'Something went wrong.',
      });
    },
  });
};

export default function DailyTimeRecord() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [userId, setUserId] = useState(1);

  // Fetch DTR entries when component mounts
  const { data } = useFetchDTR(userId.toString());
  const createMutation = useCreateDTR();

  useEffect(() => {
    // Sync fetched data with state when available
    if (data) {
      setTimeEntries(data);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-GB')); // Ensure consistent date format
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);

    return () => clearInterval(timer); // Clear interval on unmount
  }, []);

  const handleTimeEntry = () => {
    const now = new Date();
    const timeStr = now
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      .replace(/^0/, ''); // Remove leading zero if present

    const existingEntryIndex = timeEntries.findIndex(
      (entry) => entry.date === currentDate,
    );

    let newEntry;

    if (existingEntryIndex !== -1) {
      newEntry = { ...timeEntries[existingEntryIndex] };
    } else {
      newEntry = {
        dtr_id: timeEntries.length + 1,
        date: currentDate,
        timeInMorning: null,
        timeOutMorning: null,
        timeInAfternoon: null,
        timeOutAfternoon: null,
        user_id: userId,
      };
    }

    const currentHour = now.getHours();

    // Determine if it's morning or afternoon
    if (currentHour < 12) {
      // Morning
      if (!newEntry.timeInMorning) {
        newEntry.timeInMorning = timeStr;
      } else if (!newEntry.timeOutMorning) {
        newEntry.timeOutMorning = timeStr;
      }
    } else {
      // Afternoon
      if (!newEntry.timeInAfternoon) {
        newEntry.timeInAfternoon = timeStr;
      } else if (!newEntry.timeOutAfternoon) {
        newEntry.timeOutAfternoon = timeStr;
      }
    }

    if (existingEntryIndex !== -1) {
      setTimeEntries((prev) => {
        const updatedEntries = [...prev];
        updatedEntries[existingEntryIndex] = newEntry;
        return updatedEntries;
      });
    } else {
      setTimeEntries((prev) => [...prev, newEntry]);
    }

    console.log('Updated Entry:', newEntry);
  };

  const handleNewEntry = () => {
    // Check if there's already an incomplete entry
    const hasIncompleteEntry = timeEntries.some(
      (entry) =>
        entry.date === currentDate &&
        (!entry.timeInMorning ||
          !entry.timeOutMorning ||
          !entry.timeInAfternoon ||
          !entry.timeOutAfternoon),
    );

    if (hasIncompleteEntry) {
      alert('Please complete the current entry before creating a new one');
      return;
    }

    // Get the highest dtr_id
    const maxId = timeEntries.reduce(
      (max, entry) => Math.max(max, entry.dtr_id),
      0,
    );

    const newEntry = {
      dtr_id: maxId + 1,
      date: currentDate,
      timeInMorning: null,
      timeOutMorning: null,
      timeInAfternoon: null,
      timeOutAfternoon: null,
      user_id: userId,
    };

    setTimeEntries((prev) => [...prev, newEntry]);
    console.log('Created new entry:', newEntry);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[2rem] h-fit rounded-3xl bg-[#193F56] bg-opacity-75 p-4">
        <div className="mb-4 flex h-[8rem] items-center rounded-3xl bg-[#e8ddb5] p-2 text-black">
          <p className="font-mono text-lg">DATE: {currentDate}</p>
        </div>
        <div className="mb-4 flex h-[8rem] items-center rounded-3xl bg-[#e8ddb5] p-2 text-black">
          <p className="font-mono text-lg">TIME: {currentTime}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-white">ID</TableHead>
              <TableHead className="text-white">TIME IN (AM)</TableHead>
              <TableHead className="text-white">TIME OUT (AM)</TableHead>
              <TableHead className="text-white">TIME IN (PM)</TableHead>
              <TableHead className="text-white">TIME OUT (PM)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry, index) => (
              <TableRow className="text-white" key={index}>
                <TableCell>{entry.dtr_id}</TableCell>
                <TableCell>{entry.timeInMorning}</TableCell>
                <TableCell>{entry.timeOutMorning}</TableCell>
                <TableCell>{entry.timeInAfternoon}</TableCell>
                <TableCell>{entry.timeOutAfternoon}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-[2rem] flex items-center gap-4">
          <Button
            className="w-full bg-[#f7a23c] text-white hover:bg-[#e89326]"
            onClick={handleNewEntry}
          >
            New Entry
          </Button>

          <Button
            className="w-full bg-[#f7a23c] text-white hover:bg-[#e89326]"
            onClick={handleTimeEntry}
          >
            TIME
          </Button>
        </div>
      </div>
    </div>
  );
}

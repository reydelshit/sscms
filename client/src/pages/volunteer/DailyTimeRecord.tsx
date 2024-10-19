import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type TimeEntry = {
  date: string;
  timeIn1: string;
  timeOut1: string;
  timeIn2: string;
  timeOut2: string;
};

export default function DailyTimeRecord() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { date: '', timeIn1: '', timeOut1: '', timeIn2: '', timeOut2: '' },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  // const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);

      // Update the date for the first entry if it's empty
      if (timeEntries[0].date === '') {
        const updatedEntries = [...timeEntries];
        updatedEntries[0].date = formattedDate;
        setTimeEntries(updatedEntries);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeEntries]);

  const handleTimeAction = (
    index: number,
    field: 'timeIn1' | 'timeOut1' | 'timeIn2' | 'timeOut2',
  ) => {
    const newEntries = [...timeEntries];
    newEntries[index][field] = currentTime;
    setTimeEntries(newEntries);
  };

  const addNewEntry = () => {
    setTimeEntries([
      ...timeEntries,
      {
        date: currentDate,
        timeIn1: '',
        timeOut1: '',
        timeIn2: '',
        timeOut2: '',
      },
    ]);
  };

  const saveEntries = async () => {
    setIsSaving(true);
    try {
      // Simulating a POST request to a database
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // Simulating a successful response
      console.log('Data saved:', timeEntries);

      toast({
        title: 'Success',
        description: 'Time entries have been saved to the database.',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save time entries. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0e6d2]">
      <div className="w-full max-w-4xl rounded-lg bg-[#5f7470] p-6 shadow-lg">
        <div className="mb-4 rounded bg-[#e8ddb5] p-2">
          <p className="font-mono text-lg">DATE: {currentDate}</p>
        </div>
        <div className="mb-4 rounded bg-[#e8ddb5] p-2">
          <p className="font-mono text-lg">TIME: {currentTime}</p>
        </div>
        <ScrollArea className="mb-4 h-[400px] rounded">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#5f7470]">
              <tr>
                <th className="bg-[#e8c59c] p-2 font-mono text-black">Date</th>
                <th className="bg-[#a2c4c9] p-2 font-mono text-black">
                  TIME IN
                </th>
                <th className="bg-[#a2c4c9] p-2 font-mono text-black">
                  TIME OUT
                </th>
                <th className="bg-[#f4d06f] p-2 font-mono text-black">
                  TIME IN
                </th>
                <th className="bg-[#f4d06f] p-2 font-mono text-black">
                  TIME OUT
                </th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry, index) => (
                <tr key={index}>
                  <td className="p-1">
                    <Input
                      value={entry.date}
                      readOnly
                      className="w-full bg-[#f0e6d2] font-mono"
                    />
                  </td>
                  <td className="p-1">
                    <div className="flex items-center">
                      <Input
                        value={entry.timeIn1}
                        readOnly
                        className="mr-2 w-full bg-[#d9e8eb] font-mono"
                      />
                      <Button
                        onClick={() => handleTimeAction(index, 'timeIn1')}
                        className="bg-[#a2c4c9] font-mono text-xs text-black hover:bg-[#7fa8b0]"
                      >
                        In
                      </Button>
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="flex items-center">
                      <Input
                        value={entry.timeOut1}
                        readOnly
                        className="mr-2 w-full bg-[#d9e8eb] font-mono"
                      />
                      <Button
                        onClick={() => handleTimeAction(index, 'timeOut1')}
                        className="bg-[#a2c4c9] font-mono text-xs text-black hover:bg-[#7fa8b0]"
                      >
                        Out
                      </Button>
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="flex items-center">
                      <Input
                        value={entry.timeIn2}
                        readOnly
                        className="mr-2 w-full bg-[#faf0d2] font-mono"
                      />
                      <Button
                        onClick={() => handleTimeAction(index, 'timeIn2')}
                        className="bg-[#f4d06f] font-mono text-xs text-black hover:bg-[#e9b84e]"
                      >
                        In
                      </Button>
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="flex items-center">
                      <Input
                        value={entry.timeOut2}
                        readOnly
                        className="mr-2 w-full bg-[#faf0d2] font-mono"
                      />
                      <Button
                        onClick={() => handleTimeAction(index, 'timeOut2')}
                        className="bg-[#f4d06f] font-mono text-xs text-black hover:bg-[#e9b84e]"
                      >
                        Out
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
        <div className="mb-4 flex justify-between">
          <Button
            onClick={addNewEntry}
            className="flex items-center bg-[#4caf50] font-mono text-white hover:bg-[#45a049]"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Entry
          </Button>
          <Button
            onClick={saveEntries}
            disabled={isSaving}
            className="flex items-center bg-[#f4a261] font-mono text-black hover:bg-[#e76f51]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'SAVE'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

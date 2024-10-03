import BGPage from '@/assets/bg-page.png';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IllnessData } from '@/data/data';
import illnessJSON from '@/data/illness.json';
import { useState } from 'react';

type SelectedIllness = {
  illness_id: string;
  illness: string;
};

const Inventory = () => {
  const illnesses: IllnessData = illnessJSON;

  const [selectedIllness, setSelectedIllness] = useState<SelectedIllness[]>([]);

  const handleSelectIllness = (value: string) => {
    setSelectedIllness((prevState) => [...prevState, JSON.parse(value)]);

    console.log('Selected illness:', selectedIllness);
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[2rem] h-[80%] rounded-3xl bg-[#526C71] p-4 text-[#FDF3C0]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">INVENTORY</h1>
          <Input placeholder="search" className="w-[25rem]" />
        </div>
        <Table className="h-[300px] max-h-[300px] border-2">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h1 className="text-2xl font-bold">ADD ITEM</h1>

        <form className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <Input
                placeholder="ITEM NAME"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0]"
              />
              <Input
                placeholder="ITEM DESCRIPTION"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0]"
              />
              <Input
                placeholder="QUANTITY"
                type="number"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0]"
              />
            </div>

            <div>
              <Input
                placeholder="MANUFACTURING DATE"
                type="date"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
              <Input
                placeholder="EXPIRY DATE"
                type="date"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
              <Input
                placeholder="LOT NO."
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0]"
              />
            </div>

            <div>
              <div>
                <Label htmlFor="illness" className="text-yellow-100">
                  ILLNESS
                </Label>
                <Select onValueChange={handleSelectIllness}>
                  <SelectTrigger className="border-none bg-[#FFD863] text-[#193F56]">
                    <SelectValue placeholder="Select illness" />
                  </SelectTrigger>
                  <SelectContent>
                    {illnesses.illness.map((ill, index) => (
                      <SelectItem
                        key={index}
                        value={JSON.stringify({
                          illness_id: ill.ill_id,
                          illness: ill.illness,
                        })}
                      >
                        {ill.illness}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div>
                  {selectedIllness.map((ill, index) => (
                    <p key={ill.illness_id}>
                      {' '}
                      {ill.illness}
                      <Button
                        onClick={() => {
                          setSelectedIllness((prevState) =>
                            prevState.filter(
                              (item) => item.illness_id !== ill.illness_id,
                            ),
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button className="w-[10rem] rounded-full">ADD</Button>
            <Button className="w-[10rem] rounded-full">CLEAR</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;

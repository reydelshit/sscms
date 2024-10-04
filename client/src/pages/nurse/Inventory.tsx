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
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type SelectedIllness = {
  illness_id: string;
  illness: string;
};

type FormDataType = {
  itemName: string;
  itemDescription: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  lotNo: string;
};

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  associated_Illnesses?: string[]; // Optional field if applicable
  created_at: string; // Assuming a string timestamp
}

const useCreateInventory = () => {
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      selectedIllness: SelectedIllness[];
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/inventory/create`,
        {
          ...data.formData,
          associated_Illnesses: data.selectedIllness
            .map((ill: any) => ill.illness_id)
            .join(','),
          created_at: new Date(),
        },
      );
      return response.data;
    },
  });
};

const useFetchInventory = () => {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventoryData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/inventory`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const useFetchInventoryById = (id: string) => {
  return useQuery({
    queryKey: ['inventoryData', id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/inventory/${id}`,
      );
      return response.data;
    },
  });
};

const Inventory = () => {
  const illnesses: IllnessData = illnessJSON;
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    quantity: 0,
    manufacturingDate: '',
    expiryDate: '',
    lotNo: '',
  });
  const [selectedIllness, setSelectedIllness] = useState<SelectedIllness[]>([]);
  const { toast } = useToast();

  const handleSelectIllness = (value: string) => {
    setSelectedIllness((prevState) => [...prevState, JSON.parse(value)]);

    console.log('Selected illness:', selectedIllness);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { mutate } = useCreateInventory();
  const { data, isLoading, error, isError } = useFetchInventory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        formData,
        selectedIllness,
      },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            console.log('Item added successfully', data);
            toast({
              title: 'Item added successfully',
              description: new Date().toLocaleTimeString(),
            });
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast({
            title: 'Error adding item',
            description: error.message || 'Something went wrong.',
          });
        },
      },
    );
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

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table className="h-[300px] max-h-[300px] border-2">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.created_at}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

        <h1 className="text-2xl font-bold">ADD ITEM</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <Input
                name="itemName"
                onChange={handleInputChange}
                placeholder="ITEM NAME"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
              <Input
                name="itemDescription"
                onChange={handleInputChange}
                placeholder="ITEM DESCRIPTION"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
              <Input
                name="quantity"
                onChange={handleInputChange}
                placeholder="QUANTITY"
                type="number"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
            </div>

            <div>
              <Input
                name="manufacturingDate"
                onChange={handleInputChange}
                placeholder="MANUFACTURING DATE"
                type="date"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
              <Input
                name="expiryDate"
                onChange={handleInputChange}
                placeholder="EXPIRY DATE"
                type="date"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
              <Input
                name="lotNo"
                onChange={handleInputChange}
                placeholder="LOT NO."
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
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
            <Button type="submit" className="w-[10rem] rounded-full">
              ADD
            </Button>
            <Button className="w-[10rem] rounded-full">CLEAR</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;

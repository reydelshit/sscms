import BGPage from '@/assets/bg-page.png';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import PaginationTemplate from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IllnessData } from '@/data/data';
import illnessJSON from '@/data/illness.json';
import { useToast } from '@/hooks/use-toast';
import usePagination from '@/hooks/usePagination';
import Moment from '@/lib/Moment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import UpdateInventory from './inventory/UpdateInventory';

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
  inventory_id: string;
  itemName: string;
  quantity: number;
  associated_Illnesses?: string[];
  created_at: string;
  itemDescription: string;
  manufacturingDate: string;
  expiryDate: string;
  lotNo: string;
  category: string;
}

const useCreateInventory = () => {
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      selectedIllness: SelectedIllness[];
      selectedCategory: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/inventory/create`,
        {
          ...data.formData,
          associated_Illnesses: data.selectedIllness
            .map((ill: any) => ill.illness_id)
            .join(','),
          created_at: new Date(),
          category: data.selectedCategory,
          manufacturingDate:
            data.selectedCategory === 'medicine'
              ? data.formData.manufacturingDate
              : 'n/a',
          expiryDate:
            data.selectedCategory === 'medicine'
              ? data.formData.expiryDate
              : 'n/a',
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

const deleteInventory = async (id: string): Promise<void> => {
  await axios.delete(`${import.meta.env.VITE_API_LINK}/inventory/delete/${id}`);
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryData'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting inventory:', error.message);
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const { toast } = useToast();

  const handleSelectIllness = (value: string) => {
    setSelectedIllness((prevState) => [...prevState, JSON.parse(value)]);

    console.log('Selected illness:', selectedIllness);
  };

  const handleChangeCategory = (value: string) => {
    setSelectedCategory(value);

    console.log('Selected category:', selectedIllness);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { mutate } = useCreateInventory();
  const deleteMutation = useDeleteInventory();
  const { data, isLoading, error, isError } = useFetchInventory();

  const filteredAttendance = data?.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase()),
  );

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 5,
      data: filteredAttendance || [],
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        formData,
        selectedIllness,
        selectedCategory,
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

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[2rem] h-fit rounded-3xl bg-[#526C71] p-4 text-[#FDF3C0]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">INVENTORY</h1>
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search"
            className="w-[25rem] text-black"
          />
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table className="h-[300px] max-h-[300px] border-2">
            <TableHeader>
              <TableRow className="bg-[#99ACFF] !text-black">
                <TableHead className="text-black">ID</TableHead>
                <TableHead className="text-black">NAME</TableHead>
                <TableHead className="text-black">Description</TableHead>
                <TableHead className="text-black">Lot No.</TableHead>
                <TableHead className="text-black">MANUFACTURING DATE</TableHead>
                <TableHead className="text-black">EXPIRY DATE</TableHead>
                <TableHead className="text-black">QUANTITY</TableHead>
                <TableHead className="text-black">CATEGORY</TableHead>
                <TableHead className="text-black">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems &&
                currentItems?.map((item, index) => (
                  <TableRow className="bg-[#CDD6FF] text-black" key={index}>
                    <TableCell>{item.inventory_id}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.itemDescription}</TableCell>
                    <TableCell>{item.lotNo}</TableCell>
                    <TableCell>
                      {item.category === 'medicine' ? (
                        <Moment time={item.manufacturingDate} />
                      ) : (
                        'n/a'
                      )}
                    </TableCell>
                    <TableCell>
                      {item.category === 'medicine' ? (
                        <Moment time={item.expiryDate} />
                      ) : (
                        'n/a'
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger>Update</DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <div className="hidden">
                                <DialogTitle>Edit student details</DialogTitle>
                                <DialogDescription>
                                  Fill in the form to edit student details
                                </DialogDescription>
                              </div>
                            </DialogHeader>

                            <UpdateInventory inventoryID={item.inventory_id} />
                          </DialogContent>
                        </Dialog>

                        <Button onClick={() => handleDelete(item.inventory_id)}>
                          DELETE
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

        <PaginationTemplate
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />

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
              {selectedCategory === 'medicine' && (
                <>
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
                </>
              )}
              <Input
                name="lotNo"
                onChange={handleInputChange}
                placeholder="LOT NO."
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black"
              />
            </div>

            <div>
              <Select onValueChange={handleChangeCategory}>
                <SelectTrigger className="border-none bg-[#FFD863] text-[#193F56]">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical-supply">Medical Supply</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                </SelectContent>
              </Select>

              {selectedCategory === 'medicine' && (
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
              )}
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

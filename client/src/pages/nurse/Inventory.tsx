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
import { toast } from '@/hooks/use-toast';
import usePagination from '@/hooks/usePagination';
import Moment from '@/components/Moment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import UpdateInventory from './inventory/UpdateInventory';
import { QrCode, X } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('medicine');
  const [search, setSearch] = useState<string>('');
  const [selectCategory, setSelectCategory] = useState<string>('All');
  const createMutation = useCreateInventory();
  const deleteMutation = useDeleteInventory();
  const { data, isLoading, error, isError } = useFetchInventory();

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

  const filteredAttendance = data?.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase()),
  );

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 3,
      data: filteredAttendance || [],
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createMutation.mutate({
      formData,
      selectedIllness,
      selectedCategory,
    });
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div
      className="h-full min-h-screen w-full overflow-y-hidden bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[1rem] h-fit w-full rounded-3xl bg-[#193F56] bg-opacity-75 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-[2rem] font-semibold text-[#FDF3C0]">
            INVENTORY
          </h1>
          <div className="flex w-[40%] gap-4">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Inventory"
              className="w-[25rem] rounded-full text-black"
            />

            <Select onValueChange={(value) => setSelectCategory(value)}>
              <SelectTrigger className="w-[15rem] rounded-full border-none bg-[#FFD863] text-[#193F56]">
                <SelectValue placeholder="Filter Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="medical-supply">Medical Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-[2rem] h-full overflow-hidden rounded-3xl">
            <Table className="h-[300px] max-h-[300px]">
              <TableHeader>
                <TableRow className="bg-[#99ACFF] !text-black">
                  <TableHead className="text-black">ID</TableHead>
                  <TableHead className="text-black">NAME</TableHead>
                  <TableHead className="text-black">Description</TableHead>
                  <TableHead className="text-black">Lot No.</TableHead>
                  <TableHead className="text-black">
                    MANUFACTURING DATE
                  </TableHead>
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
                        <div className="flex flex-col gap-2">
                          <Dialog>
                            <DialogTrigger className="w-full rounded-full bg-[#FFA114] p-2 font-semibold text-white">
                              Update
                            </DialogTrigger>
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

                              <UpdateInventory
                                inventoryID={item.inventory_id}
                              />
                            </DialogContent>
                          </Dialog>

                          <span
                            className="w-full cursor-pointer rounded-full bg-red-500 p-2 font-semibold text-white"
                            onClick={() => handleDelete(item.inventory_id)}
                          >
                            DELETE
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}

        <PaginationTemplate
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />

        <h1 className="my-4 text-2xl font-bold text-[#FDF3C0]">ADD ITEM</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <Select onValueChange={handleChangeCategory}>
                <SelectTrigger className="my-2 rounded-full border-none bg-[#FFD863] text-[#193F56]">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="medical-supply">Medical Supply</SelectItem>
                </SelectContent>
              </Select>

              <Input
                name="itemName"
                onChange={handleInputChange}
                placeholder="ITEM NAME:"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black placeholder:font-semibold placeholder:text-gray-600"
              />
              <Input
                name="itemDescription"
                onChange={handleInputChange}
                placeholder="ITEM DESCRIPTION"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black placeholder:font-semibold placeholder:text-gray-600"
              />
              <Input
                name="quantity"
                onChange={handleInputChange}
                placeholder="QUANTITY"
                type="number"
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black placeholder:font-semibold placeholder:text-gray-600"
              />

              <Input
                name="lotNo"
                onChange={handleInputChange}
                placeholder="LOT NO."
                className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black placeholder:font-semibold placeholder:text-gray-600"
              />
            </div>

            <div className="w-[40%]">
              <div className="w-full">
                {selectedCategory === 'medicine' && (
                  <div>
                    <Label className="text-[#FDF3C0]">MANUFACTURING DATE</Label>
                    <Input
                      name="manufacturingDate"
                      onChange={handleInputChange}
                      placeholder="MANUFACTURING DATE"
                      type="date"
                      className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black placeholder:font-semibold placeholder:text-gray-600"
                    />

                    <Label className="text-[#FDF3C0]">EXPIRY DATE</Label>

                    <Input
                      name="expiryDate"
                      onChange={handleInputChange}
                      placeholder="EXPIRY DATE"
                      type="date"
                      className="mb-2 w-[20rem] rounded-full bg-[#FDF3C0] text-black placeholder:font-semibold placeholder:text-gray-600"
                    />

                    <div className="w-full">
                      <Label htmlFor="illness" className="text-yellow-100">
                        ILLNESS
                      </Label>
                      <Select onValueChange={handleSelectIllness}>
                        <SelectTrigger className="w-[20rem] rounded-full border-none bg-[#FFD863] text-[#193F56]">
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
                      <div className="my-4">
                        {selectedIllness.map((ill) => (
                          <p
                            className="flex w-[80%] items-center justify-between gap-4 border-b-[1px] border-[#FDF3C0] text-[#FDF3C0]"
                            key={ill.illness_id}
                          >
                            {ill.illness}

                            <X
                              color="red"
                              size={20}
                              onClick={() => {
                                setSelectedIllness((prevState) =>
                                  prevState.filter(
                                    (item) =>
                                      item.illness_id !== ill.illness_id,
                                  ),
                                );
                              }}
                            />
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex w-[40%] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#FFD863]">
              <div className="grid h-[50%] w-[35%] cursor-pointer place-content-center rounded-full bg-[#FFA114]">
                <QrCode size={80} />
              </div>
              <span className="my-2 rounded-3xl bg-[#FDF3C0] p-4 font-semibold">
                SCAN FOR QR CODE
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-[10rem] rounded-full bg-green-500"
            >
              ADD
            </Button>
            <Button className="w-[10rem] rounded-full bg-[#FFA114]">
              CLEAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;

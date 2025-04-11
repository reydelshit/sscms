import BGPage from '@/assets/bg-page.png';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import DeleteMakeSure from '@/components/DeleteMakeSure';
import Moment from '@/components/Moment';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IBoundingBox, IPoint, Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { QrCode, X } from 'lucide-react';
import { useState } from 'react';
import UpdateInventory from './inventory/UpdateInventory';

interface IDetectedBarcode {
  boundingBox: IBoundingBox;
  cornerPoints: IPoint[];
  format: string;
  rawValue: string;
}

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
  const [open, setOpen] = useState(false);

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

  const filteredAttendance = data?.filter((item) => {
    const isNameMatch = item.itemName
      .toLowerCase()
      .includes(search.toLowerCase());
    const isCategoryMatch =
      selectCategory === 'All' || item.category === selectCategory;

    return isNameMatch && isCategoryMatch;
  });

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

    setFormData({
      itemName: '',
      itemDescription: '',
      quantity: 0,
      manufacturingDate: '',
      expiryDate: '',
      lotNo: '',
    });
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const parseScannedText = (text: string) => {
    const regex = /Item Name: (.*?)\nItem Description: (.*)/;
    const match = text.match(regex);

    if (match) {
      const itemName = match[1].trim();
      const itemDescription = match[2].trim();

      return { itemName, itemDescription };
    } else {
      return null;
    }
  };

  const handleScan = (result: IDetectedBarcode[]) => {
    if (result.length > 0) {
      const parsedResult = parseScannedText(result[0].rawValue);

      if (parsedResult) {
        setFormData((prevState) => ({
          ...prevState,
          itemName: parsedResult.itemName || '',
          itemDescription: parsedResult.itemDescription || '',
        }));
        console.log('Scanned:', parsedResult.itemName);
      }

      setOpen(false);
    }
  };

  return (
    <div className="h-full min-h-screen w-full overflow-y-hidden bg-cover bg-center p-8">
      <div className="mt-[1rem] h-fit w-full rounded-3xl bg-[#D4D5D6] bg-opacity-75 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-[2rem] font-semibold text-black">INVENTORY</h1>
          <div className="flex w-[40%] gap-4">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Inventory"
              className="w-[25rem] rounded-full text-black"
            />

            <Select onValueChange={(value) => setSelectCategory(value)}>
              <SelectTrigger className="w-[15rem] rounded-full border-none bg-black text-[#D4D5D6]">
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
                <TableRow className="bg-white !text-black">
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
                {currentItems.length > 0 ? (
                  currentItems?.map((item, index) => (
                    <TableRow className="bg-white text-black" key={index}>
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

                          <DeleteMakeSure
                            deleteAction={() => handleDelete(item.inventory_id)}
                          >
                            <Button className="w-full cursor-pointer rounded-full bg-red-500 p-2 font-semibold text-white">
                              DELETE
                            </Button>
                          </DeleteMakeSure>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="bg-[#CDD6FF] text-black">
                    <TableCell colSpan={9} className="text-center">
                      No items found
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

        <h1 className="my-4 text-2xl font-bold text-black">ADD ITEM</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <Select onValueChange={handleChangeCategory}>
                <SelectTrigger className="my-2 rounded-full border-none bg-black text-[#D4D5D6]">
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
                placeholder="ITEM NAME"
                value={formData.itemName}
                className="mb-2 w-[20rem] rounded-full bg-white text-black placeholder:font-semibold placeholder:text-gray-600"
              />
              <Input
                name="itemDescription"
                onChange={handleInputChange}
                placeholder="ITEM DESCRIPTION"
                value={formData.itemDescription}
                className="mb-2 w-[20rem] rounded-full bg-white text-black placeholder:font-semibold placeholder:text-gray-600"
              />
              <Input
                name="quantity"
                onChange={handleInputChange}
                placeholder="QUANTITY"
                type="number"
                value={formData.quantity}
                className="mb-2 w-[20rem] rounded-full bg-white text-black placeholder:font-semibold placeholder:text-gray-600"
              />

              <Input
                name="lotNo"
                onChange={handleInputChange}
                placeholder="LOT NO."
                value={formData.lotNo}
                className="mb-2 w-[20rem] rounded-full bg-white text-black placeholder:font-semibold placeholder:text-gray-600"
              />
            </div>

            <div className="w-[40%]">
              <div className="w-full">
                {selectedCategory === 'medicine' && (
                  <div>
                    <Label className="text-black">MANUFACTURING DATE</Label>
                    <Input
                      name="manufacturingDate"
                      onChange={handleInputChange}
                      placeholder="MANUFACTURING DATE"
                      type="date"
                      className="mb-2 w-[20rem] rounded-full bg-white text-black placeholder:font-semibold placeholder:text-gray-600"
                    />

                    <Label className="text-black">EXPIRY DATE</Label>

                    <Input
                      name="expiryDate"
                      onChange={handleInputChange}
                      placeholder="EXPIRY DATE"
                      type="date"
                      className="mb-2 w-[20rem] rounded-full bg-white text-black placeholder:font-semibold placeholder:text-gray-600"
                    />

                    <div className="w-full">
                      <Label htmlFor="illness" className="text-black">
                        ILLNESS
                      </Label>
                      <Select onValueChange={handleSelectIllness}>
                        <SelectTrigger className="w-[20rem] rounded-full border-none bg-black text-[#D4D5D6]">
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
                            className="flex w-[80%] items-center justify-between gap-4 border-b-[1px] border-black text-black"
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

            <div className="flex w-[40%] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#D4D5D6]">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild className="w-full">
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <div className="grid h-[9rem] w-[35%] cursor-pointer place-content-center rounded-full">
                      <QrCode size={80} />
                    </div>

                    <span className="my-2 cursor-pointer rounded-3xl p-4 font-semibold">
                      SCAN FOR QR CODE
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="w-[40%]">
                  <DialogHeader>
                    <DialogTitle>Scan now</DialogTitle>
                    <DialogDescription>
                      Place the QR code in front of the camera to scan.
                    </DialogDescription>
                  </DialogHeader>

                  <Scanner allowMultiple={false} onScan={handleScan} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              variant={'default'}
              className="w-[10rem] rounded-full bg-black text-white"
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IllnessData } from '@/data/data';
import illnessJSON from '@/data/illness.json';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InventoryItem {
  inventory_id: string;
  itemName: string;
  quantity: number;
  associated_Illnesses?: string;
  created_at: string;
  itemDescription: string;
  manufacturingDate: string;
  expiryDate: string;
  lotNo: string;
  category: string;
}

type FormDataType = {
  itemName: string;
  quantity: number;
  itemDescription: string;
  manufacturingDate: string;
  expiryDate: string;
  lotNo: string;
};

type SelectedIllness = {
  illness_id: string;
  illness: string;
};

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

const useFetchInventoryById = (id: string) => {
  return useQuery<InventoryItem>({
    queryKey: ['inventoryData', id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/inventory/${id}`,
      );
      return response.data[0] as InventoryItem;
    },
  });
};

const updateInventoryAPI = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: FormDataType;
}): Promise<InventoryItem> => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_LINK}/inventory/update/${id}`,
    { ...updatedData },
  );
  return response.data;
};
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryList'] });
      console.log('Successfully updated inventory');
    },
    onError: (error: Error) => {
      console.error('Error updating inventory:', error.message);
    },
  });
};

const UpdateInventory = ({ inventoryID }: { inventoryID: string }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    quantity: 0,
    manufacturingDate: '',
    expiryDate: '',
    lotNo: '',
  });

  const updateMutation = useUpdateInventory();

  const illnesses: IllnessData = illnessJSON;
  const [selectedIllness, setSelectedIllness] = useState<SelectedIllness[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const {
    data: inventoryItem,
    isLoading,
    isError,
    isSuccess,
  } = useFetchInventoryById(inventoryID.toString());

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        itemName: inventoryItem.itemName,
        itemDescription: inventoryItem.itemDescription,
        quantity: inventoryItem.quantity,
        manufacturingDate: inventoryItem.manufacturingDate,
        expiryDate: inventoryItem.expiryDate,
        lotNo: inventoryItem.lotNo,
      });

      setSelectedCategory(inventoryItem.category);
    }
  }, [isSuccess, inventoryItem]);

  const handleSelectIllness = (value: string) => {
    setSelectedIllness((prevState) => [...prevState, JSON.parse(value)]);

    // console.log('Selected illness:', selectedIllness);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  if (!inventoryItem) return <div>No data found</div>;

  //   console.log('Data:', inventoryItem);

  const handleChangeCategory = (value: string) => {
    setSelectedCategory(value);

    console.log('Selected category:', selectedIllness);
  };

  const associatedIllnessIds = inventoryItem?.associated_Illnesses
    ? inventoryItem.associated_Illnesses.split(',').map(Number)
    : [];

  const associatedIllnessObjects = associatedIllnessIds
    .map((id) => {
      const illness = illnesses.illness.find(
        (item) => Number(item.ill_id) === id,
      );
      return illness
        ? { illness_id: illness.ill_id, illness: illness.illness }
        : {
            illness_id: '',
            illness: '',
          };
    })
    .filter(Boolean);

  const combinedIllnesses = [...selectedIllness, ...associatedIllnessObjects];

  const handleInputChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((values) => ({ ...values, [name]: value }));
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');

    const updatedData = {
      ...formData,
      associated_Illnesses:
        selectedCategory === 'medicine'
          ? combinedIllnesses.map((ill: any) => ill.illness_id).join(',')
          : '',

      manufacturingDate:
        selectedCategory === 'medicine' ? formData.manufacturingDate : 'n/a',
      expiryDate: selectedCategory === 'medicine' ? formData.expiryDate : 'n/a',
      category: selectedCategory,
    };

    console.log('Updated data:', updatedData);

    updateMutation.mutate({ id: inventoryID, updatedData });
  };

  return (
    <div className="flex w-full flex-col items-center gap-[1rem] p-2">
      <form className="w-full px-4 text-start" onSubmit={handleSubmitUpdate}>
        <div>
          <Label> Item Name</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="itemName"
            defaultValue={inventoryItem?.itemName}
          />
        </div>

        <div>
          <Label> Item Description</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="itemDescription"
            defaultValue={inventoryItem?.itemDescription}
          />
        </div>

        <div>
          <Label> Quantity</Label>
          <Input
            onChange={handleInputChange}
            type="number"
            name="quantity"
            defaultValue={inventoryItem?.quantity}
          />
        </div>
        <div>
          <Label> Lot No</Label>
          <Input
            onChange={handleInputChange}
            type="text"
            name="lotNo"
            defaultValue={inventoryItem?.lotNo}
          />
        </div>

        <Label className="my-4 block">
          Current category: <span>{inventoryItem?.category}</span>
        </Label>
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
          <>
            <div>
              <Label> Manufacturing Date</Label>
              <Input
                type="date"
                name="manufacturingDate"
                defaultValue={inventoryItem?.manufacturingDate}
              />
            </div>

            <div>
              <Label> Expiry Date</Label>
              <Input
                name="expiryDate"
                type="date"
                defaultValue={inventoryItem?.expiryDate}
              />
            </div>

            <div>
              <Label htmlFor="illness">ILLNESS</Label>
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
                {combinedIllnesses.map((medicine, index) => (
                  <p key={medicine?.illness_id}>
                    {medicine?.illness}
                    <Button
                      onClick={() => {
                        setSelectedIllness((prevState) =>
                          prevState.filter(
                            (item) => item.illness_id !== medicine?.illness_id,
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
          </>
        )}

        <Button className="my-4" type="submit">
          Update Inventory
        </Button>
      </form>
    </div>
  );
};

export default UpdateInventory;

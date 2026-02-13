import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Item, CreateItemInput } from "../../../types/inventory";
import { QUERY_KEYS } from "../../../constants/inventory";
import { inventoryService } from "../../../services/inventoryService";

// Fetch all items
export const useItems = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ITEMS,
    queryFn: () => inventoryService.getAll(),
  });
};

// Create new item
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateItemInput) => inventoryService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
};

// Update existing item
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: Partial<Item> & { id: number }) => 
      inventoryService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
};

// Delete item
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inventoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
};

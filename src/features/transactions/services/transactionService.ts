import { supabase } from "../../../lib/supabaseClient";
import { TransactionType } from "../../../constants/inventory";

interface ManualTransactionInput {
  itemId: number;
  amount: number;
  userEmail?: string;
  note?: string;
  type: TransactionType;
}

/**
 * Handles manual transaction creation and item quantity updates.
 * This acts as a fallback when RPC functions are unavailable or fail.
 */
export const handleManualTransaction = async ({
  itemId,
  amount,
  userEmail,
  note,
  type,
}: ManualTransactionInput): Promise<void> => {
  console.warn(`RPC failed, falling back to manual ${type} transaction.`);

  // 1. Fetch current item to ensure it exists and check quantity for withdrawal
  const { data: item, error: fetchError } = await supabase
    .from("items")
    .select("quantity")
    .eq("id", itemId)
    .single();

  if (fetchError) throw fetchError;
  if (!item) throw new Error("Item not found");

  // For withdrawal, check if there is enough stock
  if (type === TransactionType.WITHDRAW && item.quantity < Math.abs(amount)) {
    throw new Error("จำนวนอุปกรณ์ในสต็อกไม่เพียงพอ");
  }

  // 2. Create transaction record
  const { error: txError } = await supabase.from("transactions").insert({
    item_id: itemId,
    action_type: type,
    amount: type === TransactionType.WITHDRAW ? -Math.abs(amount) : Math.abs(amount),
    user_email: userEmail || null,
    note: note || null,
  });

  if (txError) throw txError;

  // 3. Update item quantity
  const newQuantity =
    type === TransactionType.WITHDRAW ? item.quantity - Math.abs(amount) : item.quantity + Math.abs(amount);

  const { error: updateError } = await supabase
    .from("items")
    .update({ quantity: newQuantity })
    .eq("id", itemId);

  if (updateError) throw updateError;
};

import { SupabaseClient } from "@supabase/supabase-js";
import type { FoodOrder, GroceryOrder, FoodOrderStatus, GroceryOrderStatus, PaginatedResponse } from "@zalldi/types";

export async function getFoodOrders(
  supabase: SupabaseClient,
  opts: {
    customer_id?: string;
    restaurant_id?: string;
    status?: FoodOrderStatus;
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginatedResponse<FoodOrder>> {
  const { customer_id, restaurant_id, status, page = 1, limit = 20 } = opts;

  let query = supabase
    .from("food_orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (customer_id) query = query.eq("customer_id", customer_id);
  if (restaurant_id) query = query.eq("restaurant_id", restaurant_id);
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as FoodOrder[],
    count: count ?? 0,
    page,
    limit,
    has_more: (count ?? 0) > page * limit,
  };
}

export async function getFoodOrderById(
  supabase: SupabaseClient,
  id: string
): Promise<FoodOrder | null> {
  const { data, error } = await supabase
    .from("food_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as FoodOrder;
}

export async function updateFoodOrderStatus(
  supabase: SupabaseClient,
  order_id: string,
  status: FoodOrderStatus
): Promise<void> {
  const { error } = await supabase
    .from("food_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", order_id);

  if (error) throw new Error(error.message);
}

export async function getGroceryOrders(
  supabase: SupabaseClient,
  opts: {
    customer_id?: string;
    darkstore_id?: string;
    status?: GroceryOrderStatus;
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginatedResponse<GroceryOrder>> {
  const { customer_id, darkstore_id, status, page = 1, limit = 20 } = opts;

  let query = supabase
    .from("grocery_orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (customer_id) query = query.eq("customer_id", customer_id);
  if (darkstore_id) query = query.eq("darkstore_id", darkstore_id);
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as GroceryOrder[],
    count: count ?? 0,
    page,
    limit,
    has_more: (count ?? 0) > page * limit,
  };
}

export async function updateGroceryOrderStatus(
  supabase: SupabaseClient,
  order_id: string,
  status: GroceryOrderStatus
): Promise<void> {
  const { error } = await supabase
    .from("grocery_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", order_id);

  if (error) throw new Error(error.message);
}

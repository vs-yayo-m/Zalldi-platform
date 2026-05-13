import { SupabaseClient } from "@supabase/supabase-js";
import type { Product, PaginatedResponse } from "@zalldi/types";

export async function getProducts(
  supabase: SupabaseClient,
  opts: {
    darkstore_id?: string;
    category_id?: string;
    search?: string;
    page?: number;
    limit?: number;
    is_active?: boolean;
    is_approved?: boolean;
  } = {}
): Promise<PaginatedResponse<Product>> {
  const { darkstore_id, category_id, search, page = 1, limit = 20, is_active = true, is_approved } = opts;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", is_active)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (darkstore_id) query = query.eq("darkstore_id", darkstore_id);
  if (category_id) query = query.eq("category_id", category_id);
  if (is_approved !== undefined) query = query.eq("is_approved", is_approved);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as Product[],
    count: count ?? 0,
    page,
    limit,
    has_more: (count ?? 0) > page * limit,
  };
}

export async function getProductBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getProductById(
  supabase: SupabaseClient,
  id: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Product;
}

export async function updateProductStock(
  supabase: SupabaseClient,
  product_id: string,
  quantity_delta: number
): Promise<void> {
  const { error } = await supabase.rpc("update_product_stock", {
    p_product_id: product_id,
    p_quantity_delta: quantity_delta,
  });

  if (error) throw new Error(error.message);
}

export async function getLowStockProducts(
  supabase: SupabaseClient,
  darkstore_id: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("darkstore_id", darkstore_id)
    .eq("is_active", true)
    .filter("stock_quantity", "lte", supabase.raw("low_stock_threshold"))
    .order("stock_quantity", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

import { SupabaseClient } from "@supabase/supabase-js";
import type { Restaurant, MenuItem, MenuCategory, PaginatedResponse } from "@zalldi/types";

export async function getRestaurants(
  supabase: SupabaseClient,
  opts: {
    city?: string;
    cuisine?: string;
    search?: string;
    page?: number;
    limit?: number;
    is_approved?: boolean;
  } = {}
): Promise<PaginatedResponse<Restaurant>> {
  const { city, cuisine, search, page = 1, limit = 20, is_approved } = opts;

  let query = supabase
    .from("restaurants")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (city) query = query.eq("city", city);
  if (is_approved !== undefined) query = query.eq("is_approved", is_approved);
  if (cuisine) query = query.contains("cuisine_types", [cuisine]);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as Restaurant[],
    count: count ?? 0,
    page,
    limit,
    has_more: (count ?? 0) > page * limit,
  };
}

export async function getRestaurantBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Restaurant;
}

export async function getRestaurantById(
  supabase: SupabaseClient,
  id: string
): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Restaurant;
}

export async function getRestaurantMenu(
  supabase: SupabaseClient,
  restaurant_id: string
): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const [categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurant_id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant_id)
      .eq("is_available", true),
  ]);

  return {
    categories: (categoriesResult.data ?? []) as MenuCategory[],
    items: (itemsResult.data ?? []) as MenuItem[],
  };
}

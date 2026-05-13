import { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "@zalldi/types";

export async function getCategories(
  supabase: SupabaseClient,
  opts: { parent_id?: string | null } = {}
): Promise<Category[]> {
  let query = supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (opts.parent_id !== undefined) {
    if (opts.parent_id === null) {
      query = query.is("parent_id", null);
    } else {
      query = query.eq("parent_id", opts.parent_id);
    }
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Category;
}

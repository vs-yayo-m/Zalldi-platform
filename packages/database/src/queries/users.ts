import { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile, Address } from "@zalldi/types";

export async function getUserProfile(
  supabase: SupabaseClient,
  user_id: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) return null;
  return data as UserProfile;
}

export async function upsertUserProfile(
  supabase: SupabaseClient,
  profile: Partial<UserProfile> & { id: string }
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({ ...profile, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as UserProfile;
}

export async function getUserAddresses(
  supabase: SupabaseClient,
  user_id: string
): Promise<Address[]> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user_id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Address[];
}

export async function upsertAddress(
  supabase: SupabaseClient,
  address: Partial<Address> & { user_id: string }
): Promise<Address> {
  // If setting as default, unset all others first
  if (address.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", address.user_id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .upsert(address)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Address;
}

export async function getAllUsers(
  supabase: SupabaseClient,
  opts: { page?: number; limit?: number; search?: string } = {}
): Promise<{ data: UserProfile[]; count: number }> {
  const { page = 1, limit = 20, search } = opts;

  let query = supabase
    .from("user_profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data: (data ?? []) as UserProfile[], count: count ?? 0 };
}

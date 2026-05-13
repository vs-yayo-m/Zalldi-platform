import { createClient } from "@supabase/supabase-js";

// ============================================================
// ZALLDI Storage — Supabase Storage (replaces Cloudflare R2)
// Free, no card required
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Bucket names
export const BUCKETS = {
  products: "product-images",
  restaurants: "restaurant-images",
  avatars: "user-avatars",
  receipts: "receipts",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

// Get Supabase admin client for storage operations
function getStorageClient() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return supabase.storage;
}

// ============================================================
// Upload a file to Supabase Storage
// Returns the public URL of the uploaded file
// ============================================================
export async function uploadFile(
  bucket: BucketName,
  path: string,
  file: File | Blob | ArrayBuffer,
  options?: { contentType?: string; upsert?: boolean }
): Promise<string> {
  const storage = getStorageClient();

  const { error } = await storage.from(bucket).upload(path, file, {
    contentType: options?.contentType ?? "image/jpeg",
    upsert: options?.upsert ?? true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return getPublicUrl(bucket, path);
}

// ============================================================
// Get the public URL for a file
// ============================================================
export function getPublicUrl(bucket: BucketName, path: string): string {
  const supabase = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ============================================================
// Delete a file from storage
// ============================================================
export async function deleteFile(bucket: BucketName, path: string): Promise<void> {
  const storage = getStorageClient();
  const { error } = await storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

// ============================================================
// Upload a product image
// path format: "darkstore-id/product-id/image-name.jpg"
// ============================================================
export async function uploadProductImage(
  darkstoreId: string,
  productId: string,
  file: File,
  fileName: string
): Promise<string> {
  const path = `${darkstoreId}/${productId}/${fileName}`;
  return uploadFile(BUCKETS.products, path, file, {
    contentType: file.type,
    upsert: true,
  });
}

// ============================================================
// Upload a restaurant image
// path format: "restaurant-id/cover.jpg"
// ============================================================
export async function uploadRestaurantImage(
  restaurantId: string,
  file: File,
  type: "cover" | "logo"
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${restaurantId}/${type}.${ext}`;
  return uploadFile(BUCKETS.restaurants, path, file, {
    contentType: file.type,
    upsert: true,
  });
}

// ============================================================
// Upload a user avatar
// path format: "user-id/avatar.jpg"
// ============================================================
export async function uploadUserAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  return uploadFile(BUCKETS.avatars, path, file, {
    contentType: file.type,
    upsert: true,
  });
}

// ============================================================
// List files in a bucket folder
// ============================================================
export async function listFiles(bucket: BucketName, folder: string) {
  const storage = getStorageClient();
  const { data, error } = await storage.from(bucket).list(folder);
  if (error) throw new Error(error.message);
  return data ?? [];
}
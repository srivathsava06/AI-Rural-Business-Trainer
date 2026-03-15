import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client — use ONLY in server components and API routes.
 * Never import this in client components.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

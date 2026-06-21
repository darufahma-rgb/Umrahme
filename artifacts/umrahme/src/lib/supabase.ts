import { createClient } from '@supabase/supabase-js';

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl = __SUPABASE_URL__;
const supabaseAnonKey = __SUPABASE_ANON_KEY__;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TenantRow = {
  id: string;
  activation_code: string;
  nama_travel: string;
  primary_color: string;
  primary_deep_color: string;
  logo_url: string | null;
  page_title: string;
  created_at: string;
};

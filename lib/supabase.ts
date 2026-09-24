import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tlckqydcxdmduogjilqc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsY2txeWRjeGRtZHVvZ2ppbHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwODc5MTUsImV4cCI6MjA5NDY2MzkxNX0.tL5gfMIsVm-mS7x93h42JFf_Ex9BwMW3y-Z67JAenK0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

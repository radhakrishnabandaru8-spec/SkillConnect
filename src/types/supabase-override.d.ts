// Type override for Supabase client to resolve TypeScript errors
declare module '@/integrations/supabase/client' {
  export const supabase: any;
}

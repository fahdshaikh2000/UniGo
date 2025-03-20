import { createClient } from "@supabase/supabase-js";

// Use default values for development to prevent errors when env vars aren't set
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.fake-key-for-development";

// Log Supabase configuration status (for debugging)
console.log(
  `Supabase URL configured: ${supabaseUrl !== "https://example.supabase.co"}`,
);
console.log(
  `Supabase Anon Key configured: ${supabaseAnonKey.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9") && supabaseAnonKey.length > 100}`,
);

// Create Supabase client with options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== "https://example.supabase.co" &&
    supabaseAnonKey !==
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.fake-key-for-development"
  );
};

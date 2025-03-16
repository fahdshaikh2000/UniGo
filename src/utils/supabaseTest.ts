import { supabase } from "@/lib/supabase";

/**
 * Tests the Supabase connection by performing a simple query
 * @returns Promise with connection status and details
 */
export const testSupabaseConnection = async () => {
  try {
    // First check if we can connect at all
    const { data: connectionTest, error: connectionError } = await supabase
      .from("pg_stat_statements")
      .select("query")
      .limit(1);

    if (connectionError && connectionError.code === "42501") {
      // This is actually good - it means we connected but don't have permission for this specific table
      // which is expected for the anon key

      // Try to get the Supabase version which should be accessible
      const { data, error } = await supabase.rpc("get_supabase_version");

      if (error) {
        // Try a different approach - check if any tables exist
        const { data: tables, error: tablesError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .limit(5);

        if (tablesError) {
          return {
            connected: false,
            message: "Connection established but couldn't access any tables",
            error: tablesError,
          };
        }

        return {
          connected: true,
          message: "Connection successful",
          tables: tables || [],
          url: supabase.supabaseUrl,
        };
      }

      return {
        connected: true,
        message: "Connection successful",
        version: data,
        url: supabase.supabaseUrl,
      };
    }

    if (connectionError) {
      return {
        connected: false,
        message: "Failed to connect to Supabase",
        error: connectionError,
      };
    }

    return {
      connected: true,
      message: "Connection successful",
      data: connectionTest,
      url: supabase.supabaseUrl,
    };
  } catch (error) {
    return {
      connected: false,
      message: "Exception occurred while testing connection",
      error,
    };
  }
};

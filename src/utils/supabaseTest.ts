import { supabase } from "@/lib/supabase";

/**
 * Tests the Supabase connection by performing a simple query
 * @returns Promise with connection status and details
 */
export const testSupabaseConnection = async () => {
  try {
    // Check if Supabase URL is properly configured
    if (supabase.supabaseUrl === "https://example.supabase.co") {
      return {
        connected: false,
        message: "Supabase URL not configured",
        url: supabase.supabaseUrl,
      };
    }

    // Try to get the current user to test auth connection
    const { data: authData, error: authError } =
      await supabase.auth.getSession();

    // Try to get public tables
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .limit(5);

    // If we can't access tables, try a simpler query
    if (tablesError) {
      // Try a simple health check
      const { data: healthData, error: healthError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);

      if (healthError && healthError.code !== "PGRST116") {
        // If we get an error that's not just "no rows returned"
        return {
          connected: false,
          message: "Connection established but couldn't access any tables",
          error: healthError,
          url: supabase.supabaseUrl,
          auth: authError ? "Error" : "OK",
        };
      }

      // If we got here, we have some kind of connection
      return {
        connected: true,
        message: "Basic connection successful, but limited table access",
        url: supabase.supabaseUrl,
        auth: authError ? "Error" : "OK",
      };
    }

    // Success case - we got tables
    return {
      connected: true,
      message: "Connection successful",
      tables: tables || [],
      url: supabase.supabaseUrl,
      auth: authError ? "Error" : "OK",
    };
  } catch (error) {
    console.error("Supabase connection test error:", error);
    return {
      connected: false,
      message: "Exception occurred while testing connection",
      error,
      url: supabase.supabaseUrl,
    };
  }
};

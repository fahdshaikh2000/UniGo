import React, { useState } from "react";
import { testSupabaseConnection } from "@/utils/supabaseTest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, Database } from "lucide-react";

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [envVars, setEnvVars] = useState<{ [key: string]: string | undefined }>(
    {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
        ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 5)}...`
        : undefined,
      SUPABASE_URL: import.meta.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: import.meta.env.SUPABASE_ANON_KEY
        ? `${import.meta.env.SUPABASE_ANON_KEY.substring(0, 5)}...`
        : undefined,
      SUPABASE_PROJECT_ID: import.meta.env.SUPABASE_PROJECT_ID,
    },
  );

  const checkConnection = async () => {
    setLoading(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        connected: false,
        message: "Exception occurred",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Status
        </CardTitle>
        <CardDescription>
          Testing connection to your Supabase project
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Environment Variables */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Environment Variables</h3>
          <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono text-xs">{key}:</span>
                <span className="font-mono text-xs">
                  {value ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Set
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      Not Set
                    </Badge>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Connection Status</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
                <span>Testing connection...</span>
              </div>
            ) : connectionStatus ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {connectionStatus.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={
                      connectionStatus.connected
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  >
                    {connectionStatus.message}
                  </span>
                </div>

                {connectionStatus.url && (
                  <div className="text-xs text-gray-500">
                    URL: {connectionStatus.url}
                  </div>
                )}

                {connectionStatus.tables &&
                  connectionStatus.tables.length > 0 && (
                    <div className="text-xs">
                      <div>Available tables:</div>
                      <ul className="list-disc list-inside pl-2">
                        {connectionStatus.tables.map(
                          (table: any, index: number) => (
                            <li key={index}>{table.table_name}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {connectionStatus.error && (
                  <div className="text-xs text-red-500 bg-red-50 p-2 rounded overflow-auto max-h-32">
                    <pre>{JSON.stringify(connectionStatus.error, null, 2)}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No connection test performed yet
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={checkConnection} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>Test Connection</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionTest;

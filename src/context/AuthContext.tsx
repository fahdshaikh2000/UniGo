import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function with Supabase
  const login = async (email: string, password: string) => {
    try {
      // First check if we're using Supabase in a real environment
      const isRealSupabase =
        supabase.supabaseUrl !== "https://example.supabase.co";

      if (isRealSupabase) {
        // Attempt to sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Get user profile data
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const userData = {
            id: data.user.id,
            name:
              profileData?.full_name ||
              data.user.email?.split("@")[0] ||
              "User",
            email: data.user.email || "",
            avatar:
              profileData?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
          };

          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData));
          return;
        }
      }

      // Fallback to mock login if Supabase isn't configured or login failed
      const mockUser = {
        id: "1",
        name: "Fahd Niaz Shaikh",
        email: email,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register function with Supabase
  const register = async (name: string, email: string, password: string) => {
    try {
      // First check if we're using Supabase in a real environment
      const isRealSupabase =
        supabase.supabaseUrl !== "https://example.supabase.co";

      if (isRealSupabase) {
        // Register with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Create a profile record
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                full_name: name,
                email: email,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
              },
            ]);

          if (profileError)
            console.error("Error creating profile:", profileError);

          const userData = {
            id: data.user.id,
            name: name,
            email: email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
          };

          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData));
          return;
        }
      }

      // Fallback to mock registration if Supabase isn't configured or registration failed
      const mockUser = {
        id: "1",
        name: name || "Fahd Niaz Shaikh",
        email: email,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // First check if we're using Supabase in a real environment
      const isRealSupabase =
        supabase.supabaseUrl !== "https://example.supabase.co";

      if (isRealSupabase) {
        // Sign out from Supabase
        await supabase.auth.signOut();
      }

      // Always clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

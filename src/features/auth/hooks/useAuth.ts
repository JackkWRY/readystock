import { useState } from "react";
import { message } from "antd";
import { supabase } from "../../../lib/supabaseClient";
import { useAuthStore } from "../../../store/authStore";
import { UserRole } from "../../../constants/inventory";

interface LoginCredentials {
  email: string;
  password: string;
}

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  error: string | null;
}

/**
 * Custom hook for authentication operations
 * Provides login/logout functions with loading states
 */
export const useAuth = (): UseAuthReturn => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setUser, setRole, logout: clearStore } = useAuthStore();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoggingIn(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        setError(authError.message);
        message.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return false;
      }

      if (data.user) {
        setUser(data.user);
        
        // Fetch role from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        let role = null;
        if (profile?.role) {
          role = profile.role as UserRole;
        }
        setRole(role);
        message.success("เข้าสู่ระบบสำเร็จ");
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      message.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      clearStore();
      message.success("ออกจากระบบสำเร็จ");
    } catch (err) {
      message.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    login,
    logout,
    isLoggingIn,
    isLoggingOut,
    error,
  };
};

export default useAuth;

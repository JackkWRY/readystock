import { useState, useCallback } from "react";
import { message } from "antd";
import { supabase } from "../../../lib/supabaseClient";
import { useAuthStore } from "../../../store/authStore";

interface NotificationSettings {
  lowStockAlert: boolean;
  withdrawalAlert: boolean;
}

interface UseSettingsReturn {
  notifications: NotificationSettings;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isChangingPassword: boolean;
}

/**
 * Custom hook for user settings and preferences
 * Manages notification settings and password changes
 */
export const useSettings = (): UseSettingsReturn => {
  const { user } = useAuthStore();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Local state for notifications (can be persisted to Supabase later)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    lowStockAlert: true,
    withdrawalAlert: true,
  });

  const updateNotifications = useCallback((settings: Partial<NotificationSettings>) => {
    setNotifications((prev) => ({ ...prev, ...settings }));
    message.success("บันทึกการตั้งค่าสำเร็จ");
  }, []);

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!user?.email) {
      message.error("กรุณาเข้าสู่ระบบก่อน");
      return false;
    }

    setIsChangingPassword(true);
    try {
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        message.error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
        return false;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        message.error("ไม่สามารถเปลี่ยนรหัสผ่านได้");
        return false;
      }

      message.success("เปลี่ยนรหัสผ่านสำเร็จ");
      return true;
    } catch (err) {
      message.error("เกิดข้อผิดพลาด");
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  }, [user?.email]);

  return {
    notifications,
    updateNotifications,
    changePassword,
    isChangingPassword,
  };
};

export default useSettings;

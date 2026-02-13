import { Session } from '@supabase/supabase-js';
import { UserRole } from '../constants/inventory';

export const getRoleFromSession = (session: Session | null): UserRole | null => {
  if (!session?.user?.app_metadata?.role) return null;
  return session.user.app_metadata.role as UserRole;
};

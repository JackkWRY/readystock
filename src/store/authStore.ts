import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserRole } from '../constants/inventory';
import { getRoleFromSession } from '../utils/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  isInitialized: false,

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // State update is handled by onAuthStateChange listener
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null });
  },

  initialize: async () => {
    if (get().isInitialized) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        set({
          user: session.user,
          session,
          role: getRoleFromSession(session),
        });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          set({
            user: session.user,
            session,
            role: getRoleFromSession(session),
          });
        } else {
          set({ user: null, session: null, role: null });
        }
      });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },
}));

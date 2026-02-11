import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserRole } from '../constants/inventory';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRole: (role: UserRole | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user) => set({ user }),

  setSession: (session) => set({ session }),

  setRole: (role) => set({ role }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null });
  },

  initialize: async () => {
    if (get().isInitialized) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Fetch role from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        set({
          user: session.user,
          session,
          role: (profile?.role as UserRole) || UserRole.STAFF,
        });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          set({
            user: session.user,
            session,
            role: (profile?.role as UserRole) || UserRole.STAFF,
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

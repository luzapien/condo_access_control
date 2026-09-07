import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

// Define your profile structure
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "security_guard";
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch role/profile data from Supabase
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (!error && data) {
      setProfile(data);
    } else {
      setProfile(null);
    }
    setLoading(false);
  };
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(
        async ({
          data: { session },
        }: {
          data: { session: Session | null };
        }) => {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        },
      );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// This hook is intentionally colocated for the public auth API. Fast Refresh
// cannot detect hooks as components, so exclude this export from that check.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

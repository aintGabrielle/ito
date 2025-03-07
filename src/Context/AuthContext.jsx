import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error restoring session:", error.message);
      }
      setSession(data?.session);
      setUser(data?.session?.user || null);
      setLoading(false);
    };

    restoreSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", session);
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // ✅ Sign Up
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Sign-up error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user };
  };

  // ✅ Sign In (Proper Error Handling)
  const signInUser = async (email, password) => {
    try {
      console.log("Attempting login for:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign-in failed:", error.message);
        return { success: false, error: error.message };
      }

      console.log("Sign-in successful:", data);
      setSession(data.session);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Unexpected error during sign-in:", err);
      return { success: false, error: "Unexpected error during sign-in." };
    }
  };

  // ✅ Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign-out error:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, user, signUpNewUser, signInUser, signOut }}
    >
      {!loading ? (
        children
      ) : (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

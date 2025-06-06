import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";
import { fireAuth } from "@/lib/firebase";
import { useNavigate } from "react-router";

interface AuthContextType {
  currentUser: UserData | null;
  userRole: string | null;
  loading: boolean; // CHANGE: Added loading state to interface
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isManagementStaff: boolean;
  hasAccess: (roles: string[]) => boolean;
  token: string;
}

interface UserData {
  uid: string;
  email: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, _setCurrentUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // CHANGE: Added loading state
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        fireAuth,
        email,
        password
      );

      console.log("User logged in:", userCredential.user);

      return userCredential;
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      try {
        setLoading(true); // CHANGE: Set loading at start of auth state change

        if (user) {
          // CHANGE: Set basic user info first (without role)
          _setCurrentUser({
            uid: user.uid,
            email: user.email ?? "",
            role: "",
          });

          try {
            // Get token for fetch request
            const token = await getIdToken(user);

            // CHANGE: Fixed API endpoint to use consistent localhost URL
            const response = await fetch("http://localhost:3000/api/user", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              if (response.status === 401) {
                await signOut(fireAuth);
                return;
              }
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            console.log("User data fetched:", userData);

            // CHANGE: Update states with complete user data
            setUserRole(userData.role);
            _setCurrentUser(userData);
            setToken(token);

            // CHANGE: Moved navigation logic here to avoid race conditions
            // Navigation happens after we have complete user data
            if (userData.role === "admin") {
              navigate("/admin/dashboard");
            } else if (userData.role === "management_staff") {
              navigate("/staff/dashboard");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUserRole(null);
            // CHANGE: Reset user data on API error but keep basic auth info
            _setCurrentUser({
              uid: user.uid,
              email: user.email ?? "",
              role: "",
            });
          }
        } else {
          // CHANGE: Clear all user data when signed out
          _setCurrentUser(null);
          setUserRole(null);
        }
      } finally {
        setLoading(false); // CHANGE: Always reset loading state
      }
    });

    return unsubscribe;
  }, [navigate]); // CHANGE: Added navigate to dependency array

  const logout = async () => {
    try {
      setLoading(true); // CHANGE: Set loading during logout
      await signOut(fireAuth);

      // CHANGE: Clear states immediately for better UX
      setUserRole(null);
      _setCurrentUser(null);
      setToken("");

      console.log("Logged out successfully");
    } catch (error) {
      console.error("Failed to logout");
      throw error;
    } finally {
      setLoading(false); // CHANGE: Reset loading state
    }
  };

  const value = {
    currentUser,
    userRole,
    loading, // CHANGE: Added loading to context value
    login,
    logout,
    isAdmin: userRole === "admin",
    isManagementStaff: userRole === "management_staff",
    hasAccess: (roles: string[]) => roles.includes(userRole ?? ""),
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

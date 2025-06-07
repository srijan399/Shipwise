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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      if (currentUser) {
        console.warn("User is already logged in:", currentUser);
        return currentUser;
      }

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
        setLoading(true);

        if (user) {
          const userToken = await getIdToken(user);
          setToken(userToken);

          // Set basic user data first
          const basicUserData = {
            uid: user.uid,
            email: user.email ?? "",
            role: "",
          };
          _setCurrentUser(basicUserData);

          try {
            // Try to fetch extended user data
            const response = await fetch("http://localhost:3000/api/user", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userToken}`,
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

            // Update user data with role information
            setUserRole(userData.role);
            _setCurrentUser(userData);

            // Navigate based on role
            if (userData.role === "admin") {
              navigate("/admin/dashboard");
            } else if (userData.role === "management_staff") {
              navigate("/staff/dashboard");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Keep basic user data and token even if API call fails
            setUserRole(null);
            _setCurrentUser(basicUserData);
            // Token is already set above, so it won't be empty
          }
        } else {
          // Clear all state when user is not authenticated
          _setCurrentUser(null);
          setUserRole(null);
          setToken("");
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate]); // Removed userRole from dependency array

  const logout = async () => {
    try {
      setLoading(true);
      navigate("/");
      await signOut(fireAuth);

      // Clear all state
      setUserRole(null);
      _setCurrentUser(null);
      setToken("");

      console.log("Logged out successfully");
    } catch (error) {
      console.error("Failed to logout");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
    isAdmin: userRole === "admin",
    isManagementStaff: userRole === "management_staff",
    hasAccess: (roles: string[]) => roles.includes(userRole ?? ""),
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

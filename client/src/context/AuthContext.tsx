import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";
import { fireAuth } from "@/lib/firebase";

interface AuthContextType {
  currentUser: UserData | null;
  userRole: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isManagementStaff: boolean;
  hasAccess: (roles: string[]) => boolean;
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

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        fireAuth,
        email,
        password
      );

      // Get the ID token
      const token = await getIdToken(userCredential.user);

      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      setUserRole(userData.role);

      console.log("Logged in successfully");
      return userCredential;
    } catch (error) {
      console.error("Not a user!");
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      _setCurrentUser(
        user ? { uid: user.uid, email: user.email ?? "", role: "" } : null
      );

      if (user) {
        try {
          // Get token for fetch request
          const token = await getIdToken(user);

          // Fetch user role using fetch API
          const response = await fetch("/api/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            // If token is invalid, logout
            if (response.status === 401) {
              await signOut(fireAuth);
              return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const userData = await response.json();
          setUserRole(userData.role);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle network errors or other issues
          setUserRole(null);
        }
      } else {
        // No need to delete headers with fetch
        setUserRole(null);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(fireAuth);
      setUserRole(null);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Failed to logout");
      throw error;
    }
  };

  const value = {
    currentUser,
    userRole,
    login,
    logout,
    isAdmin: userRole === "admin",
    isManagementStaff: userRole === "staff",
    hasAccess: (roles: string[]) => roles.includes(userRole ?? ""),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

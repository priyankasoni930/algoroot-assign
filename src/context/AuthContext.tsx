
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error("User not found");
      }
      
      if (foundUser.password !== password) {
        throw new Error("Invalid password");
      }
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Set user in localStorage and state
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast.success("Login successful");
      navigate("/details");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u: any) => u.email === email)) {
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
      };
      
      // Save to users list
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Set user in localStorage and state
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast.success("Account created successfully");
      navigate("/details");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const deleteAccount = () => {
    if (!user) return;
    
    // Remove user from users array in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.filter((u: any) => u.id !== user.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Remove current user
    localStorage.removeItem("user");
    setUser(null);
    
    toast.success("Account deleted successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

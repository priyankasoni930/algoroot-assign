
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/auth/AuthForm";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/details" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full hover:bg-secondary"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>
      <AuthForm />
    </div>
  );
};

export default Login;

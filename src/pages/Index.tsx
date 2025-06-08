
import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { AuthModal } from "@/components/AuthModal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Mock authentication state - replace with Supabase auth
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <AuthModal onAuthSuccess={(userData) => {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    }} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={user} />
        <SidebarInset>
          <ChatInterface user={user} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;

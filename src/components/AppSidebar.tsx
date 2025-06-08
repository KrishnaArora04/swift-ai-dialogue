
import { Bot, MessageSquare, Plus, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  user: any;
}

export const AppSidebar = ({ user }: AppSidebarProps) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const menuItems = [
    {
      title: "New Chat",
      icon: Plus,
      onClick: () => console.log("New chat"),
    },
    {
      title: "Chat History",
      icon: MessageSquare,
      onClick: () => console.log("Chat history"),
    },
    {
      title: "Settings",
      icon: Settings,
      onClick: () => console.log("Settings"),
    },
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <span className="font-semibold">AI Chat</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Welcome, {user?.name}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

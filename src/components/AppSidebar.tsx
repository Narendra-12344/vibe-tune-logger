import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  Music, 
  Brain, 
  Calendar, 
  BookOpen, 
  List, 
  Search, 
  BarChart3,
  User,
  Upload,
  MoreVertical,
  LogOut,
  Settings,
  Radio
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

interface AppSidebarProps {
  activeModule: string;
  setActiveModule: (module: any) => void;
  userEmail?: string;
}

export function AppSidebar({ activeModule, setActiveModule, userEmail }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const menuItems = [
    { id: 'mood', icon: Heart, label: '😊 Mood', emoji: '😊' },
    { id: 'songs', icon: Music, label: '🎵 Songs', emoji: '🎵' },
    { id: 'streaming', icon: Radio, label: '📻 JioSaavn', emoji: '📻' },
    { id: 'ai-recommendations', icon: Brain, label: '✨ AI Picks', emoji: '✨' },
    { id: 'favorites', icon: Heart, label: '❤️ Favorites', emoji: '❤️' },
    { id: 'offline', icon: Heart, label: '📴 Offline', emoji: '📴' },
    { id: 'preferences', icon: Brain, label: '🧠 Learn', emoji: '🧠' },
    { id: 'history', icon: Calendar, label: '📊 History', emoji: '📊' },
    { id: 'journal', icon: BookOpen, label: '📝 Journal', emoji: '📝' },
    { id: 'playlists', icon: List, label: '🎧 Playlists', emoji: '🎧' },
    { id: 'playlist-builder', icon: List, label: '🎼 Build Playlist', emoji: '🎼' },
    { id: 'search', icon: Search, label: '🔍 Search', emoji: '🔍' },
    { id: 'stats', icon: BarChart3, label: '📈 Stats', emoji: '📈' },
  ];

  const bottomItems = [
    { id: 'profile', icon: User, label: '👤 Profile', emoji: '👤' },
    { id: 'upload', icon: Upload, label: '📁 Upload', emoji: '📁' },
  ];

  const getUserInitials = () => {
    if (!userEmail) return 'U';
    return userEmail.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      {/* Header with Profile */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userEmail || 'User'}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="shrink-0 hover:bg-accent rounded-md p-1">
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveModule('profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveModule('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveModule(item.id)}
                    isActive={activeModule === item.id}
                    tooltip={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Items */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveModule(item.id)}
                    isActive={activeModule === item.id}
                    tooltip={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Theme Toggle */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-sm font-medium">Theme</span>
          )}
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

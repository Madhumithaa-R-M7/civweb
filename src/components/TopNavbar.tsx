import { Bell, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { NotificationPanel } from "./NotificationPanel";

interface TopNavbarProps {
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

export function TopNavbar({ onLogout, onNavigate }: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search issues, officers, locations..."
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-blue-50 transition-all hover:scale-105"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse">
              3
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-50 transition-all hover:scale-105"
            title="Settings"
            onClick={() => onNavigate?.("settings")}
          >
            <Settings className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
          </Button>

          <div className="w-px h-8 bg-gray-200 mx-2"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-blue-50 transition-all">
                <Avatar className="h-9 w-9 border-2 border-blue-100 ring-2 ring-blue-50">
                  <AvatarImage src="https://images.unsplash.com/photo-1577720643180-97cd599e79f9?w=100&h=100&fit=crop" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">AD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">City Manager</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onNavigate?.("settings")}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={onLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
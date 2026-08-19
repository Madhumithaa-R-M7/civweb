import { Bell, Search, Settings, User } from "lucide-react";
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
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm shrink-0 z-20">
        {/* Left: Search Bar (380px wide) */}
        <div className="flex items-center gap-4">
          <div className="relative w-[360px] md:w-[420px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search issues, officers, locations..."
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl transition-colors"
            />
          </div>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0.5 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full border border-white">
              3
            </Badge>
          </Button>

          {/* Settings Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            title="Settings"
            onClick={() => onNavigate?.("settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-slate-200 mx-2"></div>

          {/* Admin User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 px-2 gap-2.5 hover:bg-slate-100 rounded-xl">
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src="https://images.unsplash.com/photo-1577720643180-97cd599e79f9?w=100&h=100&fit=crop" />
                  <AvatarFallback className="bg-blue-900 text-white text-xs font-bold">AD</AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-none">Admin User</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-none mt-1">City Manager</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => onNavigate?.("settings")}>
                Profile & Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => onNavigate?.("settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 font-medium"
                onClick={onLogout}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
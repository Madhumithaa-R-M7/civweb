import {
  LayoutDashboard,
  AlertCircle,
  Users,
  HardHat,
  BarChart3,
  MessageSquare,
  Settings,
  Building2,
  Award,
} from "lucide-react";
import { cn } from "./ui/utils";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "issues", label: "Issues Management", icon: AlertCircle },
  { id: "officers", label: "Officers", icon: Users },
  { id: "workers", label: "Field Worker Portal", icon: HardHat },
  { id: "rewards", label: "Rewards & Welfare", icon: Award },
  { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 h-full flex flex-col shadow-2xl">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-white text-lg tracking-wide">Civic Connect</span>
            <p className="text-blue-200 text-xs">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 group",
                isActive
                  ? "bg-white text-blue-900 shadow-lg scale-105"
                  : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-all",
                isActive ? "text-blue-600" : "group-hover:scale-110"
              )} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl p-4 shadow-lg">
          <p className="text-white text-sm mb-2">Need Help?</p>
          <p className="text-blue-100 text-xs mb-3">
            Check our documentation or contact support
          </p>
          <button className="w-full bg-white text-blue-900 text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-md">
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
}
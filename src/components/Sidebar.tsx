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
  HelpCircle,
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
    <aside className="w-[250px] bg-slate-900 h-full flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight leading-none">CivicConnect</h1>
            <p className="text-slate-400 text-[11px] font-medium mt-1">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors text-left font-medium",
                isActive
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-blue-600" : "text-slate-400"
              )} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Help & Support Footer */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
            <HelpCircle className="h-4 w-4 text-blue-400" />
            <span>Help & Support</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Access documentation or submit system tickets to IT.
          </p>
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium py-1.5 rounded-lg transition-colors mt-1">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}
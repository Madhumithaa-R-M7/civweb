import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNavbar } from "./components/TopNavbar";
import { DashboardView } from "./components/DashboardView";
import { IssuesView } from "./components/IssuesView";
import { IssueDetailModal } from "./components/IssueDetailModal";
import { OfficersView } from "./components/OfficersView";
import { AnalyticsView } from "./components/AnalyticsView";
import { FeedbackView } from "./components/FeedbackView";
import { SettingsView } from "./components/SettingsView";
import { LoginPage } from "./components/LoginPage";
import { WorkerPortal } from "./components/worker/WorkerPortal";
import { RewardsView } from "./components/RewardsView";

interface Issue {
  id: string;
  photo: string;
  category: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  department: string;
  status: "Pending" | "In Progress" | "Resolved";
  officer: string;
  date: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"officer" | "worker">("officer");
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueFilter, setIssueFilter] = useState<string>("all");

  const handleLogin = (role: "officer" | "worker") => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("dashboard");
  };

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  const handleFilterIssues = (filter: string) => {
    setIssueFilter(filter);
    setCurrentView("issues");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView onFilterIssues={handleFilterIssues} />;
      case "issues":
        return <IssuesView onViewIssue={handleViewIssue} activeFilter={issueFilter} />;
      case "officers":
        return <OfficersView />;
      case "workers":
        return <WorkerPortal onLogout={handleLogout} isOfficerView={true} />;
      case "rewards":
        return <RewardsView />;
      case "analytics":
        return <AnalyticsView />;
      case "feedback":
        return <FeedbackView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView onFilterIssues={handleFilterIssues} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Route to Field Worker responsive app
  if (userRole === "worker") {
    return <WorkerPortal onLogout={handleLogout} />;
  }

  // Route to Officer / Admin Dashboard
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onLogout={handleLogout} onNavigate={handleNavigate} />
        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>
      <IssueDetailModal
        issue={selectedIssue}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
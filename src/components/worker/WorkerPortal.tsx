import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Play,
  Upload,
  QrCode,
  WifiOff,
  Wifi,
  Sparkles,
  Award,
  AlertTriangle,
  Gift,
  ShieldCheck,
  PlusCircle,
  UserCheck,
  XCircle,
  Check,
  Briefcase,
  Users,
  Activity,
  Navigation,
  FileText,
  Filter,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface WorkerTask {
  id: string;
  category: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  description: string;
  qrCode: string;
  voiceNoteUrl: string;
  beforePhoto: string;
  afterPhoto?: string;
  aiScore?: number;
  qrVerified?: boolean;
  assignedWorker?: string;
}

const initialTasks: WorkerTask[] = [
  {
    id: "ISS-1247",
    category: "Pothole Repair",
    location: "Main Street & 5th Ave",
    priority: "High",
    status: "In Progress",
    description: "Fill pothole on west side of intersection. Use extra bitumen sealant.",
    qrCode: "QR-MAIN-5TH-POLE-A",
    voiceNoteUrl: "#",
    beforePhoto: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500&h=300&fit=crop",
    qrVerified: false,
    assignedWorker: "Rajesh Kumar (ID: W-402)",
  },
  {
    id: "ISS-1245",
    category: "Garbage Collection",
    location: "Downtown Plaza",
    priority: "High",
    status: "In Progress",
    description: "Clear overflowing green waste bin and sanitize nearby walkway.",
    qrCode: "QR-DOWNTOWN-BIN-04",
    voiceNoteUrl: "#",
    beforePhoto: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&h=300&fit=crop",
    qrVerified: true,
    assignedWorker: "Amit Singh (ID: W-109)",
  },
  {
    id: "ISS-1246",
    category: "Street Light Fix",
    location: "Park Avenue Block 3",
    priority: "Medium",
    status: "Pending",
    description: "Bulb flickering. Check connection and replace with 40W LED.",
    qrCode: "QR-PARK-AVE-LGT-12",
    voiceNoteUrl: "#",
    beforePhoto: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=500&h=300&fit=crop",
    qrVerified: false,
    assignedWorker: "Rajesh Kumar (ID: W-402)",
  },
];

interface LeaveRequest {
  id: string;
  workerName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
}

interface WorkerPortalProps {
  onLogout: () => void;
  isOfficerView?: boolean;
}

export function WorkerPortal({ onLogout, isOfficerView = false }: WorkerPortalProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "attendance" | "welfare" | "leaves">("tasks");
  const [tasks, setTasks] = useState<WorkerTask[]>(initialTasks);
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [points, setPoints] = useState(450);
  const [offlineMode, setOfflineMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState("");

  // Officer dispatch task modal state
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    category: "Pothole Repair",
    location: "",
    priority: "High" as "High" | "Medium" | "Low",
    description: "",
    assignedWorker: "Rajesh Kumar (ID: W-402)",
    qrCode: "",
  });

  // Welfare catalog
  const [redeemedWelfare, setRedeemedWelfare] = useState<{ id: string; item: string; cost: number; code: string; date: string }[]>([]);

  const welfareCatalog = [
    { item: "Subsidized Lunch Coupon", cost: 150, desc: "Voucher for a full lunch at Municipal Canteen." },
    { item: "Winter Safety Boots", cost: 250, desc: "Pair of weather-proof safety boots from municipal stores." },
    { item: "Annual Health Checkup Voucher", cost: 300, desc: "Free health screening at City Hospital." },
    { item: "Extra Paid Rest Day", cost: 500, desc: "Claim 1 additional paid day off." }
  ];

  const handleRedeemWelfare = (welfare: typeof welfareCatalog[0]) => {
    if (points < welfare.cost) {
      alert("Insufficient Points! Complete more verified tasks to build up points.");
      return;
    }
    const code = "WELFARE-" + Math.floor(Math.random() * 90000 + 10000);
    setPoints(points - welfare.cost);
    setRedeemedWelfare(prev => [
      {
        id: "WLF-" + Math.floor(Math.random() * 9000 + 1000),
        item: welfare.item,
        cost: welfare.cost,
        code,
        date: "Just now"
      },
      ...prev
    ]);
    alert(`Welfare voucher claimed! Voucher Code: ${code}`);
  };

  // Attendance states
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>("08:30 AM");
  const [gpsLocation] = useState("13.0827° N, 80.2707° E (Central Municipal Depot)");

  // Leaves state
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    {
      id: "LR-091",
      workerName: "Rajesh Kumar",
      startDate: "2026-07-20",
      endDate: "2026-07-22",
      type: "Sick Leave",
      reason: "Medical checkup",
      status: "Approved",
    },
    {
      id: "LR-092",
      workerName: "Rajesh Kumar",
      startDate: "2026-08-05",
      endDate: "2026-08-06",
      type: "Casual Leave",
      reason: "Family function",
      status: "Pending",
    },
    {
      id: "LR-093",
      workerName: "Amit Singh",
      startDate: "2026-08-12",
      endDate: "2026-08-14",
      type: "Duty Pass",
      reason: "Equipment maintenance training",
      status: "Pending",
    },
  ]);
  const [newLeave, setNewLeave] = useState({ startDate: "", endDate: "", type: "Casual Leave", reason: "" });

  // Emergency SOS state
  const [sosTriggered, setSosTriggered] = useState(false);

  // Handlers
  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchForm.location || !dispatchForm.description) {
      alert("Please enter location and task description.");
      return;
    }
    const newTask: WorkerTask = {
      id: "ISS-" + Math.floor(Math.random() * 900 + 1100),
      category: dispatchForm.category,
      location: dispatchForm.location,
      priority: dispatchForm.priority,
      status: "Pending",
      description: dispatchForm.description,
      qrCode: dispatchForm.qrCode || `QR-${dispatchForm.category.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 90 + 10)}`,
      voiceNoteUrl: "#",
      beforePhoto: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&h=300&fit=crop",
      qrVerified: false,
      assignedWorker: dispatchForm.assignedWorker,
    };
    setTasks([newTask, ...tasks]);
    setDispatchModalOpen(false);
    setDispatchForm({
      category: "Pothole Repair",
      location: "",
      priority: "High",
      description: "",
      assignedWorker: "Rajesh Kumar (ID: W-402)",
      qrCode: "",
    });
    alert(`Task Dispatched! Assigned to ${newTask.assignedWorker}`);
  };

  const handleApproveLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Approved" } : l));
    alert("Leave Application Approved.");
  };

  const handleRejectLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Rejected" } : l));
    alert("Leave Application Rejected.");
  };

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
    if (!isCheckedIn) {
      const now = new Date();
      setCheckInTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } else {
      setCheckInTime(null);
    }
  };

  const handleQRVerify = (task: WorkerTask) => {
    setSelectedTask(task);
    setQrModalOpen(true);
  };

  const submitQrCode = () => {
    if (selectedTask && (qrCodeInput.toLowerCase() === selectedTask.qrCode.toLowerCase() || isOfficerView)) {
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, qrVerified: true } : t));
      setQrCodeInput("");
      setQrModalOpen(false);
      alert("Area Verified! Site QR Code matched.");
    } else {
      alert("Invalid QR Code! Please verify code on site.");
    }
  };

  const startAiVerification = (task: WorkerTask) => {
    setSelectedTask(task);
    setIsVerifying(true);
    setVerifyProgress(10);
    setAiScore(null);

    const interval = setInterval(() => {
      setVerifyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVerifying(false);
            const randomScore = Math.floor(Math.random() * 15) + 85;
            setAiScore(randomScore);
            setTasks(tasks.map(t => t.id === task.id ? {
              ...t,
              aiScore: randomScore,
              afterPhoto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop"
            } : t));
          }, 350);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleCompleteTask = (task: WorkerTask) => {
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: "Completed" } : t));
    setPoints(points + 50);
    alert("Task Completed! 50 Points added to wallet.");
  };

  const triggerSos = () => {
    setSosTriggered(true);
    setTimeout(() => {
      alert("EMERGENCY SIGNAL BROADCAST! Location: " + gpsLocation + ". Control Room Dispatched.");
      setSosTriggered(false);
    }, 1500);
  };

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "active") return t.status !== "Completed";
    if (taskFilter === "completed") return t.status === "Completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans pb-20">
      
      {/* Sleek Top Navigation Header */}
      <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-md">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {isOfficerView ? "Field Operations Management" : "Field Worker Portal"}
                </h1>
                {isOfficerView ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Officer Admin View
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5" /> Active Field Duty
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isOfficerView ? "Dispatch tasks, monitor AI completion inspection, and approve worker leaves" : "Field task execution, QR site verification, and welfare points"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOfficerView && (
              <Button
                onClick={() => setDispatchModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-md gap-2 text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <PlusCircle className="h-4 w-4" />
                Dispatch Task
              </Button>
            )}

            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                offlineMode
                  ? "bg-amber-500/20 text-amber-200 border-amber-500/40"
                  : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {offlineMode ? <WifiOff className="h-3.5 w-3.5 text-amber-400" /> : <Wifi className="h-3.5 w-3.5 text-emerald-400" />}
              {offlineMode ? "Offline" : "Online Sync"}
            </button>

            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-lg">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">{points} PTS</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs rounded-lg"
            >
              {isOfficerView ? "Exit Worker View" : "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto border-t border-slate-800/80 pt-1">
          {[
            { id: "tasks", label: `Field Tasks (${tasks.filter(t => t.status !== "Completed").length})`, icon: Briefcase },
            { id: "attendance", label: "Attendance & GPS", icon: MapPin },
            { id: "leaves", label: `Leave Applications (${leaves.filter(l => l.status === "Pending").length} Pending)`, icon: Calendar },
            { id: "welfare", label: "Welfare & Rewards", icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-blue-400 text-blue-400 bg-slate-800/70 rounded-t-lg"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-t-lg"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* KPI 1: Attendance */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duty Attendance</span>
              <div className="bg-emerald-50 p-2 rounded-lg">
                <UserCheck className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-bold text-slate-900">{checkInTime || "Off Duty"}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{isCheckedIn ? "Geofence Checked In" : "Checked Out"}</p>
              </div>
              <Button size="sm" onClick={handleCheckIn} className={`text-xs px-3 py-1 font-semibold rounded-md ${isCheckedIn ? "bg-red-600 hover:bg-red-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
                {isCheckedIn ? "Check Out" : "Check In"}
              </Button>
            </div>
          </div>

          {/* KPI 2: Active Tasks */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Field Tasks</span>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900">{tasks.filter(t => t.status !== "Completed").length}</span>
                <span className="text-xs text-slate-500">Tasks Pending</span>
              </div>
              <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {tasks.filter(t => t.priority === "High" && t.status !== "Completed").length} High Priority
              </p>
            </div>
          </div>

          {/* KPI 3: Leaves */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Applications</span>
              <div className="bg-amber-50 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900">{leaves.filter(l => l.status === "Pending").length}</span>
                <span className="text-xs text-slate-500">Pending Approvals</span>
              </div>
              <p className="text-[11px] text-amber-600 font-medium mt-1">Requires Officer Review</p>
            </div>
          </div>

          {/* KPI 4: Emergency SOS */}
          <div className="bg-red-50/70 border border-red-200 p-5 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="h-4 w-4 text-red-600 animate-pulse" /> Emergency SOS
              </span>
              <div className="bg-red-100 p-2 rounded-lg">
                <Navigation className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <Button
              onClick={triggerSos}
              disabled={sosTriggered}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 rounded-lg shadow-sm text-xs"
            >
              {sosTriggered ? "DISPATCHING SOS..." : "TRIGGER EMERGENCY SOS"}
            </Button>
          </div>
        </div>

        {/* TAB 1: FIELD TASKS */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            
            {/* Filter Bar & Header */}
            <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Work Orders & Field Tasks</h2>
                <p className="text-xs text-slate-500">Complete assigned tasks, verify site QR tags, and run AI inspection</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <Filter className="h-3.5 w-3.5 text-slate-500 ml-1.5" />
                  {[
                    { id: "all", label: "All Tasks" },
                    { id: "active", label: "Active" },
                    { id: "completed", label: "Completed" },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setTaskFilter(f.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        taskFilter === f.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {isOfficerView && (
                  <Button onClick={() => setDispatchModalOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 rounded-lg">
                    <PlusCircle className="h-4 w-4" /> Dispatch Task
                  </Button>
                )}
              </div>
            </div>

            {/* Task Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-white border border-slate-200/90 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden">
                  
                  <div className="p-5 space-y-4">
                    {/* Top Row Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{task.id}</span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            task.priority === "High" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {task.status}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-2">{task.category}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" /> {task.location}
                        </p>
                      </div>

                      {task.qrVerified ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> QR Verified
                        </span>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleQRVerify(task)} className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs gap-1.5 rounded-lg shrink-0">
                          <QrCode className="h-3.5 w-3.5" /> Verify QR
                        </Button>
                      )}
                    </div>

                    {/* Task Description */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                      {task.description}
                    </div>

                    {task.assignedWorker && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Assigned Staff: <strong className="text-slate-900">{task.assignedWorker}</strong></span>
                      </div>
                    )}

                    {/* Photos Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1 tracking-wider">Before Work</span>
                        <ImageWithFallback src={task.beforePhoto} alt="Before" className="h-28 w-full object-cover rounded-lg border border-slate-200 shadow-inner" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1 tracking-wider">After Work (AI Inspected)</span>
                        {task.afterPhoto ? (
                          <ImageWithFallback src={task.afterPhoto} alt="After" className="h-28 w-full object-cover rounded-lg border border-emerald-300 shadow-inner" />
                        ) : (
                          <div className="h-28 w-full bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs">
                            <Upload className="h-5 w-5 mb-1 text-slate-400" /> Upload After Photo
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Score Badge */}
                    {task.aiScore && (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center justify-between">
                        <span className="text-xs text-emerald-800 flex items-center gap-1.5 font-bold">
                          <Sparkles className="h-4 w-4 text-emerald-600" /> AI Verification Score: {task.aiScore}%
                        </span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Passed Inspection
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                    <Button
                      size="sm"
                      onClick={() => startAiVerification(task)}
                      disabled={task.status === "Completed"}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 rounded-lg font-semibold"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Run AI Inspection
                    </Button>

                    {task.status !== "Completed" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteTask(task)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 rounded-lg font-bold shadow-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Complete (+50 PTS)
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE & GPS */}
        {activeTab === "attendance" && (
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">GPS Geofence & Attendance Hub</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time geofenced duty logs and shift tracking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Current GPS Coordinate Lock</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      Geofence Verified
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-800">{gpsLocation}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">Duty Shift Status</Label>
                  <Button onClick={handleCheckIn} className={`w-full py-2 rounded-lg font-bold ${isCheckedIn ? "bg-red-600 hover:bg-red-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
                    {isCheckedIn ? "Check Out of Field Duty" : "Check In to Field Duty"}
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Today's Verified Duty Logs</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Shift Check-in</span>
                    <span className="text-emerald-700 font-mono font-bold">08:30 AM (GPS Confirmed)</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Site QR Match #1</span>
                    <span className="text-blue-700 font-mono font-bold">09:15 AM (Main St)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Current Status</span>
                    <span className="text-emerald-700 font-bold">On Active Duty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE MANAGEMENT */}
        {activeTab === "leaves" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Worker Leave & Duty Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOfficerView ? "Review and approve or reject field worker leave requests" : "Submit leave applications for officer approval"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaves List */}
              <div className="lg:col-span-2 space-y-4">
                {leaves.map((leave) => (
                  <div key={leave.id} className="bg-white border border-slate-200/90 p-5 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{leave.id}</span>
                        <span className="text-sm font-bold text-slate-900">{leave.workerName}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          leave.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          leave.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                          "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">{leave.type}: {leave.startDate} to {leave.endDate}</p>
                      <p className="text-xs text-slate-500">Reason: {leave.reason}</p>
                    </div>

                    {/* Officer Approval Buttons */}
                    {isOfficerView && leave.status === "Pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" onClick={() => handleApproveLeave(leave.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 rounded-lg font-bold">
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectLeave(leave.id)} className="border-red-200 text-red-700 hover:bg-red-50 text-xs gap-1.5 rounded-lg font-bold">
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Leave Application Form */}
              <div className="bg-white border border-slate-200/90 p-5 rounded-xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Apply For Leave</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <Label className="text-slate-700 font-bold">Start Date</Label>
                    <Input type="date" value={newLeave.startDate} onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })} className="bg-slate-50 border-slate-300 text-slate-900 mt-1 rounded-lg text-xs" />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-bold">End Date</Label>
                    <Input type="date" value={newLeave.endDate} onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })} className="bg-slate-50 border-slate-300 text-slate-900 mt-1 rounded-lg text-xs" />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-bold">Leave Type</Label>
                    <select
                      value={newLeave.type}
                      onChange={e => setNewLeave({ ...newLeave, type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 mt-1 text-xs"
                    >
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Duty Pass">Duty Pass</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-bold">Reason</Label>
                    <Textarea value={newLeave.reason} onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="Reason for leave..." className="bg-slate-50 border-slate-300 text-slate-900 mt-1 text-xs rounded-lg" />
                  </div>
                  <Button
                    onClick={() => {
                      if (!newLeave.startDate || !newLeave.endDate) return alert("Please select leave dates.");
                      setLeaves([{ id: "LR-" + Math.floor(Math.random() * 900 + 100), workerName: "Rajesh Kumar", ...newLeave, status: "Pending" }, ...leaves]);
                      setNewLeave({ startDate: "", endDate: "", type: "Casual Leave", reason: "" });
                      alert("Leave Application Submitted!");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg shadow-sm"
                  >
                    Submit Leave Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WELFARE & REWARDS */}
        {activeTab === "welfare" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Worker Welfare Catalog</h2>
              <p className="text-xs text-slate-500 mt-0.5">Redeem earned points for municipal welfare vouchers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {welfareCatalog.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/90 p-5 rounded-xl shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{item.item}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                    <span className="text-xs font-bold text-amber-700 mt-2 inline-block bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {item.cost} Points
                    </span>
                  </div>
                  <Button size="sm" onClick={() => handleRedeemWelfare(item)} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shrink-0">
                    Redeem
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* DISPATCH TASK MODAL (Officer Only) */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" /> Dispatch Field Task to Worker
              </h3>
              <button onClick={() => setDispatchModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-base">✕</button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div>
                <Label className="text-slate-700 font-bold">Task Category</Label>
                <select
                  value={dispatchForm.category}
                  onChange={e => setDispatchForm({ ...dispatchForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 mt-1 text-xs"
                >
                  <option value="Pothole Repair">Pothole Repair</option>
                  <option value="Garbage Collection">Garbage Collection</option>
                  <option value="Street Light Fix">Street Light Fix</option>
                  <option value="Water Leakage Repair">Water Leakage Repair</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-700 font-bold">Location / Intersection</Label>
                <Input
                  value={dispatchForm.location}
                  onChange={e => setDispatchForm({ ...dispatchForm, location: e.target.value })}
                  placeholder="e.g. Main Street & 5th Ave"
                  className="bg-slate-50 border-slate-300 text-slate-900 mt-1 text-xs rounded-lg"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-700 font-bold">Assign Field Worker</Label>
                <select
                  value={dispatchForm.assignedWorker}
                  onChange={e => setDispatchForm({ ...dispatchForm, assignedWorker: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 mt-1 text-xs"
                >
                  <option value="Rajesh Kumar (ID: W-402)">Rajesh Kumar (ID: W-402)</option>
                  <option value="Amit Singh (ID: W-109)">Amit Singh (ID: W-109)</option>
                  <option value="Priya Sharma (ID: W-314)">Priya Sharma (ID: W-314)</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-700 font-bold">Task Description & Instructions</Label>
                <Textarea
                  value={dispatchForm.description}
                  onChange={e => setDispatchForm({ ...dispatchForm, description: e.target.value })}
                  placeholder="Specific field instructions..."
                  className="bg-slate-50 border-slate-300 text-slate-900 mt-1 text-xs rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => setDispatchModalOpen(false)} className="border-slate-300 text-slate-700 rounded-lg">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg px-5">
                  Dispatch Task Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR VERIFICATION MODAL */}
      {qrModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm p-6 text-center space-y-4 rounded-2xl shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Scan Site QR Code</h3>
            <p className="text-xs text-slate-500">Match code string: <span className="font-mono text-amber-700 font-bold">{selectedTask.qrCode}</span></p>
            <Input
              value={qrCodeInput}
              onChange={e => setQrCodeInput(e.target.value)}
              placeholder="Enter or scan QR string..."
              className="bg-slate-50 border-slate-300 text-slate-900 text-center font-mono text-xs rounded-lg"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setQrModalOpen(false)} className="w-1/2 border-slate-300 text-slate-700 rounded-lg">Cancel</Button>
              <Button onClick={submitQrCode} className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold">Verify Code</Button>
            </div>
          </div>
        </div>
      )}

      {/* AI INSPECTION MODAL */}
      {isVerifying && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 text-center space-y-4 rounded-2xl shadow-2xl">
            <Sparkles className="h-10 w-10 text-emerald-600 mx-auto animate-spin" />
            <h3 className="text-base font-bold text-slate-900">AI Vision Inspection in Progress...</h3>
            <p className="text-xs text-slate-500">Analyzing before/after repair surface quality and bitumen density</p>
            <Progress value={verifyProgress} className="h-2 bg-slate-100" />
            <span className="text-xs font-mono text-emerald-700 font-bold">{verifyProgress}% Complete</span>
          </div>
        </div>
      )}
    </div>
  );
}

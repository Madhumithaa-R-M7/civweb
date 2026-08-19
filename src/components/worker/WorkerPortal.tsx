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
  Volume2,
  WifiOff,
  Wifi,
  Sparkles,
  Award,
  Bell,
  ChevronRight,
  TrendingUp,
  CloudLightning,
  AlertTriangle,
  Gift,
  ShieldCheck,
  Send,
  PlusCircle,
  UserCheck,
  XCircle,
  Check,
  Briefcase,
  Users,
  Activity,
  Navigation,
  CheckSquare,
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
  const [gpsLocation] = useState("13.0827° N, 80.2707° E (Central Hub)");

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
    alert("Leave Application Approved by Municipal Officer.");
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
      alert("Area Verified Successfully! Site QR Code matched.");
    } else {
      alert("Invalid QR Code! Please verify code on site pole/bin.");
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
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  const handleCompleteTask = (task: WorkerTask) => {
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: "Completed" } : t));
    setPoints(points + 50);
    alert("Task Marked as Completed! 50 Points added to wallet.");
  };

  const triggerSos = () => {
    setSosTriggered(true);
    setTimeout(() => {
      alert("EMERGENCY SIGNAL BROADCAST! Location: " + gpsLocation + ". Control Room Dispatched.");
      setSosTriggered(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Sleek Top Navigation Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {isOfficerView ? "Field Operations Management" : "Field Worker Portal"}
                </h1>
                {isOfficerView ? (
                  <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Officer Control Mode
                  </span>
                ) : (
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Active Field Duty
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOfficerView ? "Dispatch tasks, oversee resolution photos, and manage worker leave requests" : "Task dispatch, QR verification, AI inspection, and welfare rewards"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOfficerView && (
              <Button
                onClick={() => setDispatchModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 gap-2 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                <PlusCircle className="h-4 w-4" />
                Dispatch New Task
              </Button>
            )}

            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                offlineMode
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {offlineMode ? <WifiOff className="h-3.5 w-3.5 text-amber-400" /> : <Wifi className="h-3.5 w-3.5 text-emerald-400" />}
              {offlineMode ? "Offline" : "Online Sync"}
            </button>

            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 tracking-wide">{points} PTS</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl text-xs"
            >
              {isOfficerView ? "Exit Worker View" : "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 flex gap-3 overflow-x-auto pt-1 border-t border-slate-800/60">
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
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-xl"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-t-xl"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">

        {/* Top Metric Stats Cards - 4 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Attendance */}
          <Card className="bg-slate-900/80 border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance Status</span>
              <div className="bg-emerald-500/10 p-2 rounded-xl">
                <UserCheck className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-white">{checkInTime || "Off Duty"}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{isCheckedIn ? "Geofenced GPS Locked" : "Not Checked In"}</p>
              </div>
              <Button size="sm" onClick={handleCheckIn} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${isCheckedIn ? "bg-red-600/80 hover:bg-red-600 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
                {isCheckedIn ? "Check Out" : "Check In"}
              </Button>
            </div>
          </Card>

          {/* Card 2: Active Tasks */}
          <Card className="bg-slate-900/80 border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Field Tasks</span>
              <div className="bg-blue-500/10 p-2 rounded-xl">
                <Briefcase className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{tasks.filter(t => t.status !== "Completed").length}</span>
                <span className="text-xs text-slate-400">Assigned Tasks</span>
              </div>
              <p className="text-[11px] text-red-400 mt-1 font-medium flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {tasks.filter(t => t.priority === "High" && t.status !== "Completed").length} High Priority Pending
              </p>
            </div>
          </Card>

          {/* Card 3: Pending Leaves */}
          <Card className="bg-slate-900/80 border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leave Applications</span>
              <div className="bg-amber-500/10 p-2 rounded-xl">
                <Calendar className="h-4 w-4 text-amber-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{leaves.filter(l => l.status === "Pending").length}</span>
                <span className="text-xs text-slate-400">Pending Approvals</span>
              </div>
              <p className="text-[11px] text-amber-400 mt-1">Requires Officer Signature</p>
            </div>
          </Card>

          {/* Card 4: Emergency SOS */}
          <Card className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-red-900/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="h-4 w-4 text-red-400 animate-pulse" /> Emergency SOS
              </span>
              <div className="bg-red-500/10 p-2 rounded-xl">
                <Navigation className="h-4 w-4 text-red-400" />
              </div>
            </div>
            <Button
              onClick={triggerSos}
              disabled={sosTriggered}
              className="mt-4 w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2 rounded-xl shadow-lg shadow-red-600/25 text-xs tracking-wider"
            >
              {sosTriggered ? "DISPATCHING SIGNAL..." : "TRIGGER SOS BROADCAST"}
            </Button>
          </Card>
        </div>

        {/* TAB 1: FIELD TASKS */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Active Field Work Orders</h2>
                <p className="text-xs text-slate-400 mt-0.5">Perform repairs, scan site QR tags, and trigger AI vision inspection for completion points</p>
              </div>
              {isOfficerView && (
                <Button onClick={() => setDispatchModalOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5 text-xs rounded-xl">
                  <PlusCircle className="h-4 w-4" /> Dispatch Field Task
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-slate-900/80 border-slate-800 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div className="p-6 space-y-5">
                    
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{task.id}</span>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            task.priority === "High" ? "bg-red-500/15 text-red-300 border-red-500/30" : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            task.status === "Completed" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-2">{task.category}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" /> {task.location}
                        </p>
                      </div>

                      {task.qrVerified ? (
                        <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> QR Verified
                        </span>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleQRVerify(task)} className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs gap-1.5 rounded-xl shrink-0">
                          <QrCode className="h-3.5 w-3.5" /> Verify Site QR
                        </Button>
                      )}
                    </div>

                    {/* Description Box */}
                    <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {task.description}
                    </div>

                    {task.assignedWorker && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Assigned Worker: <strong className="text-slate-200">{task.assignedWorker}</strong></span>
                      </div>
                    )}

                    {/* Before & After Photo Comparison */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5 tracking-wider">Before Work</span>
                        <ImageWithFallback src={task.beforePhoto} alt="Before" className="h-32 w-full object-cover rounded-xl border border-slate-800 shadow-md" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5 tracking-wider">After Work (AI Inspected)</span>
                        {task.afterPhoto ? (
                          <ImageWithFallback src={task.afterPhoto} alt="After" className="h-32 w-full object-cover rounded-xl border border-emerald-500/40 shadow-md" />
                        ) : (
                          <div className="h-32 w-full bg-slate-950/80 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs">
                            <Upload className="h-6 w-6 mb-1 text-slate-600" /> Upload After Photo
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Score Badge */}
                    {task.aiScore && (
                      <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl flex items-center justify-between">
                        <span className="text-xs text-emerald-300 flex items-center gap-2 font-semibold">
                          <Sparkles className="h-4 w-4 text-emerald-400" /> AI Verification Score: {task.aiScore}%
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          Passed Inspection
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-slate-950/50 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <Button
                      size="sm"
                      onClick={() => startAiVerification(task)}
                      disabled={task.status === "Completed"}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 rounded-xl font-medium"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Run AI Inspection
                    </Button>

                    {task.status !== "Completed" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteTask(task)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 rounded-xl font-semibold shadow-lg shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Complete (+50 PTS)
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE & GPS */}
        {activeTab === "attendance" && (
          <Card className="bg-slate-900/80 border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Field GPS & Shift Verification Hub</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time geofenced check-in tracking and duty logs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Current GPS Coordinate Lock</span>
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      Geofence Verified
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-200">{gpsLocation}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-300">Shift Status Toggle</Label>
                  <Button onClick={handleCheckIn} className={`w-full py-2.5 rounded-xl font-semibold ${isCheckedIn ? "bg-red-600 hover:bg-red-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
                    {isCheckedIn ? "Check Out of Field Duty" : "Check In to Field Duty"}
                  </Button>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Today's Verified Duty Logs</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Shift Check-in</span>
                    <span className="text-emerald-400 font-mono font-semibold">08:30 AM (GPS Confirmed)</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Site QR Match #1</span>
                    <span className="text-blue-400 font-mono font-semibold">09:15 AM (Main St)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-400">Current Status</span>
                    <span className="text-emerald-400 font-bold">On Active Duty</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: LEAVE MANAGEMENT */}
        {activeTab === "leaves" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Worker Leave & Duty Requests</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOfficerView ? "Review, approve, or reject field worker leave applications" : "Submit leave applications for officer approval"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaves List */}
              <div className="lg:col-span-2 space-y-4">
                {leaves.map((leave) => (
                  <Card key={leave.id} className="bg-slate-900/80 border-slate-800 p-5 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{leave.id}</span>
                        <span className="text-sm font-bold text-white">{leave.workerName}</span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          leave.status === "Approved" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
                          leave.status === "Rejected" ? "bg-red-500/15 text-red-300 border-red-500/30" :
                          "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{leave.type}: {leave.startDate} to {leave.endDate}</p>
                      <p className="text-xs text-slate-400">Reason: {leave.reason}</p>
                    </div>

                    {/* Officer Approval Buttons */}
                    {isOfficerView && leave.status === "Pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" onClick={() => handleApproveLeave(leave.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 rounded-xl font-semibold shadow-md">
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectLeave(leave.id)} className="border-red-500/30 text-red-300 hover:bg-red-500/20 text-xs gap-1.5 rounded-xl">
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Leave Application Form */}
              <Card className="bg-slate-900/80 border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-white">Apply For Leave</h3>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <Label className="text-slate-300">Start Date</Label>
                    <Input type="date" value={newLeave.startDate} onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })} className="bg-slate-950 border-slate-800 text-white mt-1 rounded-xl text-xs" />
                  </div>
                  <div>
                    <Label className="text-slate-300">End Date</Label>
                    <Input type="date" value={newLeave.endDate} onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })} className="bg-slate-950 border-slate-800 text-white mt-1 rounded-xl text-xs" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Leave Type</Label>
                    <select
                      value={newLeave.type}
                      onChange={e => setNewLeave({ ...newLeave, type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white mt-1 text-xs"
                    >
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Duty Pass">Duty Pass</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-slate-300">Reason</Label>
                    <Textarea value={newLeave.reason} onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="Reason for leave..." className="bg-slate-950 border-slate-800 text-white mt-1 text-xs rounded-xl" />
                  </div>
                  <Button
                    onClick={() => {
                      if (!newLeave.startDate || !newLeave.endDate) return alert("Please select leave dates.");
                      setLeaves([{ id: "LR-" + Math.floor(Math.random() * 900 + 100), workerName: "Rajesh Kumar", ...newLeave, status: "Pending" }, ...leaves]);
                      setNewLeave({ startDate: "", endDate: "", type: "Casual Leave", reason: "" });
                      alert("Leave Application Submitted!");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-600/25"
                  >
                    Submit Leave Application
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 4: WELFARE & REWARDS */}
        {activeTab === "welfare" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Worker Welfare Catalog</h2>
              <p className="text-xs text-slate-400 mt-0.5">Redeem points earned from AI-inspected task completions for municipal welfare vouchers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {welfareCatalog.map((item, idx) => (
                <Card key={idx} className="bg-slate-900/80 border-slate-800 p-5 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{item.item}</h3>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                    <span className="text-xs font-bold text-amber-400 mt-2 inline-block bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {item.cost} Points
                    </span>
                  </div>
                  <Button size="sm" onClick={() => handleRedeemWelfare(item)} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-amber-600/20 shrink-0">
                    Redeem
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* DISPATCH TASK MODAL (Officer Only) */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-lg p-6 space-y-5 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-400" /> Dispatch Field Task to Worker
              </h3>
              <button onClick={() => setDispatchModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div>
                <Label className="text-slate-300">Task Category</Label>
                <select
                  value={dispatchForm.category}
                  onChange={e => setDispatchForm({ ...dispatchForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white mt-1 text-xs"
                >
                  <option value="Pothole Repair">Pothole Repair</option>
                  <option value="Garbage Collection">Garbage Collection</option>
                  <option value="Street Light Fix">Street Light Fix</option>
                  <option value="Water Leakage Repair">Water Leakage Repair</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-300">Location / Intersection</Label>
                <Input
                  value={dispatchForm.location}
                  onChange={e => setDispatchForm({ ...dispatchForm, location: e.target.value })}
                  placeholder="e.g. Main Street & 5th Ave"
                  className="bg-slate-950 border-slate-800 text-white mt-1 text-xs rounded-xl"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-300">Assign Field Worker</Label>
                <select
                  value={dispatchForm.assignedWorker}
                  onChange={e => setDispatchForm({ ...dispatchForm, assignedWorker: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white mt-1 text-xs"
                >
                  <option value="Rajesh Kumar (ID: W-402)">Rajesh Kumar (ID: W-402)</option>
                  <option value="Amit Singh (ID: W-109)">Amit Singh (ID: W-109)</option>
                  <option value="Priya Sharma (ID: W-314)">Priya Sharma (ID: W-314)</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-300">Task Description & Field Notes</Label>
                <Textarea
                  value={dispatchForm.description}
                  onChange={e => setDispatchForm({ ...dispatchForm, description: e.target.value })}
                  placeholder="Specific field instructions..."
                  className="bg-slate-950 border-slate-800 text-white mt-1 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setDispatchModalOpen(false)} className="border-slate-800 text-slate-300 rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-5">
                  Dispatch Task Now
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* QR VERIFICATION MODAL */}
      {qrModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-sm p-6 text-center space-y-4 rounded-2xl shadow-2xl">
            <h3 className="text-base font-bold text-white">Scan Site QR Code</h3>
            <p className="text-xs text-slate-400">Match code string: <span className="font-mono text-amber-400 font-bold">{selectedTask.qrCode}</span></p>
            <Input
              value={qrCodeInput}
              onChange={e => setQrCodeInput(e.target.value)}
              placeholder="Enter or scan QR string..."
              className="bg-slate-950 border-slate-800 text-white text-center font-mono text-xs rounded-xl"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setQrModalOpen(false)} className="w-1/2 border-slate-800 text-slate-300 rounded-xl">Cancel</Button>
              <Button onClick={submitQrCode} className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">Verify Code</Button>
            </div>
          </Card>
        </div>
      )}

      {/* AI INSPECTION MODAL */}
      {isVerifying && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-md p-6 text-center space-y-4 rounded-2xl shadow-2xl">
            <Sparkles className="h-10 w-10 text-emerald-400 mx-auto animate-spin" />
            <h3 className="text-base font-bold text-white">AI Vision Inspection in Progress...</h3>
            <p className="text-xs text-slate-400">Analyzing before/after repair surface quality and bitumen density</p>
            <Progress value={verifyProgress} className="h-2 bg-slate-950" />
            <span className="text-xs font-mono text-emerald-400 font-bold">{verifyProgress}% Complete</span>
          </Card>
        </div>
      )}
    </div>
  );
}

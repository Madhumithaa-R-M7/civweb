import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  AlertOctagon,
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
  Filter,
  LogOut,
  Camera,
  Trash2,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  subscribeToTasks,
  addTaskToFirestore,
  updateTaskInFirestore,
  subscribeToLeaves,
  addLeaveToFirestore,
  updateLeaveStatusInFirestore,
} from "../../firebase";

const notify = (msg: string, type: "success" | "error" | "info" = "info") => {
  alert(`[${type.toUpperCase()}] ${msg}`);
};

export interface WorkerTask {
  id: string;
  category: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  description: string;
  qrCode: string;
  beforePhoto?: string;
  afterPhoto?: string;
  aiScore?: number;
  qrVerified?: boolean;
  assignedWorker?: string;
}

export interface LeaveRequest {
  id: string;
  workerName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
}

const seedTasks: WorkerTask[] = [
  {
    id: "ISS-1247",
    category: "Pothole Surface Repair",
    location: "Main Street & 5th Ave",
    priority: "High",
    status: "In Progress",
    description: "Fill deep pothole on west side of intersection. Compact surface using heavy bitumen roller.",
    qrCode: "QR-MAIN-5TH-POLE-A",
    beforePhoto: "",
    afterPhoto: "",
    qrVerified: false,
    assignedWorker: "Rajesh Kumar (W-402)",
  },
  {
    id: "ISS-1245",
    category: "Garbage Clearance & Sanitization",
    location: "Downtown Commercial Plaza",
    priority: "High",
    status: "In Progress",
    description: "Clear overflowing municipal green waste bin and sanitize surrounding walkway with disinfectant.",
    qrCode: "QR-DOWNTOWN-BIN-04",
    beforePhoto: "",
    afterPhoto: "",
    qrVerified: true,
    assignedWorker: "Amit Singh (W-109)",
  },
  {
    id: "ISS-1246",
    category: "Street Light Driver Maintenance",
    location: "Park Avenue - Block 3",
    priority: "Medium",
    status: "Pending",
    description: "Flickering overhead luminaire. Inspect junction wiring and replace 40W LED driver module.",
    qrCode: "QR-PARK-AVE-LGT-12",
    beforePhoto: "",
    afterPhoto: "",
    qrVerified: false,
    assignedWorker: "Rajesh Kumar (W-402)",
  },
];

const seedLeaves: LeaveRequest[] = [
  {
    id: "LR-091",
    workerName: "Rajesh Kumar",
    startDate: "2026-07-20",
    endDate: "2026-07-22",
    type: "Sick Leave",
    reason: "Medical checkup and recovery",
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
    reason: "Equipment maintenance training pass",
    status: "Pending",
  },
];

const welfareCatalog = [
  { id: "W1", item: "Subsidized Lunch Coupon", cost: 150, desc: "Full nutritious lunch voucher at Municipal Central Canteen." },
  { id: "W2", item: "Winter Safety Boots", cost: 250, desc: "Steel-toe weather-proof safety boots from municipal stores." },
  { id: "W3", item: "Annual Health Checkup Voucher", cost: 300, desc: "Full health screening at City General Hospital." },
  { id: "W4", item: "Extra Paid Rest Day", cost: 500, desc: "Claim 1 additional paid day off approved automatically." },
];

interface WorkerPortalProps {
  onLogout?: () => void;
  isOfficerView?: boolean;
}

export function WorkerPortal({ onLogout, isOfficerView = false }: WorkerPortalProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "attendance" | "leaves" | "welfare">("tasks");
  const [tasks, setTasks] = useState<WorkerTask[]>(seedTasks);
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [points, setPoints] = useState(450);
  const [offlineMode, setOfflineMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null);

  // AI Inspection Dialog State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);

  // QR Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState("");

  // Officer Dispatch Task Modal State
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    category: "Pothole Surface Repair",
    location: "",
    priority: "High" as "High" | "Medium" | "Low",
    description: "",
    assignedWorker: "Rajesh Kumar (W-402)",
    qrCode: "",
  });

  // Attendance State
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>("08:30 AM");
  const [gpsLocation] = useState("13.0827° N, 80.2707° E");

  // Leaves State
  const [leaves, setLeaves] = useState<LeaveRequest[]>(seedLeaves);
  const [newLeave, setNewLeave] = useState({ startDate: "", endDate: "", type: "Casual Leave", reason: "" });

  // Emergency SOS State
  const [sosPulsing, setSosPulsing] = useState(false);

  // Real-time Firestore Sync Listeners
  useEffect(() => {
    if (offlineMode) return;

    const unsubscribeTasks = subscribeToTasks((fireTasks) => {
      if (fireTasks && fireTasks.length > 0) {
        setTasks(fireTasks as WorkerTask[]);
      }
    });

    const unsubscribeLeaves = subscribeToLeaves((fireLeaves) => {
      if (fireLeaves && fireLeaves.length > 0) {
        setLeaves(fireLeaves);
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeLeaves();
    };
  }, [offlineMode]);

  // Photo Upload Handler
  const handlePhotoUpload = (taskId: string, type: "before" | "after", file: File) => {
    const photoUrl = URL.createObjectURL(file);
    const updates = type === "before" ? { beforePhoto: photoUrl } : { afterPhoto: photoUrl };
    
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
    updateTaskInFirestore(taskId, updates);
    notify(`${type === "before" ? "Before" : "After"} photo uploaded for ${taskId}!`, "success");
  };

  const handleRemovePhoto = (taskId: string, type: "before" | "after") => {
    const updates = type === "before" ? { beforePhoto: "" } : { afterPhoto: "" };
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
    updateTaskInFirestore(taskId, updates);
  };

  // Handlers
  const handleCheckInToggle = () => {
    if (!isCheckedIn) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setIsCheckedIn(true);
      setCheckInTime(timeStr);
      notify(`Geofence Shift Checked In at ${timeStr}`, "success");
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
      notify("Checked Out of Shift", "info");
    }
  };

  const triggerSosBroadcast = () => {
    setSosPulsing(true);
    setTimeout(() => {
      setSosPulsing(false);
      notify(`EMERGENCY SOS BROADCAST TRANSMITTED! GPS: ${gpsLocation}. Control Room Alerted.`, "error");
    }, 1800);
  };

  const handleQRVerify = (task: WorkerTask) => {
    setSelectedTask(task);
    setQrModalOpen(true);
  };

  const submitQrCode = () => {
    if (!selectedTask) return;
    if (qrCodeInput.trim().toUpperCase() === selectedTask.qrCode.toUpperCase() || isOfficerView) {
      const updates = { qrVerified: true };
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, ...updates } : t));
      updateTaskInFirestore(selectedTask.id, updates);
      setQrCodeInput("");
      setQrModalOpen(false);
      notify(`Site QR Verified for ${selectedTask.id}!`, "success");
    } else {
      notify(`Invalid QR Code! Expected: ${selectedTask.qrCode}`, "error");
    }
  };

  const startAiVerification = (task: WorkerTask) => {
    setSelectedTask(task);
    setIsVerifying(true);
    setVerifyProgress(0);

    const interval = setInterval(() => {
      setVerifyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVerifying(false);
            const score = Math.floor(Math.random() * 16) + 85;
            const updates = { aiScore: score };
            setTasks(tasks.map(t => t.id === task.id ? { ...t, ...updates } : t));
            updateTaskInFirestore(task.id, updates);
            notify(`AI Vision Inspection Complete! Resolution Score: ${score}%`, "success");
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleCompleteTask = (task: WorkerTask) => {
    const updates = { status: "Completed" as const };
    setTasks(tasks.map(t => t.id === task.id ? { ...t, ...updates } : t));
    updateTaskInFirestore(task.id, updates);
    setPoints(prev => prev + 50);
    notify(`Task ${task.id} Completed! Earned +50 Reward Points.`, "success");
  };

  const handleRedeemWelfare = (item: typeof welfareCatalog[0]) => {
    if (points < item.cost) {
      notify(`Insufficient Points! You need ${item.cost} PTS. Balance: ${points} PTS.`, "error");
      return;
    }
    const voucherCode = `VOUCHER-${Math.floor(Math.random() * 90000 + 10000)}`;
    setPoints(prev => prev - item.cost);
    notify(`Redeemed "${item.item}"! Code: ${voucherCode}`, "success");
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchForm.location || !dispatchForm.description) {
      notify("Please fill in location and description.", "error");
      return;
    }
    const newId = `ISS-${Math.floor(Math.random() * 900 + 1100)}`;
    const newTask: WorkerTask = {
      id: newId,
      category: dispatchForm.category,
      location: dispatchForm.location,
      priority: dispatchForm.priority,
      status: "Pending",
      description: dispatchForm.description,
      qrCode: dispatchForm.qrCode || `QR-${dispatchForm.category.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 89 + 10)}`,
      beforePhoto: "",
      afterPhoto: "",
      qrVerified: false,
      assignedWorker: dispatchForm.assignedWorker,
    };
    setTasks([newTask, ...tasks]);
    addTaskToFirestore(newTask);
    setDispatchModalOpen(false);
    setDispatchForm({
      category: "Pothole Surface Repair",
      location: "",
      priority: "High",
      description: "",
      assignedWorker: "Rajesh Kumar (W-402)",
      qrCode: "",
    });
    notify(`New Task Dispatched (${newId}) assigned to ${newTask.assignedWorker}! Syncing with Firebase.`, "success");
  };

  const handleApproveLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Approved" } : l));
    updateLeaveStatusInFirestore(id, "Approved");
    notify(`Leave Application ${id} Approved.`, "success");
  };

  const handleRejectLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Rejected" } : l));
    updateLeaveStatusInFirestore(id, "Rejected");
    notify(`Leave Application ${id} Rejected.`, "info");
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      notify("Please fill in all fields.", "error");
      return;
    }
    const leaveId = `LR-${Math.floor(Math.random() * 899 + 100)}`;
    const req: LeaveRequest = {
      id: leaveId,
      workerName: "Rajesh Kumar",
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      type: newLeave.type,
      reason: newLeave.reason,
      status: "Pending",
    };
    setLeaves([req, ...leaves]);
    addLeaveToFirestore(req);
    setNewLeave({ startDate: "", endDate: "", type: "Casual Leave", reason: "" });
    notify(`Leave Application ${leaveId} Submitted to Firebase.`, "success");
  };

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "active") return t.status !== "Completed";
    if (taskFilter === "completed") return t.status === "Completed";
    return true;
  });

  const openTasksCount = tasks.filter(t => t.status !== "Completed").length;
  const pendingLeavesCount = leaves.filter(l => l.status === "Pending").length;
  const highPriorityPendingCount = tasks.filter(t => t.priority === "High" && t.status !== "Completed").length;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-6 bg-slate-50 min-h-screen text-slate-900 font-sans">
      
      {/* 1. TOP EXECUTIVE HEADER CARD */}
      <div className="w-full bg-white border border-slate-300 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="flex items-start md:items-center gap-4">
          <div className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-md shrink-0 mt-1 md:mt-0">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Field Operations Console
              </h1>
              {isOfficerView ? (
                <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-black px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 shrink-0 shadow-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-800" /> Officer Control Mode
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-900 border border-blue-300 font-black px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 shrink-0 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" /> Active Field Duty
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-600 font-bold mt-1.5 leading-relaxed">
              Dispatch municipal work orders, verify site QR tags, track geofenced duty shifts, and inspect AI resolution scores.
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 flex-wrap shrink-0 w-full lg:w-auto justify-start lg:justify-end">
          {isOfficerView && (
            <button
              onClick={() => setDispatchModalOpen(true)}
              style={{ backgroundColor: "#1d4ed8", color: "#ffffff" }}
              className="h-12 min-h-[48px] px-6 font-black text-xs md:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 border border-blue-700 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-white" />
              Dispatch New Task
            </button>
          )}

          <button
            onClick={() => setOfflineMode(!offlineMode)}
            style={offlineMode ? { backgroundColor: "#d97706", color: "#ffffff" } : { backgroundColor: "#dbeafe", color: "#1e3a8a" }}
            className="h-12 min-h-[48px] px-5 flex items-center justify-center gap-2 rounded-xl text-xs md:text-sm font-black border-2 border-blue-300 transition-all shrink-0 cursor-pointer"
          >
            {offlineMode ? <WifiOff className="h-4 w-4 text-white" /> : <Wifi className="h-4 w-4 text-blue-800" />}
            {offlineMode ? "Offline Mode" : "Firebase Sync Active"}
          </button>

          <div className="h-12 min-h-[48px] px-5 flex items-center justify-center gap-2 bg-amber-100 border-2 border-amber-300 rounded-xl shrink-0 shadow-xs">
            <Award className="h-4 w-4 text-amber-800" />
            <span className="text-xs md:text-sm font-mono font-black text-amber-950">{points} PTS</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              style={{ backgroundColor: "#f1f5f9", color: "#0f172a" }}
              className="h-12 min-h-[48px] px-5 border-2 border-slate-300 font-black text-xs md:text-sm rounded-xl flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-slate-800" />
              Exit Portal
            </button>
          )}
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS BAR (Equal Heights h-12 & Perfectly Proportioned Padding) */}
      <div className="w-full bg-slate-100 border-2 border-slate-300 rounded-2xl p-2.5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {[
            { id: "tasks", label: "Field Work Orders", count: openTasksCount, icon: Briefcase },
            { id: "attendance", label: "Attendance & GPS", count: null, icon: MapPin },
            { id: "leaves", label: "Leave Applications", count: pendingLeavesCount, icon: Calendar },
            { id: "welfare", label: "Welfare & Rewards", count: null, icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={isActive ? { backgroundColor: "#2563eb", color: "#ffffff" } : { backgroundColor: "#ffffff", color: "#0f172a" }}
                className={`w-full h-12 min-h-[48px] px-5 flex items-center justify-center gap-2.5 text-xs md:text-sm font-black rounded-xl transition-all border-2 cursor-pointer ${
                  isActive ? "border-blue-700 shadow-md scale-[1.02]" : "border-slate-300 hover:bg-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-800"}`} />
                <span className="font-black text-center">{tab.label}</span>
                {tab.count !== null && (
                  <span
                    style={isActive ? { backgroundColor: "#ffffff", color: "#1e3a8a" } : { backgroundColor: "#2563eb", color: "#ffffff" }}
                    className="inline-flex items-center justify-center font-mono font-black text-xs px-2.5 py-0.5 rounded-full ml-1.5 leading-none shrink-0"
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DASHBOARD STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        
        {/* StatCard 1: Attendance */}
        <div className="bg-white border-2 border-slate-300 hover:border-blue-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[145px] w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Attendance Status</span>
            <div className="bg-blue-100 text-blue-800 p-2.5 rounded-xl border border-blue-300 shrink-0">
              <UserCheck className="h-5 w-5 text-blue-800" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 mt-1">
            <div>
              <span className="text-2xl font-mono font-black text-slate-900">{checkInTime || "Off Duty"}</span>
              <p className="text-xs text-slate-700 font-bold mt-1 truncate">
                {isCheckedIn ? "Geofenced GPS Locked" : "Not Checked In"}
              </p>
            </div>
            <button
              onClick={handleCheckInToggle}
              style={isCheckedIn ? { backgroundColor: "#e11d48", color: "#ffffff" } : { backgroundColor: "#059669", color: "#ffffff" }}
              className="h-10 px-4 py-2 text-xs md:text-sm font-black rounded-xl transition-all shrink-0 shadow-sm cursor-pointer flex items-center justify-center border border-slate-300"
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </button>
          </div>
        </div>

        {/* StatCard 2: Active Tasks */}
        <div className="bg-white border-2 border-slate-300 hover:border-blue-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[145px] w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Active Field Tasks</span>
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shrink-0">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-slate-900">{openTasksCount}</span>
              <span className="text-xs text-slate-700 font-bold truncate">Open Work Orders</span>
            </div>
            <p className="text-xs text-rose-700 font-black mt-1 flex items-center gap-1 truncate">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-700" /> {highPriorityPendingCount} high priority pending
            </p>
          </div>
        </div>

        {/* StatCard 3: Leave Requests */}
        <div className="bg-white border-2 border-slate-300 hover:border-blue-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[145px] w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Leave Applications</span>
            <div className="bg-amber-100 text-amber-800 p-2.5 rounded-xl border border-amber-300 shrink-0">
              <Calendar className="h-5 w-5 text-amber-800" />
            </div>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-slate-900">{pendingLeavesCount}</span>
              <span className="text-xs text-slate-700 font-bold truncate">Pending Approvals</span>
            </div>
            <p className="text-xs text-amber-900 font-black mt-1 truncate">Requires officer signature</p>
          </div>
        </div>

        {/* StatCard 4: Emergency SOS */}
        <div className="bg-gradient-to-br from-rose-100 to-red-100 border-2 border-rose-300 p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[145px] w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="h-4 w-4 text-rose-700 animate-pulse shrink-0" /> Emergency SOS
            </span>
            <div className="bg-rose-600 text-white p-2 rounded-xl shadow-xs shrink-0">
              <Navigation className="h-4 w-4 text-white" />
            </div>
          </div>
          <button
            onClick={triggerSosBroadcast}
            disabled={sosPulsing}
            style={{ backgroundColor: "#e11d48", color: "#ffffff" }}
            className={`w-full h-11 min-h-[44px] font-black rounded-xl text-xs md:text-sm shadow-md tracking-wider transition-all mt-1 cursor-pointer flex items-center justify-center ${
              sosPulsing ? "animate-pulse" : ""
            }`}
          >
            {sosPulsing ? "BROADCASTING SOS..." : "TRIGGER SOS BROADCAST"}
          </button>
        </div>
      </div>

      {/* 4. FEATURE TABS */}

      {/* TAB A: FIELD TASKS */}
      {activeTab === "tasks" && (
        <div className="space-y-6 w-full">
          {/* Section Toolbar Header */}
          <div className="w-full bg-white border border-slate-300 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Field Work Orders</h2>
              <p className="text-xs text-slate-600 font-bold mt-1">Execute assigned repairs, verify site QR tags, upload site photos, and trigger AI inspection</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-300">
                <Filter className="h-3.5 w-3.5 text-slate-600 ml-2 shrink-0" />
                {[
                  { id: "all", label: "All Tasks" },
                  { id: "active", label: "Active" },
                  { id: "completed", label: "Completed" },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setTaskFilter(f.id)}
                    style={taskFilter === f.id ? { backgroundColor: "#2563eb", color: "#ffffff" } : { backgroundColor: "transparent", color: "#1e293b" }}
                    className="px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer"
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {isOfficerView && (
                <button
                  onClick={() => setDispatchModalOpen(true)}
                  style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                  className="h-11 min-h-[44px] text-xs md:text-sm font-black px-5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4 text-white" /> Dispatch Task
                </button>
              )}
            </div>
          </div>

          {/* Task Work Order Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
            {filteredTasks.map((task) => (
              <div key={task.id} className="w-full bg-white border-2 border-slate-300 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col justify-between p-6 md:p-8 space-y-5">
                
                <div className="space-y-4">
                  {/* Meta Bar */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-md border border-blue-300">{task.id}</span>
                        <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                          task.priority === "High" ? "bg-rose-100 text-rose-900 border-rose-300" : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}>
                          {task.priority} Priority
                        </span>
                        <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                          task.status === "Completed" ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-sky-100 text-sky-900 border-sky-300"
                        }`}>
                          {task.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 mt-3 tracking-tight">{task.category}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-bold">
                        <MapPin className="h-4 w-4 text-blue-600 shrink-0" /> {task.location}
                      </p>
                    </div>

                    {task.qrVerified ? (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shrink-0 shadow-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" /> QR Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleQRVerify(task)}
                        style={{ backgroundColor: "#d97706", color: "#ffffff" }}
                        className="h-10 px-4 text-xs md:text-sm gap-1.5 rounded-xl shrink-0 font-black flex items-center justify-center shadow-md border border-amber-700 cursor-pointer"
                      >
                        <QrCode className="h-4 w-4 text-white" /> Verify Site QR
                      </button>
                    )}
                  </div>

                  {/* Left-Border Instruction Box */}
                  <div className="border-l-4 border-blue-600 bg-slate-50 p-4 rounded-r-xl text-xs text-slate-800 font-bold leading-relaxed">
                    {task.description}
                  </div>

                  {task.assignedWorker && (
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-bold bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <Users className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Assigned Staff: <strong className="text-slate-900 font-black">{task.assignedWorker}</strong></span>
                    </div>
                  )}

                  {/* Before / After Interactive Photo Dropzone Frames */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    
                    {/* Before Photo Box */}
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Before Repair Photo</span>
                      {task.beforePhoto ? (
                        <div className="relative aspect-video w-full rounded-xl border border-slate-300 overflow-hidden shadow-xs group">
                          <ImageWithFallback src={task.beforePhoto} alt="Before Repair" className="h-full w-full object-cover" />
                          <button
                            onClick={() => handleRemovePhoto(task.id, "before")}
                            className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="aspect-video w-full bg-slate-50 hover:bg-blue-50/50 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center text-slate-700 hover:text-blue-700 text-xs font-bold p-3 text-center cursor-pointer transition-all">
                          <Camera className="h-6 w-6 mb-1 text-blue-600" />
                          <span>Upload Before Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                handlePhotoUpload(task.id, "before", e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* After Photo Box */}
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">After Repair Photo</span>
                      {task.afterPhoto ? (
                        <div className="relative aspect-video w-full rounded-xl border border-emerald-300 overflow-hidden shadow-xs group">
                          <ImageWithFallback src={task.afterPhoto} alt="After Repair" className="h-full w-full object-cover" />
                          <button
                            onClick={() => handleRemovePhoto(task.id, "after")}
                            className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="aspect-video w-full bg-slate-50 hover:bg-emerald-50/50 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center text-slate-700 hover:text-emerald-700 text-xs font-bold p-3 text-center cursor-pointer transition-all">
                          <Upload className="h-6 w-6 mb-1 text-emerald-600" />
                          <span>Upload After Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                handlePhotoUpload(task.id, "after", e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* AI Score Badge */}
                  {task.aiScore && (
                    <div className="bg-emerald-100 border border-emerald-300 p-4 rounded-xl flex items-center justify-between shadow-xs">
                      <span className="text-xs text-emerald-950 flex items-center gap-2 font-black">
                        <Sparkles className="h-4 w-4 text-emerald-700" /> AI Verification Score: <span className="font-mono text-sm">{task.aiScore}%</span>
                      </span>
                      <span className="bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xs">
                        Passed Inspection
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 mt-4">
                  <button
                    onClick={() => startAiVerification(task)}
                    disabled={task.status === "Completed"}
                    style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                    className="h-11 min-h-[44px] font-black text-xs md:text-sm px-5 rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-blue-700 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 text-white" /> Run AI Inspection
                  </button>

                  {task.status !== "Completed" && (
                    <button
                      onClick={() => handleCompleteTask(task)}
                      style={{ backgroundColor: "#059669", color: "#ffffff" }}
                      className="h-11 min-h-[44px] font-black text-xs md:text-sm px-6 rounded-xl shadow-md border border-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4 text-white" /> Complete (+50 PTS)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB B: ATTENDANCE & GPS */}
      {activeTab === "attendance" && (
        <div className="bg-white border border-slate-300 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 w-full">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Field GPS & Shift Verification Hub</h2>
            <p className="text-xs text-slate-600 font-bold mt-1">Geofenced GPS coordinate lock and shift duty records</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-4">
              {/* GPS Container with Explicit Hex Dark Background #0f172a & White Text */}
              <div
                style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
                className="p-6 rounded-2xl shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">GPS Coordinate Lock</span>
                  <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400 text-xs font-black px-3 py-1 rounded-full">
                    Geofence Verified
                  </span>
                </div>
                <p className="text-xl font-mono text-white font-black tracking-wide">{gpsLocation}</p>
                <p className="text-xs text-slate-300 font-bold">Municipal Central Depot Sector #04</p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-800">Shift Duty Status Toggle</Label>
                <button
                  onClick={handleCheckInToggle}
                  style={isCheckedIn ? { backgroundColor: "#e11d48", color: "#ffffff" } : { backgroundColor: "#059669", color: "#ffffff" }}
                  className="w-full h-12 min-h-[48px] px-6 rounded-xl font-black text-xs md:text-sm shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-slate-300"
                >
                  <UserCheck className="h-5 w-5 text-white shrink-0" />
                  <span>{isCheckedIn ? "Check Out of Field Duty Shift" : "Check In to Field Duty Shift"}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Today's Verified Duty Logs</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                  <span className="text-slate-700 font-bold">Shift Check-in</span>
                  <span className="text-emerald-700 font-mono font-black">08:30 AM (GPS Confirmed)</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-slate-200">
                  <span className="text-slate-700 font-bold">Site QR Match #1</span>
                  <span className="text-blue-700 font-mono font-black">09:15 AM (Main St)</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-slate-700 font-bold">Current Duty Status</span>
                  <span className="text-emerald-700 font-black">On Active Field Duty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: LEAVE APPLICATIONS */}
      {activeTab === "leaves" && (
        <div className="space-y-6 w-full">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Worker Leave & Duty Requests</h2>
            <p className="text-xs text-slate-600 font-bold mt-1">
              {isOfficerView ? "Review and approve or reject field worker leave applications" : "Submit leave applications for supervisor approval"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2 space-y-4">
              {leaves.map((leave) => (
                <div key={leave.id} className="bg-white border-2 border-slate-300 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-lg border border-blue-300">{leave.id}</span>
                      <span className="text-base font-black text-slate-900">{leave.workerName}</span>
                      <span className={`text-[11px] font-black px-3 py-0.5 rounded-full border ${
                        leave.status === "Approved" ? "bg-emerald-100 text-emerald-900 border-emerald-300" :
                        leave.status === "Rejected" ? "bg-rose-100 text-rose-900 border-rose-300" :
                        "bg-amber-100 text-amber-900 border-amber-300"
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-bold">{leave.type}: {leave.startDate} to {leave.endDate}</p>
                    <p className="text-xs text-slate-600 font-semibold">Reason: {leave.reason}</p>
                  </div>

                  {isOfficerView && leave.status === "Pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleApproveLeave(leave.id)} style={{ backgroundColor: "#059669", color: "#ffffff" }} className="h-10 px-4 text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                        <Check className="h-4 w-4 text-white" /> Approve
                      </button>
                      <button onClick={() => handleRejectLeave(leave.id)} style={{ backgroundColor: "#e11d48", color: "#ffffff" }} className="h-10 px-4 text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                        <XCircle className="h-4 w-4 text-white" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-slate-300 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">Apply For Leave</h3>
              <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                <div>
                  <Label className="text-slate-800 font-black">Start Date</Label>
                  <Input type="date" value={newLeave.startDate} onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })} className="bg-slate-50 border-slate-300 text-slate-900 mt-1 rounded-xl text-xs font-bold" required />
                </div>
                <div>
                  <Label className="text-slate-800 font-black">End Date</Label>
                  <Input type="date" value={newLeave.endDate} onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })} className="bg-slate-50 border-slate-300 text-slate-900 mt-1 rounded-xl text-xs font-bold" required />
                </div>
                <div>
                  <Label className="text-slate-800 font-black">Leave Type</Label>
                  <select
                    value={newLeave.type}
                    onChange={e => setNewLeave({ ...newLeave, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 mt-1 text-xs font-bold"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Duty Pass">Duty Pass</option>
                  </select>
                </div>
                <div>
                  <Label className="text-slate-800 font-black">Reason</Label>
                  <Textarea value={newLeave.reason} onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="Reason for leave..." className="bg-slate-50 border-slate-300 text-slate-900 mt-1 text-xs rounded-xl font-semibold" required />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                  className="w-full h-12 min-h-[48px] font-black rounded-xl shadow-md text-xs md:text-sm border border-blue-700 cursor-pointer flex items-center justify-center"
                >
                  Submit Leave Application
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: WELFARE REWARDS */}
      {activeTab === "welfare" && (
        <div className="space-y-6 w-full">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Worker Welfare Catalog</h2>
            <p className="text-xs text-slate-600 font-bold mt-1">Redeem points earned from completed, AI-inspected field work orders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {welfareCatalog.map((item) => (
              <div key={item.id} className="bg-white border-2 border-slate-300 p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900">{item.item}</h3>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">{item.desc}</p>
                  <span className="text-xs font-mono font-black text-amber-900 mt-2 inline-block bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    {item.cost} Points Required
                  </span>
                </div>
                <button
                  onClick={() => handleRedeemWelfare(item)}
                  style={{ backgroundColor: "#d97706", color: "#ffffff" }}
                  className="h-11 min-h-[44px] text-xs md:text-sm font-black px-5 rounded-xl shadow-md border border-amber-700 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Gift className="h-4 w-4 text-white" /> Redeem Voucher
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}

      {/* Dispatch Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" /> Dispatch Field Task
              </h3>
              <button onClick={() => setDispatchModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div>
                <Label className="text-slate-800 font-black">Task Category</Label>
                <select
                  value={dispatchForm.category}
                  onChange={e => setDispatchForm({ ...dispatchForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 mt-1 text-xs font-bold"
                >
                  <option value="Pothole Surface Repair">Pothole Surface Repair</option>
                  <option value="Garbage Clearance & Sanitization">Garbage Clearance & Sanitization</option>
                  <option value="Street Light Driver Maintenance">Street Light Driver Maintenance</option>
                  <option value="Water Pipeline Leak Fix">Water Pipeline Leak Fix</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-800 font-black">Location / Intersection</Label>
                <Input
                  value={dispatchForm.location}
                  onChange={e => setDispatchForm({ ...dispatchForm, location: e.target.value })}
                  placeholder="e.g. Main Street & 5th Ave"
                  className="bg-slate-50 border border-slate-300 text-slate-900 mt-1 text-xs rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-800 font-black">Assign Field Worker</Label>
                <select
                  value={dispatchForm.assignedWorker}
                  onChange={e => setDispatchForm({ ...dispatchForm, assignedWorker: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 mt-1 text-xs font-bold"
                >
                  <option value="Rajesh Kumar (W-402)">Rajesh Kumar (W-402)</option>
                  <option value="Amit Singh (W-109)">Amit Singh (W-109)</option>
                  <option value="Priya Sharma (W-314)">Priya Sharma (W-314)</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-800 font-black">Instructions</Label>
                <Textarea
                  value={dispatchForm.description}
                  onChange={e => setDispatchForm({ ...dispatchForm, description: e.target.value })}
                  placeholder="Specific repair instructions..."
                  className="bg-slate-50 border border-slate-300 text-slate-900 mt-1 text-xs rounded-xl font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setDispatchModalOpen(false)} className="h-10 px-4 border border-slate-300 text-slate-900 bg-white hover:bg-slate-100 rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" style={{ backgroundColor: "#2563eb", color: "#ffffff" }} className="h-10 px-5 font-bold rounded-xl cursor-pointer border border-blue-700">
                  Dispatch Task Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm p-6 text-center space-y-4 rounded-3xl shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">Scan Site QR Code</h3>
            <p className="text-xs text-slate-600 font-bold">
              Match code string: <span className="font-mono text-amber-900 font-black text-sm">{selectedTask.qrCode}</span>
            </p>
            <Input
              value={qrCodeInput}
              onChange={e => setQrCodeInput(e.target.value)}
              placeholder="Enter QR string..."
              className="bg-slate-50 border border-slate-300 text-slate-900 text-center font-mono text-xs rounded-xl font-bold"
            />
            <div className="flex gap-2">
              <button onClick={() => setQrModalOpen(false)} className="w-1/2 h-10 border border-slate-300 text-slate-900 bg-white hover:bg-slate-100 rounded-xl font-bold cursor-pointer">
                Cancel
              </button>
              <button onClick={submitQrCode} style={{ backgroundColor: "#2563eb", color: "#ffffff" }} className="w-1/2 h-10 rounded-xl font-black cursor-pointer border border-blue-700">
                Verify Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Inspection Modal */}
      {isVerifying && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 text-center space-y-4 rounded-3xl shadow-2xl">
            <Sparkles className="h-10 w-10 text-blue-600 mx-auto animate-spin" />
            <h3 className="text-lg font-black text-slate-900">AI Vision Inspection in Progress...</h3>
            <p className="text-xs text-slate-600 font-bold">Analyzing repair surface quality and bitumen density</p>
            <Progress value={verifyProgress} className="h-2.5 bg-slate-100" />
            <span className="text-xs font-mono text-blue-800 font-black">{verifyProgress}% Complete</span>
          </div>
        </div>
      )}
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Building2,
  Play,
  CheckCircle2,
  Sparkles,
  FileText,
  Clock,
  Send,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

interface IssueDetailModalProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
}

const timeline = [
  { stage: "Reported", date: "2026-08-16 10:30 AM", user: "Maria Garcia (Citizen)" },
  { stage: "AI Classified", date: "2026-08-16 10:31 AM", user: "Civic Vision Engine (96.4% Match)" },
  { stage: "Assigned", date: "2026-08-16 11:15 AM", user: "John Smith (Municipal Officer)" },
  { stage: "Field Worker Dispatched", date: "2026-08-16 01:20 PM", user: "Sanjay Kumar (Field Worker W-402)" },
  { stage: "Work Started", date: "2026-08-16 02:45 PM", user: "Site QR Scanned & Verified" },
  { stage: "Resolved", date: "2026-08-17 09:10 AM", user: "AI Resolution Proof Approved" },
];

export function IssueDetailModal({
  issue,
  open,
  onClose,
}: IssueDetailModalProps) {
  if (!issue) return null;

  const handleApprove = () => {
    alert(`Proof approved. Case ${issue.id} marked as RESOLVED.`);
    onClose();
  };

  const handleReject = () => {
    alert(`Work proof rejected. Field worker notified.`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-slate-200 p-6 shadow-xl">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="flex flex-wrap items-center justify-between gap-3 text-slate-900">
            <span className="text-xl font-bold">Issue #{issue.id}</span>
            <div className="flex items-center gap-2">
              <Badge className={
                issue.priority === "High" ? "bg-red-50 text-red-700 border-red-200" :
                issue.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-emerald-50 text-emerald-700 border-emerald-200"
              }>
                {issue.priority} Priority
              </Badge>
              <Badge className={
                issue.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                issue.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-amber-50 text-amber-700 border-amber-200"
              }>
                {issue.status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Photos & AI Verification */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Work Proof Photos (Before vs After)</h3>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">BEFORE (Reported):</span>
                  <ImageWithFallback
                    src={issue.photo}
                    alt={issue.category}
                    className="w-full h-36 object-cover rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">AFTER (Field Upload):</span>
                  <ImageWithFallback
                    src={
                      issue.status === "Pending"
                        ? "https://images.unsplash.com/photo-1574676039880-73da8368f0eb?w=500&h=300&fit=crop"
                        : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop"
                    }
                    alt="After Repair"
                    className="w-full h-36 object-cover rounded-lg border border-emerald-300"
                  />
                </div>
              </div>

              {/* AI Verification box */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">AI Classification & Verification</span>
                    <span className="text-xs text-emerald-950 font-medium">Cleanliness Score: <strong>96.4% Match</strong></span>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">Verified</Badge>
              </div>
            </div>

            {/* Right: Issue & Citizen Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Issue Information</h3>
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-bold text-slate-900">{issue.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-slate-900">{issue.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold text-slate-900">{issue.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned Officer:</span>
                    <span className="font-semibold text-blue-900">{issue.officer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Reported Date:</span>
                    <span className="text-slate-700">{issue.date}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Citizen Information</h3>
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Reporter:</span>
                    <span className="font-bold text-slate-900">Maria Garcia</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="text-slate-700">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-700">maria.garcia@email.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Case Description</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              Large pothole on Main Street near intersection with 5th Avenue. The pothole is approximately 2 feet wide and 6 inches deep, posing a hazard to vehicles and pedestrians. Water accumulates in the hole during rain, requiring asphalt filler and seal.
            </div>
          </div>

          {/* Vertical Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Case Progression Timeline</h3>
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-1"></span>
                    {idx < timeline.length - 1 && <span className="h-5 w-0.5 bg-slate-200 my-0.5"></span>}
                  </div>
                  <div className="flex-1 flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-slate-900">{item.stage}</span>
                    <span className="text-[11px] text-slate-500">{item.user} • <span className="font-mono">{item.date}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-200" />

          {/* Case Actions Bar */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Case Management Actions</h3>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <Select defaultValue={issue.officer}>
                  <SelectTrigger className="w-44 h-9 text-xs border-slate-200 bg-white rounded-xl">
                    <SelectValue placeholder="Assign Officer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="John Smith" className="text-xs">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson" className="text-xs">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Davis" className="text-xs">Mike Davis</SelectItem>
                    <SelectItem value="Sanjay Kumar" className="text-xs">Sanjay Kumar (Field Worker)</SelectItem>
                    <SelectItem value="Unassigned" className="text-xs">Unassigned</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue={issue.status}>
                  <SelectTrigger className="w-40 h-9 text-xs border-slate-200 bg-white rounded-xl">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
                    <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
                    <SelectItem value="Resolved" className="text-xs">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleReject} className="h-9 text-xs border-slate-200 text-red-600 hover:bg-red-50 rounded-xl">
                  Reject Proof
                </Button>
                <Button size="sm" onClick={handleApprove} className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Approve & Resolve
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-9 text-xs text-slate-600 rounded-xl">
                  Close
                </Button>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

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
  UserPlus,
  Send,
  CheckCircle2,
  Sparkles,
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
  {
    date: "2025-10-28 10:30 AM",
    action: "Issue reported by citizen",
    user: "Maria Garcia",
  },
  {
    date: "2025-10-28 11:15 AM",
    action: "Assigned to officer",
    user: "Admin User",
  },
  {
    date: "2025-10-28 02:45 PM",
    action: "Officer en route to location",
    user: "Sanjay Kumar (Field Worker)",
  },
  {
    date: "2025-10-28 03:20 PM",
    action: "Work in progress & GPS verified",
    user: "Sanjay Kumar (Field Worker)",
  },
];

export function IssueDetailModal({
  issue,
  open,
  onClose,
}: IssueDetailModalProps) {
  if (!issue) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "Low":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700 border border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleApprove = () => {
    alert(`Proof approved. Ticket ${issue.id} has been marked as RESOLVED. 50 reward points credited to Sanjay Kumar.`);
    onClose();
  };

  const handleReject = () => {
    alert(`Work proof rejected. Sanjay Kumar notified via worker portal to re-clean the site.`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between border-b pb-3">
            <span className="text-xl font-bold text-gray-800">Issue Details - {issue.id}</span>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(issue.priority)}>
                {issue.priority} Priority
              </Badge>
              <Badge className={getStatusColor(issue.status)}>
                {issue.status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Work Proof Photos (Before vs After)</h3>
              
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg border border-gray-150">
                <div>
                  <span className="text-[9px] text-gray-500 font-bold block mb-1">BEFORE (Reported):</span>
                  <ImageWithFallback
                    src={issue.photo}
                    alt={issue.category}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold block mb-1">AFTER (Worker Upload):</span>
                  <ImageWithFallback
                    src={
                      issue.status === "Pending"
                        ? "https://images.unsplash.com/photo-1574676039880-73da8368f0eb?w=500&h=300&fit=crop"
                        : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop"
                    }
                    alt="Proof of Cleanliness"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              {/* AI Verification box */}
              <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-green-600 animate-pulse" />
                  <div>
                    <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">AI Image Cleanliness Verification</p>
                    <p className="text-xs text-green-900 mt-0.5">
                      Cleanliness Score: <span className="font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">96.4% Match</span>
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white text-[10px]">Verified</Badge>
              </div>

              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Play className="h-4 w-4 mr-2" />
                  Play Citizen Voice Note
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Issue Information</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-150">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-550 font-medium">Category</p>
                      <p className="text-sm font-semibold text-gray-800">{issue.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-550 font-medium">Location</p>
                      <p className="text-sm font-semibold text-gray-800">{issue.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-550 font-medium">Reported Date</p>
                      <p className="text-sm font-semibold text-gray-800">{issue.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-550 font-medium">Department</p>
                      <p className="text-sm font-semibold text-gray-800">{issue.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Citizen Information</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-150">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-550 font-medium">Name</p>
                      <p className="text-sm font-semibold text-gray-800">Maria Garcia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-550 font-medium">Phone</p>
                      <p className="text-sm font-semibold text-gray-800">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-550 font-medium">Email</p>
                      <p className="text-sm font-semibold text-gray-800">maria.garcia@email.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-150">
              <p className="text-gray-700 text-sm leading-relaxed">
                Large pothole on Main Street near the intersection with 5th
                Avenue. The pothole is approximately 2 feet wide and 6 inches
                deep, posing a hazard to vehicles and pedestrians. Water
                accumulates in the hole during rain, making it even more
                dangerous.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Location Map</h3>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-1.5" />
                <p className="text-gray-600 text-xs">
                  Map coordinates: {issue.location}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Progress Timeline</h3>
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-xs font-semibold text-gray-800">{item.action}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {item.date} • {item.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 font-bold">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-48">
                <Select defaultValue={issue.officer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign Officer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                    <SelectItem value="Sanjay Kumar">Sanjay Kumar (Field Worker)</SelectItem>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-48">
                <Select defaultValue={issue.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleReject} variant="destructive" className="font-semibold text-xs">
                Reject Proof
              </Button>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 font-semibold text-xs text-white">
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Approve & Mark Resolved
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


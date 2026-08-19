import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, UserPlus, Mail, Phone, MapPin, Radio, Send, Users, ShieldCheck, Activity } from "lucide-react";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Officer {
  id: string;
  name: string;
  photo: string;
  designation: string;
  department: string;
  ward: string;
  assignedTasks: number;
  completedTasks: number;
  phone: string;
  email: string;
  status: "Active" | "On Break" | "Offline";
  gpsCoords?: string;
  lastActive?: string;
}

const mockOfficers: Officer[] = [
  {
    id: "OFF-001",
    name: "John Smith",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    designation: "Senior Road Superintendent",
    department: "Roads",
    ward: "Ward 4 — Central",
    assignedTasks: 12,
    completedTasks: 45,
    phone: "+1 (555) 234-5678",
    email: "john.smith@city.gov",
    status: "Active",
    gpsCoords: "13.0850° N, 80.2720° E",
    lastActive: "Active 2 mins ago",
  },
  {
    id: "OFF-002",
    name: "Sarah Johnson",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    designation: "Chief Sanitation Inspector",
    department: "Sanitation",
    ward: "Ward 2 — North",
    assignedTasks: 8,
    completedTasks: 38,
    phone: "+1 (555) 345-6789",
    email: "sarah.j@city.gov",
    status: "Active",
    gpsCoords: "13.0811° N, 80.2740° E",
    lastActive: "Active 5 mins ago",
  },
  {
    id: "OFF-003",
    name: "Mike Davis",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    designation: "Parks & Urban Forestry Manager",
    department: "Parks",
    ward: "Ward 7 — East",
    assignedTasks: 5,
    completedTasks: 52,
    phone: "+1 (555) 456-7890",
    email: "mike.davis@city.gov",
    status: "Active",
    gpsCoords: "13.0827° N, 80.2707° E",
    lastActive: "Active 10 mins ago",
  },
  {
    id: "OFF-004",
    name: "Emily Chen",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    designation: "Electrical & Lighting Engineer",
    department: "Lighting",
    ward: "Ward 3 — South",
    assignedTasks: 10,
    completedTasks: 41,
    phone: "+1 (555) 567-8901",
    email: "emily.chen@city.gov",
    status: "On Break",
    gpsCoords: "13.0880° N, 80.2690° E",
    lastActive: "Active 25 mins ago",
  },
  {
    id: "OFF-005",
    name: "David Martinez",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    designation: "Water Supply Supervisor",
    department: "Water",
    ward: "Ward 1 — West",
    assignedTasks: 7,
    completedTasks: 35,
    phone: "+1 (555) 678-9012",
    email: "david.m@city.gov",
    status: "Active",
    gpsCoords: "13.0805° N, 80.2715° E",
    lastActive: "Active 1 min ago",
  },
];

export function OfficersView() {
  const [officers, setOfficers] = useState<Officer[]>(mockOfficers);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [sentBroadcasts, setSentBroadcasts] = useState([
    { title: "Weather Alert: Storm Warning", target: "All Field Staff", date: "Today, 02:30 PM", status: "Delivered" },
  ]);

  const filteredOfficers = officers.filter((officer) => {
    const matchesSearch =
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.ward.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === "all" || officer.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || officer.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    setSentBroadcasts([
      { title: broadcastTitle, target: "All Field Staff", date: "Just now", status: "Delivered" },
      ...sentBroadcasts,
    ]);
    setBroadcastTitle("");
    setBroadcastMsg("");
    alert("Announcement broadcasted successfully to all municipal officer devices!");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Officers</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage municipal officers and their assigned responsibilities.
          </p>
        </div>

        <Button
          onClick={() => {
            const newOfficer: Officer = {
              id: "OFF-00" + (officers.length + 1),
              name: "Priya Sharma",
              photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
              designation: "Assistant Engineer",
              department: "Sanitation",
              ward: "Ward 5 — Sector B",
              assignedTasks: 4,
              completedTasks: 18,
              phone: "+1 (555) 901-2345",
              email: "priya.s@city.gov",
              status: "Active",
              gpsCoords: "13.0830° N, 80.2710° E",
            };
            setOfficers([newOfficer, ...officers]);
            alert("New Officer Registered Successfully!");
          }}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold h-9 rounded-xl px-4 gap-1.5 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Add Officer
        </Button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Total Enrolled Officers</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{officers.length} Staff Members</div>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-200">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">On Active Duty Now</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {officers.filter(o => o.status === "Active").length} Active Officers
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-200">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Total Active Deployments</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {officers.reduce((acc, o) => acc + o.assignedTasks, 0)} Tasks
              </div>
            </div>
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="bg-slate-200/70 p-1 rounded-xl">
          <TabsTrigger value="directory" className="text-xs rounded-lg">Officer Directory</TabsTrigger>
          <TabsTrigger value="tracking" className="text-xs rounded-lg">Live Worker GPS Monitor</TabsTrigger>
          <TabsTrigger value="announcements" className="text-xs rounded-lg">Broadcast Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          {/* Search & Filter Bar */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search officers by name, department or ward..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                />
              </div>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-36 h-9 text-xs border-slate-200 bg-white rounded-xl">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">All Departments</SelectItem>
                  <SelectItem value="roads" className="text-xs">Roads</SelectItem>
                  <SelectItem value="sanitation" className="text-xs">Sanitation</SelectItem>
                  <SelectItem value="lighting" className="text-xs">Lighting</SelectItem>
                  <SelectItem value="parks" className="text-xs">Parks</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-9 text-xs border-slate-200 bg-white rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                  <SelectItem value="active" className="text-xs">Active</SelectItem>
                  <SelectItem value="on break" className="text-xs">On Break</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Officers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOfficers.map((officer) => (
              <Card key={officer.id} className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 hover:border-slate-300 transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarImage src={officer.photo} />
                      <AvatarFallback className="bg-blue-900 text-white font-bold text-xs">{officer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{officer.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{officer.designation}</p>
                    </div>
                  </div>
                  <Badge className={
                    officer.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                  }>
                    {officer.status}
                  </Badge>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Department:</span>
                    <span className="font-semibold text-slate-900">{officer.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Assigned Ward:</span>
                    <span className="font-medium text-slate-800">{officer.ward}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-medium">
                    <span>Active Workload</span>
                    <span className="font-bold text-blue-900">{officer.assignedTasks} Active Cases</span>
                  </div>
                  <Progress value={(officer.assignedTasks / 20) * 100} className="h-2 bg-slate-100" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Resolved: <strong className="text-emerald-700 font-bold">{officer.completedTasks}</strong></span>
                  <span className="font-mono text-[11px]">{officer.phone}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Live Worker GPS Monitor</h2>
              <p className="text-xs text-slate-500">Real-time GPS coordinate telemetry from active field portals</p>
            </div>

            <div className="h-80 bg-slate-950 rounded-2xl relative flex items-center justify-center border border-slate-800 p-4">
              <span className="text-xs text-slate-400 font-mono z-10 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                GPS Telemetry Stream Active (3 Workers Online)
              </span>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Radio className="h-4 w-4 text-blue-600" /> Broadcast Field Announcement
              </h2>
              <p className="text-xs text-slate-500">Send push messages to sanitation and field worker device panels</p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">Broadcast Title</Label>
                <Input
                  placeholder="E.g., Heavy Rain Warning"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="h-10 border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">Message Content</Label>
                <Textarea
                  placeholder="Type broadcast message details..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="min-h-28 border-slate-200 rounded-xl"
                  required
                />
              </div>

              <Button type="submit" className="bg-blue-900 hover:bg-blue-950 text-white font-semibold h-10 rounded-xl px-5 text-xs gap-1.5">
                <Send className="h-4 w-4" />
                Broadcast Message
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
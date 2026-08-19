import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, UserPlus, Mail, Phone, MapPin, Send, Radio, Sparkles, ShieldAlert } from "lucide-react";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface Officer {
  id: string;
  name: string;
  photo: string;
  department: string;
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
    department: "Roads",
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
    department: "Sanitation",
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
    department: "Parks",
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
    department: "Lighting",
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
    department: "Water",
    assignedTasks: 7,
    completedTasks: 35,
    phone: "+1 (555) 678-9012",
    email: "david.m@city.gov",
    status: "Active",
    gpsCoords: "13.0805° N, 80.2715° E",
    lastActive: "Active 1 min ago",
  },
  {
    id: "OFF-006",
    name: "Lisa Anderson",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    department: "Roads",
    assignedTasks: 15,
    completedTasks: 48,
    phone: "+1 (555) 789-0123",
    email: "lisa.a@city.gov",
    status: "Active",
    gpsCoords: "13.0890° N, 80.2750° E",
    lastActive: "Active 4 mins ago",
  },
];

export function OfficersView() {
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [sentBroadcasts, setSentBroadcasts] = useState([
    { title: "Weather Alert: Storm Warning", target: "All Field Workers", date: "Today, 02:30 PM", status: "Delivered" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border border-green-200";
      case "On Break":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "Offline":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getWorkloadPercentage = (assigned: number) => {
    const maxCapacity = 20;
    return (assigned / maxCapacity) * 100;
  };

  const getWorkloadColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600 font-bold";
    if (percentage >= 60) return "text-orange-600 font-semibold";
    return "text-green-600 font-medium";
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    setSentBroadcasts([
      {
        title: broadcastTitle,
        target: "All Field Workers",
        date: "Just now",
        status: "Delivered",
      },
      ...sentBroadcasts,
    ]);
    setBroadcastTitle("");
    setBroadcastMsg("");
    alert("Announcement broadcasted successfully to all worker device panels!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Field Staff & Officers Management</h1>
          <p className="text-gray-600 text-sm">
            Monitor workloads, coordinates, and send municipal announcements to active staff.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Field Officer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <p className="text-4xl mb-1 font-bold text-blue-900">{mockOfficers.length + 1}</p>
              <p className="text-sm text-gray-700 font-medium">Total Staff Enrolled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="text-center">
              <p className="text-4xl text-green-700 mb-1 font-bold">
                {mockOfficers.filter((o) => o.status === "Active").length + 1}
              </p>
              <p className="text-sm text-gray-700 font-medium">Active & GPS Tracked Now</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-violet-100">
            <div className="text-center">
              <p className="text-4xl mb-1 font-bold text-purple-900">
                {mockOfficers.reduce((acc, o) => acc + o.assignedTasks, 0) + 3}
              </p>
              <p className="text-sm text-gray-700 font-medium">Active Task Deployments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Staff Directory</TabsTrigger>
          <TabsTrigger value="tracking">Live Worker GPS Tracking</TabsTrigger>
          <TabsTrigger value="announcements">Broadcast Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gray-55 flex flex-row justify-between items-center py-4">
              <CardTitle className="text-sm">Enrolled Officers</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search officers..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockOfficers.map((officer) => {
                  const workloadPercentage = getWorkloadPercentage(
                    officer.assignedTasks
                  );
                  return (
                    <Card key={officer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={officer.photo} />
                              <AvatarFallback>
                                {officer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-800">{officer.name}</p>
                              <p className="text-xs text-gray-500">
                                {officer.department}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(officer.status)}>
                            {officer.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{officer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{officer.email}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Current Workload</span>
                            <span
                              className={getWorkloadColor(workloadPercentage)}
                            >
                              {officer.assignedTasks} tasks
                            </span>
                          </div>
                          <Progress value={workloadPercentage} className="h-2" />
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-550">
                          <div>
                            <p>Completed</p>
                            <p className="font-bold text-gray-700 text-sm mt-0.5">{officer.completedTasks}</p>
                          </div>
                          <div>
                            <p>Success Rate</p>
                            <p className="font-bold text-green-600 text-sm mt-0.5">95%</p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => alert(`Opening profiles page for ${officer.name}`)}>
                            View Profile
                          </Button>
                          <Button size="sm" className="flex-1 text-xs" onClick={() => alert(`Routing task assign dialog...`)}>
                            Assign Task
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-gray-800">Live Worker GPS Monitor</CardTitle>
                <p className="text-xs text-gray-600 mt-1">Live coordinates feed from active workers' portals</p>
              </div>
              <Badge className="bg-green-600 text-white animate-pulse">Telemetry Syncing</Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96 bg-slate-950 border border-slate-800 rounded-xl relative flex items-center justify-center p-4">
                  
                  {/* SVG City Mesh */}
                  <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#334155" strokeWidth="1.5" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#334155" strokeWidth="1.5" />
                    <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#334155" strokeWidth="1.5" />
                    <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#334155" strokeWidth="1.5" />
                    <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#334155" strokeWidth="1.5" />
                  </svg>

                  {/* Sanjay location */}
                  <div className="absolute top-[30%] left-[50%] flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow animate-ping absolute"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow relative"></span>
                    <span className="bg-slate-900 border border-slate-700 text-slate-200 text-[8px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                      Sanjay Kumar (Sanitation)
                    </span>
                  </div>

                  {/* John Smith location */}
                  <div className="absolute bottom-[30%] left-[20%] flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow relative"></span>
                    <span className="bg-slate-900 border border-slate-700 text-slate-200 text-[8px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                      John Smith (Roads)
                    </span>
                  </div>

                  {/* Emily Chen location */}
                  <div className="absolute top-[60%] right-[20%] flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 border-2 border-white shadow relative"></span>
                    <span className="bg-slate-900 border border-slate-700 text-slate-200 text-[8px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                      Emily Chen (Lighting)
                    </span>
                  </div>

                  <span className="absolute top-3 left-3 text-slate-500 text-[9px] font-mono">
                    Map Coordinate Scale: 10m mesh
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-700">GPS Status Log</p>
                  
                  <div className="bg-emerald-55 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Sanjay Kumar</span>
                      <Badge className="bg-emerald-600 text-white text-[9px]">Active</Badge>
                    </div>
                    <p className="text-[10px] text-emerald-750">Coords: 13.0827° N, 80.2707° E</p>
                    <p className="text-[9px] text-emerald-650 italic">Speed: En route, 1.2km/h</p>
                  </div>

                  {[
                    { name: "John Smith", coords: "13.0850° N, 80.2720° E", status: "Active", time: "2 mins ago" },
                    { name: "David Martinez", coords: "13.0805° N, 80.2715° E", status: "Active", time: "1 min ago" },
                    { name: "Emily Chen", coords: "13.0880° N, 80.2690° E", status: "On Break", time: "25 mins ago" },
                  ].map((log, idx) => (
                    <div key={idx} className="bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{log.name}</span>
                        <span className="text-[9px] text-gray-500">{log.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-550">Coords: {log.coords}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg border-gray-200 lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-gray-850 flex items-center gap-1.5 text-base">
                  <Radio className="h-5 w-5 text-blue-600 animate-pulse" strokeWidth={2.5} />
                  Broadcast Announcement
                </CardTitle>
                <p className="text-xs text-gray-550">Send push messages to sanitation/field worker device panels</p>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Broadcast Title</Label>
                    <Input
                      id="title"
                      placeholder="E.g., Heavy Rain Safety Warning"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message Content</Label>
                    <Textarea
                      id="message"
                      placeholder="Type announcement instructions details..."
                      className="min-h-32"
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md">
                    <Send className="h-4 w-4 mr-2" />
                    Broadcast Message to Active Devices
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xs uppercase tracking-wider text-gray-650">Broadcast Log</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {sentBroadcasts.map((br, index) => (
                  <div key={index} className="bg-slate-50 border border-gray-200 p-3 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{br.title}</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[8px]">
                        {br.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-gray-500">Target: {br.target}</p>
                    <p className="text-[9px] text-gray-400 mt-1">{br.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
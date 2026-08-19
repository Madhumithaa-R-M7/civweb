import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Award,
  Check,
  X,
  TrendingUp,
  Gift,
  Coins,
  ShieldCheck,
  Clock,
  Sparkles,
  Search,
  UserCheck,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";

interface Claim {
  id: string;
  email: string;
  reward: string;
  cost: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface WorkerClaim {
  id: string;
  worker: string;
  item: string;
  cost: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

export function RewardsView() {
  const [citizenClaims, setCitizenClaims] = useState<Claim[]>([
    { id: "CLM-891", email: "citizen@civicconnect.gov", reward: "Free Metro Ride Ticket", cost: 100, date: "Today, 10:15 AM", status: "Pending" },
    { id: "CLM-892", email: "priya.k@gmail.com", reward: "Plant a Tree in Your Name", cost: 300, date: "Today, 08:30 AM", status: "Pending" },
    { id: "CLM-893", email: "rahul.sharma@yahoo.com", reward: "Municipal Park Parking Pass", cost: 150, date: "Yesterday", status: "Approved" },
    { id: "CLM-894", email: "amit.roy@outlook.com", reward: "Eco-Friendly Water Bottle", cost: 200, date: "2 days ago", status: "Approved" }
  ]);

  const [workerClaims, setWorkerClaims] = useState<WorkerClaim[]>([
    { id: "WCF-501", worker: "Sanjay Kumar", item: "Free Lunch Coupon", cost: 150, date: "Today, 11:20 AM", status: "Pending" },
    { id: "WCF-502", worker: "Ramesh Patel", item: "Safety Gear Upgrade (Boots)", cost: 250, date: "Yesterday", status: "Pending" },
    { id: "WCF-503", worker: "Anil Singh", item: "Annual Health Checkup Voucher", cost: 300, date: "3 days ago", status: "Approved" }
  ]);

  const [searchCitizen, setSearchCitizen] = useState("");
  const [searchWorker, setSearchWorker] = useState("");

  const handleApproveCitizen = (id: string) => {
    setCitizenClaims(prev => prev.map(c => c.id === id ? { ...c, status: "Approved" } : c));
    alert(`Claim ${id} Approved! Redemption voucher sent to user.`);
  };

  const borderClass = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700 border-green-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const handleRejectCitizen = (id: string) => {
    setCitizenClaims(prev => prev.map(c => c.id === id ? { ...c, status: "Rejected" } : c));
    alert(`Claim ${id} Rejected.`);
  };

  const handleApproveWorker = (id: string) => {
    setWorkerClaims(prev => prev.map(w => w.id === id ? { ...w, status: "Approved" } : w));
    alert(`Worker Welfare Benefit ${id} Approved! Benefit voucher dispatched to worker device.`);
  };

  const handleRejectWorker = (id: string) => {
    setWorkerClaims(prev => prev.map(w => w.id === id ? { ...w, status: "Rejected" } : w));
    alert(`Worker Welfare Benefit ${id} Rejected.`);
  };

  // KPI Stats metrics
  const pendingCitizenCount = citizenClaims.filter(c => c.status === "Pending").length;
  const pendingWorkerCount = workerClaims.filter(w => w.status === "Pending").length;
  const totalPointsRedeemed = [...citizenClaims, ...workerClaims]
    .filter(c => c.status === "Approved")
    .reduce((acc, c) => acc + c.cost, 0);

  // Leaderboard data
  const citizenLeaderboard = [
    { name: "Priya Krishnan", points: 840, reports: 12, badge: "Eco Warrior Elite", color: "from-emerald-500 to-green-600" },
    { name: "Rahul Sharma", points: 670, reports: 9, badge: "Civic Champion", color: "from-blue-500 to-indigo-600" },
    { name: "Amit Roy", points: 550, reports: 8, badge: "Community Star", color: "from-amber-500 to-orange-600" },
    { name: "Neha Patil", points: 490, reports: 7, badge: "Local Guardian", color: "from-purple-500 to-pink-600" },
    { name: "John Doe (You)", points: 250, reports: 2, badge: "Green Scout", color: "from-teal-500 to-emerald-600" }
  ];

  const workerLeaderboard = [
    { name: "Sanjay Kumar", points: 650, completed: 18, rating: "4.9/5", badge: "Super Worker", color: "from-green-500 to-emerald-600" },
    { name: "Lisa Anderson", points: 580, completed: 15, rating: "4.8/5", badge: "Efficiency Hero", color: "from-blue-500 to-cyan-600" },
    { name: "Sarah Johnson", points: 520, completed: 14, rating: "4.7/5", badge: "Sanitation Star", color: "from-orange-500 to-amber-600" },
    { name: "David Martinez", points: 490, completed: 13, rating: "4.6/5", badge: "Water Expert", color: "from-indigo-500 to-purple-600" }
  ];

  // Analytics mock data
  const pointsTrend = [
    { week: "Week 1", issued: 1200, redeemed: 800 },
    { week: "Week 2", issued: 1800, redeemed: 1100 },
    { week: "Week 3", issued: 1500, redeemed: 1300 },
    { week: "Week 4", issued: 2200, redeemed: 1600 },
    { week: "Week 5", issued: 2900, redeemed: 2100 },
    { week: "Week 6", issued: 3400, redeemed: 2600 }
  ];

  const popularItems = [
    { name: "Metro Ticket", count: 184, fill: "#3b82f6" },
    { name: "Tree Planting", count: 125, fill: "#10b981" },
    { name: "Parking Pass", count: 96, fill: "#f59e0b" },
    { name: "Water Bottle", count: 72, fill: "#ec4899" },
    { name: "Lunch Coupon", count: 64, fill: "#8b5cf6" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1 flex items-center gap-2 font-bold text-gray-900">
            <Award className="h-6 w-6 text-blue-600 animate-pulse" />
            Civic Rewards & Worker Welfare Hub
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Approve green voucher redemptions, manage worker benefits, and view community engagement scorecards.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 flex items-start justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Eco-Points Redeemed</p>
              <p className="text-3xl font-bold text-blue-900">{totalPointsRedeemed} pts</p>
              <span className="text-[10px] text-blue-700 bg-blue-200/50 px-2 py-0.5 rounded font-bold mt-2 inline-block">
                All-time active users
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md text-white relative z-10">
              <Coins className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 flex items-start justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Pending Citizen Claims</p>
              <p className="text-3xl font-bold text-amber-900">{pendingCitizenCount}</p>
              <span className="text-[10px] text-amber-700 bg-amber-200/50 px-2 py-0.5 rounded font-bold mt-2 inline-block">
                Requires review
              </span>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-md text-white relative z-10">
              <Gift className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 flex items-start justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Worker Benefits Pending</p>
              <p className="text-3xl font-bold text-purple-900">{pendingWorkerCount}</p>
              <span className="text-[10px] text-purple-700 bg-purple-200/50 px-2 py-0.5 rounded font-bold mt-2 inline-block">
                Welfare dispatch
              </span>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md text-white relative z-10">
              <UserCheck className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-start justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Top Contributor Rank</p>
              <p className="text-lg font-bold text-emerald-950 truncate max-w-[150px]">Priya Krishnan</p>
              <span className="text-[10px] text-emerald-700 bg-emerald-200/50 px-2 py-0.5 rounded font-bold mt-2 inline-block">
                840 pts • 12 Reports
              </span>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-md text-white relative z-10">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="citizen" className="space-y-6">
        <TabsList className="bg-gray-150 p-1 rounded-xl flex gap-1 border border-gray-200/40 w-max shadow-inner">
          <TabsTrigger value="citizen" className="rounded-lg text-xs font-semibold px-4 py-2">Citizen Redemptions</TabsTrigger>
          <TabsTrigger value="worker" className="rounded-lg text-xs font-semibold px-4 py-2">Worker Benefits</TabsTrigger>
          <TabsTrigger value="leaderboards" className="rounded-lg text-xs font-semibold px-4 py-2">Leaderboards</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg text-xs font-semibold px-4 py-2">Analytics & Trends</TabsTrigger>
        </TabsList>

        {/* Citizen Redemptions Tab */}
        <TabsContent value="citizen" className="space-y-4">
          <Card className="shadow-lg border-gray-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex flex-col md:flex-row md:items-center justify-between py-4 space-y-2 md:space-y-0">
              <div>
                <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <Gift className="h-4.5 w-4.5 text-blue-600" />
                  Citizen Eco-Voucher Redemptions
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">Review and approve public incentives requested by green citizens.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email..."
                  className="pl-9 h-9 text-xs border-gray-300"
                  value={searchCitizen}
                  onChange={e => setSearchCitizen(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/70 border-b">
                    <TableHead className="text-xs">Claim ID</TableHead>
                    <TableHead className="text-xs">Citizen Email</TableHead>
                    <TableHead className="text-xs">Reward Voucher</TableHead>
                    <TableHead className="text-xs">Point Cost</TableHead>
                    <TableHead className="text-xs">Requested On</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citizenClaims
                    .filter(c => c.email.toLowerCase().includes(searchCitizen.toLowerCase()))
                    .map(claim => (
                      <TableRow key={claim.id} className="hover:bg-gray-50/30 border-b">
                        <TableCell className="font-mono text-xs font-semibold">{claim.id}</TableCell>
                        <TableCell className="font-medium text-gray-700 text-xs">{claim.email}</TableCell>
                        <TableCell>
                          <span className="bg-blue-50 text-blue-800 border border-blue-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            {claim.reward}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-xs text-blue-900">{claim.cost} pts</TableCell>
                        <TableCell className="text-gray-500 text-xs">{claim.date}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] font-bold border ${borderClass(claim.status)}`}>
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {claim.status === "Pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                onClick={() => handleApproveCitizen(claim.id)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                onClick={() => handleRejectCitizen(claim.id)}
                              >
                                <X className="h-3.5 w-3.5 mr-1" />
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic font-medium">Reviewed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Worker Welfare Benefits Tab */}
        <TabsContent value="worker" className="space-y-4">
          <Card className="shadow-lg border-gray-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b flex flex-col md:flex-row md:items-center justify-between py-4 space-y-2 md:space-y-0">
              <div>
                <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <UserCheck className="h-4.5 w-4.5 text-purple-600" />
                  Field Force Welfare Benefit Logs
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">Approve medical/lunch benefits and equipment bonuses claimed by workers.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by worker name..."
                  className="pl-9 h-9 text-xs border-gray-300"
                  value={searchWorker}
                  onChange={e => setSearchWorker(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/70 border-b">
                    <TableHead className="text-xs">Benefit ID</TableHead>
                    <TableHead className="text-xs">Field Worker</TableHead>
                    <TableHead className="text-xs">Benefit Item</TableHead>
                    <TableHead className="text-xs">Points Spent</TableHead>
                    <TableHead className="text-xs">Claimed Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workerClaims
                    .filter(w => w.worker.toLowerCase().includes(searchWorker.toLowerCase()))
                    .map(claim => (
                      <TableRow key={claim.id} className="hover:bg-gray-50/30 border-b">
                        <TableCell className="font-mono text-xs font-semibold">{claim.id}</TableCell>
                        <TableCell className="font-medium text-gray-700 text-xs">{claim.worker}</TableCell>
                        <TableCell>
                          <span className="bg-purple-50 text-purple-800 border border-purple-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            {claim.item}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-xs text-purple-900">{claim.cost} pts</TableCell>
                        <TableCell className="text-gray-500 text-xs">{claim.date}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] font-bold border ${borderClass(claim.status)}`}>
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {claim.status === "Pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                onClick={() => handleApproveWorker(claim.id)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                onClick={() => handleRejectWorker(claim.id)}
                              >
                                <X className="h-3.5 w-3.5 mr-1" />
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic font-medium">Approved</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboards Tab */}
        <TabsContent value="leaderboards" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Citizen Leaderboard */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b py-4">
              <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-emerald-600 animate-bounce" />
                Citizen Eco-Leaderboard
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">Active citizens driving community improvements and saving city scores.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3.5">
                {citizenLeaderboard.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-gray-150 rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${user.color} flex items-center justify-center text-white font-extrabold text-xs shadow`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">{user.name}</h4>
                        <p className="text-[9px] text-emerald-700 font-extrabold bg-emerald-100 border border-emerald-200/50 px-1.5 py-0.5 rounded w-max mt-1">
                          {user.badge}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-xs text-slate-900">{user.points} pts</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">{user.reports} reports submitted</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Worker Leaderboard */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b py-4">
              <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <UserCheck className="h-4.5 w-4.5 text-indigo-600" />
                Field Force Performance Board
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">Outstanding field workers with highest verified task completion ratings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3.5">
                {workerLeaderboard.map((worker, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-gray-150 rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${worker.color} flex items-center justify-center text-white font-extrabold text-xs shadow`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">{worker.name}</h4>
                        <p className="text-[9px] text-indigo-700 font-extrabold bg-indigo-100 border border-indigo-200/50 px-1.5 py-0.5 rounded w-max mt-1">
                          {worker.badge}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-xs text-slate-900">{worker.points} pts</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">{worker.completed} tasks • Rating: {worker.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg border-gray-200 lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-sm font-bold text-gray-800">Point Allocation Trends</CardTitle>
              <CardDescription className="text-xs text-gray-500">Weekly comparison of points issued for reporting vs redeemed for vouchers.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pointsTrend}>
                  <defs>
                    <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRedeemed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="issued" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIssued)" strokeWidth={2.5} name="Points Issued" />
                  <Area type="monotone" dataKey="redeemed" stroke="#10b981" fillOpacity={1} fill="url(#colorRedeemed)" strokeWidth={2.5} name="Points Redeemed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-sm font-bold text-gray-800">Top Redeemed Items</CardTitle>
              <CardDescription className="text-xs text-gray-500">Cumulative count of vouchers claimed by citizens and workers.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={80} className="text-xs font-semibold" />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {popularItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

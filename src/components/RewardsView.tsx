import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Award,
  Check,
  X,
  Gift,
  Coins,
  ShieldCheck,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Input } from "./ui/input";

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
    { id: "WCF-502", worker: "Ramesh Patel", item: "Safety Boots Upgrade", cost: 250, date: "Yesterday", status: "Pending" },
    { id: "WCF-503", worker: "Anil Singh", item: "Annual Health Checkup Voucher", cost: 300, date: "3 days ago", status: "Approved" }
  ]);

  const [searchCitizen, setSearchCitizen] = useState("");
  const [searchWorker, setSearchWorker] = useState("");

  const handleApproveCitizen = (id: string) => {
    setCitizenClaims(prev => prev.map(c => c.id === id ? { ...c, status: "Approved" } : c));
    alert(`Voucher Claim ${id} Approved!`);
  };

  const handleRejectCitizen = (id: string) => {
    setCitizenClaims(prev => prev.map(c => c.id === id ? { ...c, status: "Rejected" } : c));
    alert(`Voucher Claim ${id} Rejected.`);
  };

  const handleApproveWorker = (id: string) => {
    setWorkerClaims(prev => prev.map(w => w.id === id ? { ...w, status: "Approved" } : w));
    alert(`Worker Benefit ${id} Approved!`);
  };

  const handleRejectWorker = (id: string) => {
    setWorkerClaims(prev => prev.map(w => w.id === id ? { ...w, status: "Rejected" } : w));
    alert(`Worker Benefit ${id} Rejected.`);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rewards & Welfare Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review citizen reward voucher redemptions and field worker welfare claims.
        </p>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Pending Redemptions</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {citizenClaims.filter(c => c.status === "Pending").length + workerClaims.filter(w => w.status === "Pending").length} Claims
              </div>
            </div>
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-200">
              <Gift className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Total Points Redeemed</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">1,450 Points</div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-200">
              <Coins className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Approved Vouchers</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">128 Vouchers</div>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-200">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="citizen" className="space-y-6">
        <TabsList className="bg-slate-200/70 p-1 rounded-xl">
          <TabsTrigger value="citizen" className="text-xs rounded-lg">Citizen Redemptions</TabsTrigger>
          <TabsTrigger value="worker" className="text-xs rounded-lg">Worker Welfare Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="citizen" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden p-4 space-y-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search citizen claims..."
                value={searchCitizen}
                onChange={e => setSearchCitizen(e.target.value)}
                className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
              />
            </div>

            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Claim ID</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Citizen Email</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Reward Title</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Points</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs">
                {citizenClaims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono font-bold text-blue-900 py-3.5">{claim.id}</TableCell>
                    <TableCell className="text-slate-700 py-3.5 font-medium">{claim.email}</TableCell>
                    <TableCell className="font-semibold text-slate-900 py-3.5">{claim.reward}</TableCell>
                    <TableCell className="text-emerald-700 font-bold py-3.5">{claim.cost} PTS</TableCell>
                    <TableCell className="py-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        claim.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        claim.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {claim.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      {claim.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" onClick={() => handleApproveCitizen(claim.id)} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                            <Check className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectCitizen(claim.id)} className="h-7 text-xs border-slate-200 text-red-600 hover:bg-red-50 rounded-lg">
                            <X className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="worker" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden p-4 space-y-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search worker welfare claims..."
                value={searchWorker}
                onChange={e => setSearchWorker(e.target.value)}
                className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
              />
            </div>

            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Claim ID</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Worker Name</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Welfare Benefit</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Cost</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 py-3.5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs">
                {workerClaims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono font-bold text-blue-900 py-3.5">{claim.id}</TableCell>
                    <TableCell className="font-semibold text-slate-900 py-3.5">{claim.worker}</TableCell>
                    <TableCell className="text-slate-800 py-3.5">{claim.item}</TableCell>
                    <TableCell className="text-emerald-700 font-bold py-3.5">{claim.cost} PTS</TableCell>
                    <TableCell className="py-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        claim.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        claim.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {claim.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      {claim.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" onClick={() => handleApproveWorker(claim.id)} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                            <Check className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectWorker(claim.id)} className="h-7 text-xs border-slate-200 text-red-600 hover:bg-red-50 rounded-lg">
                            <X className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

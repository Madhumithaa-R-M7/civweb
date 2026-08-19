import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle2, Clock, FileText, Trash2, Sparkles, Map, Flame, Download, ArrowUpRight, Brain } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DashboardViewProps {
  onFilterIssues?: (filter: string) => void;
}

const kpiCards = [
  {
    title: "Total Reports",
    value: "1,247",
    change: "+12% from previous period",
    icon: FileText,
    iconBg: "bg-blue-50 text-blue-600 border border-blue-200",
    filter: "all",
  },
  {
    title: "Resolved Issues",
    value: "1,089",
    change: "87.3% resolution rate",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    filter: "resolved",
  },
  {
    title: "Pending Issues",
    value: "158",
    change: "14 critical priority",
    icon: AlertCircle,
    iconBg: "bg-amber-50 text-amber-600 border border-amber-200",
    filter: "pending",
  },
  {
    title: "IoT Smart Dustbins",
    value: "2,489",
    change: "94.2% online",
    icon: Trash2,
    iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-200",
    filter: "all",
  },
];

const departmentData = [
  { name: "Roads", issues: 324 },
  { name: "Sanitation", issues: 256 },
  { name: "Lighting", issues: 189 },
  { name: "Water & Sewage", issues: 178 },
  { name: "Parks", issues: 145 },
  { name: "Other", issues: 155 },
];

const priorityData = [
  { name: "High", value: 287, color: "#ef4444" },
  { name: "Medium", value: 542, color: "#f59e0b" },
  { name: "Low", value: 418, color: "#10b981" },
];

const trendData = [
  { week: "Week 1", resolved: 145, reported: 162 },
  { week: "Week 2", resolved: 172, reported: 168 },
  { week: "Week 3", resolved: 168, reported: 185 },
  { week: "Week 4", resolved: 191, reported: 179 },
  { week: "Week 5", resolved: 185, reported: 198 },
  { week: "Week 6", resolved: 228, reported: 203 },
];

const iotDustbins = [
  { id: "IoT-DB-104", location: "Bus Terminal Depot", level: 94, temp: "35°C", battery: "85%", status: "CRITICAL" },
  { id: "IoT-DB-108", location: "Central Railway Gate 2", level: 88, temp: "32°C", battery: "92%", status: "WARNING" },
  { id: "IoT-DB-112", location: "Anna Salai Junction", level: 42, temp: "30°C", battery: "98%", status: "NORMAL" },
  { id: "IoT-DB-115", location: "Marina Beach Promenade", level: 25, temp: "29°C", battery: "90%", status: "NORMAL" },
];

export function DashboardView({ onFilterIssues }: DashboardViewProps) {
  const [mapMode, setMapMode] = useState<"standard" | "heatmap">("standard");

  const simulatedPredictions = [
    { area: "Zone B — Northside Plaza", type: "Waste Overflow Risk", probability: "94%", reason: "Weekend Market & IoT bin at 88%", confidence: "High" },
    { area: "Zone C — Eastside Link", type: "Drain Clogging Risk", probability: "88%", reason: "Forecasted Heavy Rains & blockages", confidence: "High" },
    { area: "Zone A — Downtown Central", type: "Road Surface Wear", probability: "62%", reason: "Pothole density increases", confidence: "Medium" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor civic issues, field operations, citizen reports and smart-city infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-40 h-9 text-xs border-slate-200 bg-white rounded-xl">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7days" className="text-xs">Last 7 days</SelectItem>
              <SelectItem value="30days" className="text-xs">Last 30 days</SelectItem>
              <SelectItem value="90days" className="text-xs">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Exporting Municipal Operations Summary...")}
            className="h-9 text-xs border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl gap-1.5 font-medium"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Section - 4 Equal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 hover:border-slate-300 transition-colors cursor-pointer"
              onClick={() => onFilterIssues?.(kpi.filter)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                    {kpi.title}
                  </span>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">{kpi.change}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ROW 1: Issue Trends & Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large: Issue Trends */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Issue Trends — Reported vs Resolved</h2>
              <p className="text-xs text-slate-500">Weekly volume comparison of incoming citizen reports and field resolutions</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="reported" name="Reported Issues" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved Issues" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Small: Priority Distribution */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Priority Distribution</h2>
            <p className="text-xs text-slate-500">Active cases classified by urgency</p>
          </div>
          <div className="h-56 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-xs pt-2 border-t border-slate-100">
            {priorityData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ROW 2: Issues by Department & AI Risk Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large: Issues by Department */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Issues by Department</h2>
              <p className="text-xs text-slate-500">Workload distribution across municipal service divisions</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Bar dataKey="issues" name="Total Cases" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Small: AI Risk Predictions */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" /> AI Risk Predictions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Machine learning predictive analytics</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {simulatedPredictions.map((pred, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{pred.area}</span>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-2 py-0.5">
                    {pred.confidence} Confidence
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>{pred.type}</span>
                  <span className="font-bold text-red-600">{pred.probability} Risk</span>
                </div>
                <p className="text-[11px] text-slate-500 italic">{pred.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ROW 3: City Issue Map & IoT Dustbins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large: City Issue Map */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">City Issue Map</h2>
              <p className="text-xs text-slate-500">Spatial distribution and severity of reported cases</p>
            </div>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setMapMode("standard")}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  mapMode === "standard" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setMapMode("heatmap")}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  mapMode === "heatmap" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Heatmap
              </button>
            </div>
          </div>

          {/* Map View Box */}
          <div className="h-64 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Simulated map background grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Map markers */}
            <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-[10px] text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1 font-mono">High Severity</span>
            </div>
            <div className="absolute top-1/2 left-2/3 flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500"></span>
              <span className="text-[10px] text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1 font-mono">Medium</span>
            </div>
            <div className="absolute bottom-1/4 left-1/2 flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1 font-mono">Low</span>
            </div>

            <span className="text-xs text-slate-400 font-mono z-10 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              Interactive GIS Map Simulator ({mapMode.toUpperCase()} VIEW ACTIVE)
            </span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 justify-end pt-1">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500"></span> High (Red)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Medium (Amber)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Low (Green)</span>
          </div>
        </Card>

        {/* Small: IoT Smart Dustbin Status */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">IoT Smart Dustbin Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time fill level sensors</p>
            </div>
            <Trash2 className="h-4 w-4 text-indigo-600" />
          </div>

          <div className="space-y-3 text-xs">
            {iotDustbins.map((bin) => (
              <div key={bin.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{bin.id}</span>
                  <Badge className={
                    bin.status === "CRITICAL" ? "bg-red-50 text-red-700 border-red-200" :
                    bin.status === "WARNING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }>
                    {bin.status}
                  </Badge>
                </div>
                <p className="text-slate-600 text-[11px]">{bin.location}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Fill Level</span>
                    <span className="font-bold text-slate-800">{bin.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        bin.level >= 90 ? "bg-red-500" : bin.level >= 75 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${bin.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
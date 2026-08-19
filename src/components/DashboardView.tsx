import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle2, Clock, FileText, Trash2, Sparkles, Map, Flame, Download, UserCheck } from "lucide-react";
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

const kpiData = [
  {
    title: "Total Reports",
    value: "1,247",
    change: "+12%",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    filter: "all",
  },
  {
    title: "Resolved Issues",
    value: "892",
    change: "+8%",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    iconBg: "bg-gradient-to-br from-green-500 to-green-600",
    filter: "resolved",
  },
  {
    title: "Pending Issues",
    value: "156",
    change: "-5%",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    iconBg: "bg-gradient-to-br from-red-500 to-red-600",
    filter: "pending",
  },
  {
    title: "IoT Smart Dustbins",
    value: "4 Active",
    change: "2 Critical (>90%)",
    icon: Trash2,
    color: "text-indigo-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    filter: "all",
  },
];

const departmentData = [
  { name: "Roads", issues: 324 },
  { name: "Sanitation", issues: 256 },
  { name: "Lighting", issues: 189 },
  { name: "Parks", issues: 145 },
  { name: "Water", issues: 178 },
  { name: "Other", issues: 155 },
];

const priorityData = [
  { name: "High", value: 287, color: "#ef4444" },
  { name: "Medium", value: 542, color: "#f97316" },
  { name: "Low", value: 418, color: "#22c55e" },
];

const trendData = [
  { week: "Week 1", resolved: 45, reported: 52 },
  { week: "Week 2", resolved: 52, reported: 48 },
  { week: "Week 3", resolved: 48, reported: 55 },
  { week: "Week 4", resolved: 61, reported: 49 },
  { week: "Week 5", resolved: 55, reported: 58 },
  { week: "Week 6", resolved: 67, reported: 53 },
];

export function DashboardView({ onFilterIssues }: DashboardViewProps) {
  const [mapMode, setMapMode] = useState<"standard" | "heatmap">("standard");

  const simulatedPredictions = [
    { area: "Zone B (Northside Plaza)", type: "Waste Overflow Risk", probability: "94%", reason: "Weekend Market & IoT bin at 88%", confidence: "High" },
    { area: "Zone C (Eastside Link)", type: "Drain Clogging Risk", probability: "88%", reason: "Forecasted Heavy Rains & blockages", confidence: "High" },
    { area: "Zone A (Downtown Central)", type: "Road Surface Wear", probability: "62%", reason: "Pothole density increases", confidence: "Medium" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Dashboard Overview</h1>
          <p className="text-gray-600 text-sm">
            Welcome back! Here's what's happening in your city today.
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => alert("Generating Excel & PDF Municipal Report. Download starting...")}>
            <Download className="h-4 w-4 mr-1.5" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
              onClick={() => onFilterIssues?.(kpi.filter)}
            >
              <CardContent className={`p-6 ${kpi.bgColor} relative overflow-hidden`}>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
                    <p className="text-3xl mb-2 font-bold">{kpi.value}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        kpi.title.includes("IoT") ? "bg-indigo-100 text-indigo-700" : "bg-green-100 text-green-700"
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${kpi.iconBg} p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Map Module: Standard vs AI Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg border-gray-200 lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-gray-850">Issue Locations & Live Tracking</CardTitle>
              <p className="text-xs text-gray-600 mt-1">Real-time status of reported cases across sectors</p>
            </div>
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMapMode("standard")}
                className={`px-3 py-1 text-xs rounded-md transition-all font-semibold flex items-center gap-1 ${
                  mapMode === "standard" ? "bg-white text-blue-900 shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Map className="h-3.5 w-3.5" />
                Live Map
              </button>
              <button
                onClick={() => setMapMode("heatmap")}
                className={`px-3 py-1 text-xs rounded-md transition-all font-semibold flex items-center gap-1 ${
                  mapMode === "heatmap" ? "bg-white text-red-900 shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Flame className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                AI Heatmap
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
              
              {/* SVG Styled Map Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                {/* Streets Grid */}
                <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#475569" strokeWidth="2" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#475569" strokeWidth="1" />
                <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#475569" strokeWidth="3" />

                <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#475569" strokeWidth="2" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#475569" strokeWidth="1" strokeDasharray="5 5" />
                <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#475569" strokeWidth="3" />
              </svg>

              {/* standard map overlay tags */}
              {mapMode === "standard" && (
                <>
                  {/* Issue marker 1 */}
                  <div className="absolute top-1/4 left-1/3 bg-red-600/90 text-white text-[9px] px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-red-400 animate-bounce">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>Pothole (ISS-1247)</span>
                  </div>
                  {/* Issue marker 2 */}
                  <div className="absolute bottom-1/3 right-1/4 bg-orange-600/90 text-white text-[9px] px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-orange-400">
                    <span>IoT Dustbin (94% Full)</span>
                  </div>
                  {/* Worker tag */}
                  <div className="absolute bottom-1/4 left-1/2 bg-green-600 text-white text-[9px] px-2 py-1 rounded shadow-lg flex items-center gap-1 border border-green-400">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Sanjay Kumar (Active)</span>
                  </div>
                </>
              )}

              {/* Heatmap overlay radial circles */}
              {mapMode === "heatmap" && (
                <>
                  {/* Hotspots */}
                  <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-radial from-red-600/60 via-red-600/20 to-transparent rounded-full animate-pulse"></div>
                  <div className="absolute bottom-[30%] right-[25%] w-24 h-24 bg-radial from-orange-600/60 via-orange-600/20 to-transparent rounded-full animate-pulse"></div>
                  <div className="absolute top-[60%] left-[70%] w-16 h-16 bg-radial from-red-600/50 via-red-600/10 to-transparent rounded-full"></div>
                  
                  <div className="absolute bottom-6 left-6 bg-slate-900/90 p-2.5 rounded border border-slate-700 text-[10px] text-slate-300">
                    <span className="font-bold text-red-400 block mb-1">AI Hotspot Analysis:</span>
                    Red zone: Sector 3 / Park crossing has a high recurrence of garbage complaints.
                  </div>
                </>
              )}

              <span className="text-xs text-slate-500 font-mono absolute top-3 left-3 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                Grid System: Zone A - E
              </span>
            </div>
          </CardContent>
        </Card>

        {/* AI-Based Issue Prediction Panel */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b py-4">
            <CardTitle className="text-gray-850 flex items-center gap-1.5 text-base">
              <Sparkles className="h-4.5 w-4.5 text-purple-600" />
              AI Issue Predictions
            </CardTitle>
            <p className="text-xs text-gray-500">Predicted hotspots for the next 48 hours</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {simulatedPredictions.map((pred, idx) => (
              <div key={idx} className="bg-slate-50 border border-gray-200 rounded-xl p-3.5 space-y-2 hover:shadow transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-gray-800">{pred.type}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{pred.area}</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 font-bold border-purple-200">
                    {pred.probability}
                  </Badge>
                </div>
                <p className="text-[10px] text-gray-600 italic">
                  "Reason: {pred.reason}"
                </p>
                <div className="flex justify-between items-center pt-1 border-t border-gray-150">
                  <span className="text-[9px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-semibold">
                    Confidence: {pred.confidence}
                  </span>
                  <Button
                    onClick={() => alert(`Assigned predictive dispatch alert for ${pred.type} to Sector Officers.`)}
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[9px] text-indigo-600 hover:text-indigo-700 p-0"
                  >
                    Pre-allocate worker →
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-gray-800">Issues by Department</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issues" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-gray-800">Issues by Priority</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
          <CardTitle className="text-gray-800">Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="reported"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Reported"
                dot={{ fill: "#3b82f6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#22c55e"
                strokeWidth={3}
                name="Resolved"
                dot={{ fill: "#22c55e", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
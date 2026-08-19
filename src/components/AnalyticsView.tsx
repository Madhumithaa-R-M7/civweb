import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Download, TrendingUp, TrendingDown, Activity, Award, CheckCircle2 } from "lucide-react";

const resolutionRateData = [
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 85 },
  { month: "Mar", rate: 88 },
  { month: "Apr", rate: 84 },
  { month: "May", rate: 90 },
  { month: "Jun", rate: 87 },
  { month: "Jul", rate: 92 },
  { month: "Aug", rate: 89 },
  { month: "Sep", rate: 91 },
  { month: "Oct", rate: 93 },
];

const departmentPerformanceData = [
  { department: "Roads", efficiency: 88, responseTime: 92, satisfaction: 85 },
  { department: "Sanitation", efficiency: 92, responseTime: 88, satisfaction: 90 },
  { department: "Lighting", efficiency: 85, responseTime: 90, satisfaction: 87 },
  { department: "Parks", efficiency: 90, responseTime: 85, satisfaction: 92 },
  { department: "Water", efficiency: 87, responseTime: 89, satisfaction: 88 },
];

const satisfactionData = [
  { week: "Week 1", rating: 4.2 },
  { week: "Week 2", rating: 4.3 },
  { week: "Week 3", rating: 4.1 },
  { week: "Week 4", rating: 4.5 },
  { week: "Week 5", rating: 4.4 },
  { week: "Week 6", rating: 4.6 },
];

const categoryDistribution = [
  { category: "Potholes", count: 324, change: "+12%" },
  { category: "Street Lights", count: 256, change: "-5%" },
  { category: "Garbage", count: 198, change: "+8%" },
  { category: "Water Leaks", count: 167, change: "+3%" },
  { category: "Parks", count: 145, change: "-2%" },
  { category: "Others", count: 157, change: "+7%" },
];

export function AnalyticsView() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive insights and performance metrics across municipal operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40 h-9 text-xs border-slate-200 bg-white rounded-xl">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7days" className="text-xs">Last 7 days</SelectItem>
              <SelectItem value="30days" className="text-xs">Last 30 days</SelectItem>
              <SelectItem value="90days" className="text-xs">Last 90 days</SelectItem>
              <SelectItem value="12months" className="text-xs">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Downloading Municipal Executive Report...")}
            className="h-9 text-xs border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl gap-1.5 font-medium"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Avg Resolution Rate</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">93.0%</div>
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +2.4% vs last month
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Avg Response Time</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">2.4 Hours</div>
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-600" /> -18 mins faster
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Citizen CSAT Rating</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">4.6 / 5.0</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Based on 1,420 ratings</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Active Field Crews</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">86 Teams</div>
              <p className="text-xs text-emerald-600 mt-1 font-medium">100% Shift Coverage</p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Row 1 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Rate Trend */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Resolution Rate Over Time</h2>
            <p className="text-xs text-slate-500">Monthly percentage of cases resolved within SLA</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resolutionRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Area type="monotone" dataKey="rate" name="Resolution Rate (%)" stroke="#10b981" fill="#ecfdf5" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Performance */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Department Performance Comparison</h2>
            <p className="text-xs text-slate-500">Efficiency and customer satisfaction scores by division</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="efficiency" name="Efficiency (%)" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="satisfaction" name="Satisfaction Score (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
}
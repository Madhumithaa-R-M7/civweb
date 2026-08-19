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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from "recharts";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

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
  {
    department: "Sanitation",
    efficiency: 92,
    responseTime: 88,
    satisfaction: 90,
  },
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Analytics & Reports</h1>
          <p className="text-gray-600 text-sm">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100">
            <p className="text-sm text-gray-700 mb-1">Avg Resolution Time</p>
            <p className="text-3xl mb-2">2.3 days</p>
            <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full w-fit">
              <TrendingDown className="h-4 w-4" />
              <span>-0.5 days from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-green-50 to-emerald-100">
            <p className="text-sm text-gray-700 mb-1">Resolution Rate</p>
            <p className="text-3xl mb-2">93%</p>
            <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full w-fit">
              <TrendingUp className="h-4 w-4" />
              <span>+5% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-violet-100">
            <p className="text-sm text-gray-700 mb-1">Citizen Satisfaction</p>
            <p className="text-3xl mb-2">4.6/5.0</p>
            <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full w-fit">
              <TrendingUp className="h-4 w-4" />
              <span>+0.3 from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-orange-50 to-amber-100">
            <p className="text-sm text-gray-700 mb-1">Active Officers</p>
            <p className="text-3xl mb-2">28/32</p>
            <div className="flex items-center gap-1 text-gray-700 text-sm">
              <span>87.5% capacity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issue Resolution Rate (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={resolutionRateData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citizen Satisfaction Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={departmentPerformanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="department" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Efficiency"
                dataKey="efficiency"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Radar
                name="Response Time"
                dataKey="responseTime"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.5}
              />
              <Radar
                name="Satisfaction"
                dataKey="satisfaction"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.5}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issue Categories Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryDistribution.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm ${
                        item.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.change}
                    </span>
                    <span className="text-sm font-medium w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(item.count / 324) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
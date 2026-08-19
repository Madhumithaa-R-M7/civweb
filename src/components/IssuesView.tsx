import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  Eye,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

const mockIssues: Issue[] = [
  {
    id: "ISS-1247",
    photo: "https://images.unsplash.com/photo-1709934730506-fba12664d4e4?w=100&h=100&fit=crop",
    category: "Pothole Repair",
    location: "Main Street & 5th Ave",
    priority: "High",
    department: "Roads",
    status: "In Progress",
    officer: "John Smith",
    date: "2026-08-18",
  },
  {
    id: "ISS-1246",
    photo: "https://images.unsplash.com/photo-1685992830281-2eef1f9bd3e8?w=100&h=100&fit=crop",
    category: "Street Light Fix",
    location: "Park Avenue Block 3",
    priority: "Medium",
    department: "Lighting",
    status: "Pending",
    officer: "Unassigned",
    date: "2026-08-17",
  },
  {
    id: "ISS-1245",
    photo: "https://images.unsplash.com/photo-1574676039880-73da8368f0eb?w=100&h=100&fit=crop",
    category: "Garbage Collection",
    location: "Downtown Plaza",
    priority: "High",
    department: "Sanitation",
    status: "In Progress",
    officer: "Sarah Johnson",
    date: "2026-08-17",
  },
  {
    id: "ISS-1244",
    photo: "https://images.unsplash.com/photo-1760305024913-47f4f40aa806?w=100&h=100&fit=crop",
    category: "Park Maintenance",
    location: "Central Park Gate A",
    priority: "Low",
    department: "Parks",
    status: "Resolved",
    officer: "Mike Davis",
    date: "2026-08-16",
  },
  {
    id: "ISS-1243",
    photo: "https://images.unsplash.com/photo-1709934730506-fba12664d4e4?w=100&h=100&fit=crop",
    category: "Road Damage",
    location: "Highway 101 North",
    priority: "High",
    department: "Roads",
    status: "In Progress",
    officer: "John Smith",
    date: "2026-08-16",
  },
];

interface IssuesViewProps {
  onViewIssue: (issue: Issue) => void;
  activeFilter?: string;
}

export function IssuesView({ onViewIssue, activeFilter }: IssuesViewProps) {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(activeFilter || "all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  useEffect(() => {
    if (activeFilter) {
      setStatusFilter(activeFilter);
    }
  }, [activeFilter]);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      issue.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "all" ||
      issue.priority.toLowerCase() === priorityFilter.toLowerCase();

    const matchesDepartment =
      departmentFilter === "all" ||
      issue.department.toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Issues Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, assign and resolve citizen-reported civic issues.
          </p>
        </div>

        <Button
          onClick={() => {
            const newId = "ISS-" + Math.floor(Math.random() * 900 + 1250);
            const createdIssue: Issue = {
              id: newId,
              photo: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=100&h=100&fit=crop",
              category: "General Maintenance",
              location: "City Sector 4",
              priority: "Medium",
              department: "Sanitation",
              status: "Pending",
              officer: "Unassigned",
              date: "Today",
            };
            setIssues([createdIssue, ...issues]);
            alert(`New Civic Issue #${newId} Logged Successfully!`);
          }}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold h-9 rounded-xl px-4 gap-1.5 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Create Issue
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by ID, Category or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9 text-xs border-slate-200 bg-white rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="pending" className="text-xs">Pending</SelectItem>
              <SelectItem value="in progress" className="text-xs">In Progress</SelectItem>
              <SelectItem value="resolved" className="text-xs">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-36 h-9 text-xs border-slate-200 bg-white rounded-xl">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs">All Priorities</SelectItem>
              <SelectItem value="high" className="text-xs">High</SelectItem>
              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="low" className="text-xs">Low</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </Card>

      {/* Issues Table */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Issue ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Category</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Location</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Priority</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Assigned Officer</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5">Reported Date</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 py-3.5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 text-xs">
            {filteredIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-slate-500">
                  No civic issues match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredIssues.map((issue) => (
                <TableRow
                  key={issue.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => onViewIssue(issue)}
                >
                  <TableCell className="font-mono font-bold text-blue-900 py-4">{issue.id}</TableCell>
                  <TableCell className="font-semibold text-slate-900 py-4">{issue.category}</TableCell>
                  <TableCell className="text-slate-600 py-4">{issue.location}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      issue.priority === "High" ? "bg-red-50 text-red-700 border-red-200" :
                      issue.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {issue.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-700 py-4 font-medium">{issue.officer}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      issue.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      issue.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {issue.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 py-4">{issue.date}</TableCell>
                  <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem className="text-xs cursor-pointer gap-2" onClick={() => onViewIssue(issue)}>
                          <Eye className="h-3.5 w-3.5 text-blue-600" /> View Case Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer gap-2"
                          onClick={() => {
                            setIssues(issues.map(i => i.id === issue.id ? { ...i, officer: "John Smith" } : i));
                            alert(`Assigned #${issue.id} to Officer John Smith`);
                          }}
                        >
                          <UserPlus className="h-3.5 w-3.5 text-indigo-600" /> Assign Officer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer gap-2 text-emerald-600"
                          onClick={() => {
                            setIssues(issues.map(i => i.id === issue.id ? { ...i, status: "Resolved" } : i));
                            alert(`Marked #${issue.id} as Resolved!`);
                          }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Mark Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
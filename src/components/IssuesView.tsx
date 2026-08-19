import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
  Filter,
  Download,
  Eye,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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

const mockIssues: Issue[] = [
  {
    id: "ISS-1247",
    photo:
      "https://images.unsplash.com/photo-1709934730506-fba12664d4e4?w=100&h=100&fit=crop",
    category: "Pothole",
    location: "Main Street & 5th Ave",
    priority: "High",
    department: "Roads",
    status: "In Progress",
    officer: "John Smith",
    date: "2025-10-28",
  },
  {
    id: "ISS-1246",
    photo:
      "https://images.unsplash.com/photo-1685992830281-2eef1f9bd3e8?w=100&h=100&fit=crop",
    category: "Street Light",
    location: "Park Avenue",
    priority: "Medium",
    department: "Lighting",
    status: "Pending",
    officer: "Unassigned",
    date: "2025-10-27",
  },
  {
    id: "ISS-1245",
    photo:
      "https://images.unsplash.com/photo-1574676039880-73da8368f0eb?w=100&h=100&fit=crop",
    category: "Garbage Collection",
    location: "Downtown Plaza",
    priority: "High",
    department: "Sanitation",
    status: "In Progress",
    officer: "Sarah Johnson",
    date: "2025-10-27",
  },
  {
    id: "ISS-1244",
    photo:
      "https://images.unsplash.com/photo-1760305024913-47f4f40aa806?w=100&h=100&fit=crop",
    category: "Park Maintenance",
    location: "Central Park",
    priority: "Low",
    department: "Parks",
    status: "Resolved",
    officer: "Mike Davis",
    date: "2025-10-26",
  },
  {
    id: "ISS-1243",
    photo:
      "https://images.unsplash.com/photo-1709934730506-fba12664d4e4?w=100&h=100&fit=crop",
    category: "Road Damage",
    location: "Highway 101",
    priority: "High",
    department: "Roads",
    status: "In Progress",
    officer: "John Smith",
    date: "2025-10-26",
  },
];

interface IssuesViewProps {
  onViewIssue: (issue: Issue) => void;
  activeFilter?: string;
}

export function IssuesView({
  onViewIssue,
  activeFilter,
}: IssuesViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>(
    activeFilter || "all",
  );
  const [priorityFilter, setPriorityFilter] =
    useState<string>("all");

  // Update status filter when activeFilter prop changes
  useEffect(() => {
    if (activeFilter) {
      setStatusFilter(activeFilter);
    }
  }, [activeFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Issues Management</h1>
          <p className="text-gray-600 text-sm">
            View, manage, and resolve civic issues reported by
            citizens
          </p>
          {statusFilter !== "all" && (
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-700">
                Filtered by:{" "}
                {statusFilter === "inprogress"
                  ? "In Progress"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </Badge>
            </div>
          )}
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, location, category..."
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">
                  In Progress
                </SelectItem>
                <SelectItem value="resolved">
                  Resolved
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Priority
                </SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Departments
                </SelectItem>
                <SelectItem value="roads">Roads</SelectItem>
                <SelectItem value="sanitation">
                  Sanitation
                </SelectItem>
                <SelectItem value="lighting">
                  Lighting
                </SelectItem>
                <SelectItem value="parks">Parks</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue ID</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Officer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    {issue.id}
                  </TableCell>
                  <TableCell>
                    <ImageWithFallback
                      src={issue.photo}
                      alt={issue.category}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{issue.category}</TableCell>
                  <TableCell>{issue.location}</TableCell>
                  <TableCell>
                    <Badge
                      className={getPriorityColor(
                        issue.priority,
                      )}
                    >
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.department}</TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(issue.status)}
                    >
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.officer}</TableCell>
                  <TableCell>{issue.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewIssue(issue)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Officer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Send Update
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
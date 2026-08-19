import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Star, Search, ThumbsUp, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Feedback {
  id: string;
  issueId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  category: string;
  date: string;
  status: "Satisfied" | "Not Satisfied" | "Reopened";
}

const mockFeedback: Feedback[] = [
  {
    id: "FB-001",
    issueId: "ISS-1244",
    userName: "Maria Garcia",
    userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    comment: "The pothole was fixed quickly and professionally. Great job by the roads department!",
    category: "Pothole Repair",
    date: "2026-08-18",
    status: "Satisfied",
  },
  {
    id: "FB-002",
    issueId: "ISS-1242",
    userName: "James Wilson",
    userPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Street light was replaced. Overall satisfied with the outcome.",
    category: "Street Light Fix",
    date: "2026-08-17",
    status: "Satisfied",
  },
  {
    id: "FB-003",
    issueId: "ISS-1240",
    userName: "Sarah Chen",
    userPhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    rating: 2,
    comment: "The garbage was collected but the area wasn't sanitized properly. Needs attention.",
    category: "Garbage Collection",
    date: "2026-08-16",
    status: "Not Satisfied",
  },
  {
    id: "FB-004",
    issueId: "ISS-1238",
    userName: "David Martinez",
    userPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Excellent work! The park maintenance team did a thorough job.",
    category: "Park Maintenance",
    date: "2026-08-15",
    status: "Satisfied",
  },
];

export function FeedbackView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFeedback = mockFeedback.filter((fb) =>
    fb.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.issueId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Feedback & CSAT Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review citizen feedback, rating scores, and service quality metrics.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Overall Satisfaction</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4.6 / 5.0</div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">89% Positive Responses</p>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider font-mono">Total Feedback Logs</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">1,420 Submissions</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">124 this week</p>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">5-Star Ratings</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">78.5%</div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">+3.2% vs last month</p>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Reopened Cases</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">3.1%</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Below SLA threshold (5%)</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search feedback by citizen, issue ID or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((fb) => (
          <Card key={fb.id} className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 hover:border-slate-300 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={fb.userPhoto} />
                  <AvatarFallback className="bg-blue-900 text-white font-bold text-xs">{fb.userName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{fb.userName}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Issue #{fb.issueId} • {fb.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < fb.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <Badge className={
                  fb.status === "Satisfied" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" : "bg-red-50 text-red-700 border-red-200 text-[10px]"
                }>
                  {fb.status}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              "{fb.comment}"
            </p>

            <span className="text-[11px] text-slate-400 block font-mono">Date Submitted: {fb.date}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
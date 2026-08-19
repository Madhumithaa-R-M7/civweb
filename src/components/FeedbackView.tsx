import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Star, Search, AlertCircle, ThumbsUp, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    comment:
      "The pothole was fixed quickly and professionally. Great job by the roads department!",
    category: "Pothole",
    date: "2025-10-29",
    status: "Satisfied",
  },
  {
    id: "FB-002",
    issueId: "ISS-1242",
    userName: "James Wilson",
    userPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 4,
    comment:
      "Street light was replaced but took a bit longer than expected. Overall satisfied with the outcome.",
    category: "Street Light",
    date: "2025-10-28",
    status: "Satisfied",
  },
  {
    id: "FB-003",
    issueId: "ISS-1240",
    userName: "Sarah Chen",
    userPhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    rating: 2,
    comment:
      "The garbage was collected but the area wasn't cleaned properly. Some trash is still visible.",
    category: "Garbage Collection",
    date: "2025-10-27",
    status: "Not Satisfied",
  },
  {
    id: "FB-004",
    issueId: "ISS-1238",
    userName: "David Martinez",
    userPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    rating: 5,
    comment:
      "Excellent work! The park maintenance team did a thorough job. The playground is safe for kids again.",
    category: "Park Maintenance",
    date: "2025-10-26",
    status: "Satisfied",
  },
  {
    id: "FB-005",
    issueId: "ISS-1235",
    userName: "Emily Johnson",
    userPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    rating: 1,
    comment:
      "The issue wasn't properly fixed. The water leak is still present. Needs immediate attention.",
    category: "Water Leak",
    date: "2025-10-25",
    status: "Reopened",
  },
  {
    id: "FB-006",
    issueId: "ISS-1233",
    userName: "Robert Taylor",
    userPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    rating: 5,
    comment:
      "Very impressed with the quick response and quality of work. Thank you!",
    category: "Road Repair",
    date: "2025-10-25",
    status: "Satisfied",
  },
];

export function FeedbackView() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Satisfied":
        return "bg-green-100 text-green-700";
      case "Not Satisfied":
        return "bg-orange-100 text-orange-700";
      case "Reopened":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const avgRating =
    mockFeedback.reduce((acc, fb) => acc + fb.rating, 0) / mockFeedback.length;
  const satisfiedCount = mockFeedback.filter(
    (fb) => fb.status === "Satisfied"
  ).length;
  const reopenedCount = mockFeedback.filter(
    (fb) => fb.status === "Reopened"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Citizen Feedback</h1>
          <p className="text-gray-600 text-sm">
            View and manage feedback from resolved issues
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-yellow-50 to-amber-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <Star className="h-6 w-6 text-white fill-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Average Rating</p>
                <p className="text-3xl">{avgRating.toFixed(1)}/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                <ThumbsUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Satisfied</p>
                <p className="text-3xl">{satisfiedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-red-50 to-rose-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Reopened</p>
                <p className="text-3xl">{reopenedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Feedback</p>
                <p className="text-3xl">{mockFeedback.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search feedback by issue ID, user, category..."
                className="pl-9"
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="satisfied">Satisfied</SelectItem>
                <SelectItem value="not-satisfied">Not Satisfied</SelectItem>
                <SelectItem value="reopened">Reopened</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={feedback.userPhoto} />
                      <AvatarFallback>
                        {feedback.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{feedback.userName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(feedback.rating)}
                            <span className="text-sm text-gray-500">
                              Issue ID: {feedback.issueId}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(feedback.status)}>
                            {feedback.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {feedback.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{feedback.comment}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{feedback.category}</Badge>
                        {feedback.status === "Reopened" && (
                          <Button variant="outline" size="sm">
                            View Reopened Issue
                          </Button>
                        )}
                        {feedback.status === "Not Satisfied" && (
                          <Button variant="outline" size="sm">
                            Contact Citizen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import {
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  AlertOctagon,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  Brain,
  X,
  Volume2,
  Award,
  Coins
} from "lucide-react";

interface SmartDustbin {
  id: string;
  location: string;
  fillLevel: number;
  temperature: number;
  battery: number;
  status: "Normal" | "Warning" | "Critical";
}

export function CitizenPortal({ onLogout }: { onLogout: () => void }) {
  const [activeView, setActiveView] = useState<"report" | "dustbins" | "rewards">("report");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [predictedCategory, setPredictedCategory] = useState<string | null>(null);
  const [predictedPriority, setPredictedPriority] = useState<"Low" | "Medium" | "High" | null>(null);
  
  // Eco-Points states
  const [ecoPoints, setEcoPoints] = useState(250);
  const [redeemedVouchers, setRedeemedVouchers] = useState<{ id: string; name: string; cost: number; code: string; date: string }[]>([]);
  const [claimingVoucher, setClaimingVoucher] = useState<{ name: string; cost: number; code: string } | null>(null);

  const rewardsCatalog = [
    { name: "Free Metro Ride Ticket", cost: 100, desc: "Single-journey metro ticket valid for any zone." },
    { name: "Municipal Park Parking Pass", cost: 150, desc: "Free 1-day parking pass for city-managed parks." },
    { name: "Eco-Friendly Water Bottle", cost: 200, desc: "Branded steel water flask, redeemable at Ward Office." },
    { name: "Plant a Tree in Your Name", cost: 300, desc: "A tree planted in the municipal forest. Includes certification." },
  ];

  const handleRedeemVoucher = (reward: typeof rewardsCatalog[0]) => {
    if (ecoPoints < reward.cost) {
      alert("Insufficient Eco-Points! Keep reporting issues or verifying bins to earn more.");
      return;
    }
    const code = "CIVIC-" + Math.floor(Math.random() * 900000 + 100000);
    setClaimingVoucher({ name: reward.name, cost: reward.cost, code });
  };

  const confirmRedemption = () => {
    if (!claimingVoucher) return;
    setEcoPoints(prev => prev - claimingVoucher.cost);
    setRedeemedVouchers(prev => [
      {
        id: "RD-" + Math.floor(Math.random() * 9000 + 1000),
        name: claimingVoucher.name,
        cost: claimingVoucher.cost,
        code: claimingVoucher.code,
        date: "Just now",
      },
      ...prev,
    ]);
    setClaimingVoucher(null);
    alert("Voucher redeemed successfully! Code: " + claimingVoucher.code);
  };

  // Reported complaints list
  const [complaints, setComplaints] = useState([
    { id: "ISS-9821", category: "Garbage Collection", location: "Main Block Circle", date: "Today", status: "Pending" },
    { id: "ISS-9812", category: "Street Light", location: "Sector 4 Main Road", date: "2 days ago", status: "In Progress" },
  ]);
  const [newLocation, setNewLocation] = useState("Downtown Central");

  // IoT Dustbin state
  const [dustbins, setDustbins] = useState<SmartDustbin[]>([
    { id: "IoT-DB-101", location: "Park Street Crossing", fillLevel: 45, temperature: 28, battery: 94, status: "Normal" },
    { id: "IoT-DB-102", location: "Market Square Lane 2", fillLevel: 88, temperature: 31, battery: 89, status: "Warning" },
    { id: "IoT-DB-103", location: "City Hall Main Entrance", fillLevel: 15, temperature: 24, battery: 98, status: "Normal" },
    { id: "IoT-DB-104", location: "Bus Terminal Depot", fillLevel: 94, temperature: 35, battery: 85, status: "Critical" },
  ]);

  // Chatbot states
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello! I am CivicBot, your AI Assistant. How can I help you report an issue or track a complaint today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // AI categorization check
  useEffect(() => {
    if (inputText.trim().length === 0) {
      setPredictedCategory(null);
      setPredictedPriority(null);
      return;
    }

    const text = inputText.toLowerCase();
    let category = "Other";
    let priority: "Low" | "Medium" | "High" = "Medium";

    if (text.includes("garbage") || text.includes("trash") || text.includes("waste") || text.includes("litter")) {
      category = "Garbage Collection";
      priority = "High";
    } else if (text.includes("pothole") || text.includes("road") || text.includes("crack") || text.includes("asphalt")) {
      category = "Pothole Repair";
      priority = "High";
    } else if (text.includes("light") || text.includes("dark") || text.includes("bulb") || text.includes("lamp")) {
      category = "Street Light Fix";
      priority = "Medium";
    } else if (text.includes("leak") || text.includes("water") || text.includes("drain") || text.includes("pipe")) {
      category = "Water Leak";
      priority = "High";
    } else if (text.includes("park") || text.includes("grass") || text.includes("tree") || text.includes("bench")) {
      category = "Park Maintenance";
      priority = "Low";
    }

    setPredictedCategory(category);
    setPredictedPriority(priority);
  }, [inputText]);

  // Simulating IoT Dustbin increments
  useEffect(() => {
    const timer = setInterval(() => {
      setDustbins((prevBins) =>
        prevBins.map((bin) => {
          if (bin.fillLevel < 100) {
            const nextLevel = Math.min(100, bin.fillLevel + Math.floor(Math.random() * 3));
            let status: "Normal" | "Warning" | "Critical" = "Normal";
            if (nextLevel >= 90) status = "Critical";
            else if (nextLevel >= 75) status = "Warning";
            return { ...bin, fillLevel: nextLevel, status };
          }
          return bin;
        })
      );
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleEmptyBin = (id: string) => {
    setDustbins((prevBins) =>
      prevBins.map((bin) =>
        bin.id === id ? { ...bin, fillLevel: 0, status: "Normal" } : bin
      )
    );
    alert(`Clean-up dispatched. Dustbin ${id} emptied successfully.`);
  };

  const handleAddWaste = (id: string) => {
    setDustbins((prevBins) =>
      prevBins.map((bin) => {
        const nextLevel = Math.min(100, bin.fillLevel + 15);
        let status: "Normal" | "Warning" | "Critical" = "Normal";
        if (nextLevel >= 90) status = "Critical";
        else if (nextLevel >= 75) status = "Warning";
        return { ...bin, fillLevel: nextLevel, status };
      })
    );
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || !predictedCategory) return;

    const id = "ISS-" + Math.floor(Math.random() * 9000 + 1000);
    setComplaints([
      { id, category: predictedCategory, location: newLocation, date: "Just now", status: "Pending" },
      ...complaints,
    ]);
    setInputText("");
    setEcoPoints(prev => prev + 50);
    alert(`Complaint submitted successfully! Ticket ID: ${id}. AI categorized this as: ${predictedCategory}. +50 Eco-Points added!`);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      const botResponse = getBotResponse(userMsg);
      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  const getBotResponse = (msg: string): string => {
    const text = msg.toLowerCase();
    if (text.includes("sanjay") || text.includes("worker") || text.includes("officer")) {
      return "Officer Sanjay Kumar is currently online and checked into Chennai Hub. He is en route to Main Street.";
    }
    if (text.includes("iss-1247") || text.includes("1247")) {
      return "Ticket ISS-1247 is currently IN PROGRESS. Worker has verified site presence. Before photo uploaded, AI verification pending.";
    }
    if (text.includes("iss-9821") || text.includes("9821")) {
      return "Ticket ISS-9821 is currently PENDING. A sanitation worker will be assigned shortly.";
    }
    if (text.includes("dustbin") || text.includes("iot")) {
      return "Our IoT gateway monitors 4 dustbins. Bus Terminal Depot (IoT-DB-104) is at 94% full (CRITICAL) and an automatic empty dispatch was routed to field teams.";
    }
    if (text.includes("hello") || text.includes("hi")) {
      return "Hi there! I can help you look up complaint statuses, verify IoT bin levels, or find nearby field officers. Just ask me!";
    }
    return "I have logged your query on our dashboard and routed it to the Ward Admin for analysis. Can I help you with anything else?";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative w-full overflow-x-hidden">
      {/* Top Navbar */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg">
            <Brain className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Civic Connect</h1>
            <p className="text-xs text-indigo-400 font-semibold">Citizen Hub & Smart IoT Showcase</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-indigo-950/80 border border-indigo-500/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs mr-1.5 shadow-inner">
            <Coins className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="font-extrabold text-indigo-200">{ecoPoints} Pts</span>
          </div>
          <Button
            onClick={() => setActiveView("report")}
            variant={activeView === "report" ? "default" : "outline"}
            className="text-xs"
          >
            Report Issue
          </Button>
          <Button
            onClick={() => setActiveView("dustbins")}
            variant={activeView === "dustbins" ? "default" : "outline"}
            className="text-xs"
          >
            IoT Dustbins
          </Button>
          <Button
            onClick={() => setActiveView("rewards")}
            variant={activeView === "rewards" ? "default" : "outline"}
            className="text-xs"
          >
            Rewards Store
          </Button>
          <Button onClick={onLogout} variant="destructive" size="sm" className="text-xs">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-16">
        
        {/* Left 2 Cols: Selected Tab View */}
        <div className="md:col-span-2 space-y-6">
          {activeView === "report" && (
            <Card className="bg-slate-900 border-slate-800 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  Report Issue with AI Categorization
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Type your problem in detail. Our AI will automatically determine the category and assign the priority level.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleReportIssue} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaint-desc">Describe the issue:</Label>
                    <Textarea
                      id="complaint-desc"
                      placeholder="E.g., Large pothole near Sector 3 junction is collecting muddy water and slowing down cars..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="bg-slate-950 border-slate-800 focus:border-indigo-500 min-h-24 text-white"
                      required
                    />
                  </div>

                  {/* AI Prediction Box */}
                  {predictedCategory && (
                    <div className="bg-indigo-950/40 border border-indigo-900/60 p-4 rounded-xl flex items-center justify-between shadow-inner animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                          <Brain className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">AI Predicted Classifications</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-indigo-100">{predictedCategory}</span>
                            <Badge className={
                              predictedPriority === "High" ? "bg-red-950 text-red-400 border border-red-800" :
                              predictedPriority === "Medium" ? "bg-amber-950 text-amber-400 border border-amber-800" : "bg-green-950 text-green-400 border border-green-800"
                            }>
                              {predictedPriority} Priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded border border-indigo-800/40 font-mono">
                        97.4% Confidence
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location / Area</Label>
                      <Input
                        id="location"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2 flex items-end">
                      <Button
                        type="submit"
                        disabled={!predictedCategory}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg font-bold"
                      >
                        Submit AI Classified Report
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeView === "dustbins" && (
            <Card className="bg-slate-900 border-slate-800 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border-b border-slate-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-emerald-400" />
                    Smart Dustbins: IoT Sensor Dashboard
                  </span>
                  <Badge className="bg-emerald-900/50 text-emerald-400 border border-emerald-800">
                    Live Telemetry
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Simulate garbage pile-up. Bins exceeding 90% automatically raise critical warnings and auto-route clean-up tickets.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dustbins.map((bin) => (
                    <div key={bin.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono">{bin.id}</span>
                          <h4 className="font-bold text-sm text-slate-200 mt-0.5">{bin.location}</h4>
                        </div>
                        <Badge className={
                          bin.status === "Critical" ? "bg-red-950 text-red-400 border border-red-800 animate-pulse" :
                          bin.status === "Warning" ? "bg-amber-950 text-amber-400 border border-amber-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        }>
                          {bin.status}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Fill Level:</span>
                          <span className={`font-bold ${bin.fillLevel >= 90 ? "text-red-400" : bin.fillLevel >= 75 ? "text-amber-400" : "text-green-400"}`}>
                            {bin.fillLevel}%
                          </span>
                        </div>
                        <Progress value={bin.fillLevel} className="h-2 bg-slate-900" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-900 pt-2">
                        <div>Temp: <span className="text-slate-200 font-semibold">{bin.temperature}°C</span></div>
                        <div>Battery: <span className="text-slate-200 font-semibold">{bin.battery}%</span></div>
                      </div>

                      {bin.fillLevel >= 90 && (
                        <div className="bg-red-950/30 border border-red-900/40 rounded p-2 text-[10px] text-red-400 italic">
                          ⚠ Dispatch Alert sent to Sanjay Kumar
                        </div>
                      )}

                      <div className="flex gap-2 pt-1.5">
                        <Button
                          onClick={() => handleAddWaste(bin.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-[10px] h-7 border-slate-800 bg-slate-900 text-slate-300"
                        >
                          + Add waste
                        </Button>
                        <Button
                          onClick={() => handleEmptyBin(bin.id)}
                          size="sm"
                          className="flex-1 text-[10px] h-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Clean Bin
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeView === "rewards" && (
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-400 animate-pulse" />
                    Green Rewards Store
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Redeem your Eco-Points for vouchers and municipal rewards. Earn points by submitting reports or monitoring IoT bins!
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* points callout */}
                  <div className="flex justify-between items-center bg-indigo-950/30 border border-indigo-900/65 rounded-xl p-4 shadow-inner">
                    <div>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Your Balance</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{ecoPoints} Eco-Points</h3>
                    </div>
                    <Coins className="h-8 w-8 text-indigo-400 animate-pulse" />
                  </div>

                  {/* catalog */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rewardsCatalog.map((reward, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-bold text-xs text-slate-200">{reward.name}</h4>
                            <span className="text-[10px] text-indigo-400 font-extrabold bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-900">
                              {reward.cost} pts
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2">{reward.desc}</p>
                        </div>
                        <Button
                          onClick={() => handleRedeemVoucher(reward)}
                          disabled={ecoPoints < reward.cost}
                          className="mt-4 w-full h-8 text-[11px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                        >
                          Redeem Voucher
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Redeemed list */}
              <Card className="bg-slate-900 border-slate-800 shadow-2xl">
                <CardHeader className="p-4 border-b border-slate-800">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">Voucher Claim History</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {redeemedVouchers.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">No vouchers redeemed yet.</p>
                  ) : (
                    redeemedVouchers.map((voucher) => (
                      <div key={voucher.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-200">{voucher.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1">Claim ID: {voucher.id} • Code: {voucher.code}</p>
                        </div>
                        <Button
                          onClick={() => setClaimingVoucher({ name: voucher.name, cost: voucher.cost, code: voucher.code })}
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] border-slate-800 text-indigo-400 bg-slate-900 hover:bg-slate-850"
                        >
                          View Barcode
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Citizen Reported Complaints Logs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Your Registered Complaints</h3>
            {complaints.map((comp) => (
              <div key={comp.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 flex justify-between items-center text-xs shadow-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{comp.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{comp.id}</span>
                  </div>
                  <p className="text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-red-500" />
                    {comp.location}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Reported: {comp.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    comp.status === "Pending" ? "bg-amber-950 text-amber-400 border border-amber-800" : "bg-blue-950 text-blue-400 border border-blue-800"
                  }>
                    {comp.status}
                  </Badge>
                  <Button
                    onClick={() => {
                      setChatbotOpen(true);
                      setMessages(prev => [...prev, { sender: "user", text: `What is the status of ${comp.id}?` }, { sender: "bot", text: `Checking database for ${comp.id}... It is currently ${comp.status}.` }]);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-7 border-slate-800 text-[10px] text-indigo-400 hover:bg-slate-800"
                  >
                    Track Status
                  </Button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right 1 Col: Platform overview & Rewards leaderboard */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 shadow-2xl">
            <CardHeader className="p-4 border-b border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                {activeView === "rewards" ? (
                  <>
                    <Award className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                    Eco Citizen Leaderboard
                  </>
                ) : (
                  <>
                    <Brain className="h-4.5 w-4.5 text-yellow-500" />
                    Best Workers Leaderboard
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <p className="text-[11px] text-slate-400">
                {activeView === "rewards"
                  ? "Top green citizens contributing to city waste & pothole reporting!"
                  : "Rewarding points to sanitation workers based on AI cleanliness score and response speed!"}
              </p>
              
              <div className="space-y-3">
                {activeView === "rewards" ? (
                  [
                    { name: "Priya Krishnan", badge: "Eco Warrior Elite", points: 840, rank: 1 },
                    { name: "Rahul Sharma", badge: "Civic Champion", points: 670, rank: 2 },
                    { name: "Amit Roy", badge: "Community Star", points: 550, rank: 3 },
                  ].map((c, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          c.rank === 1 ? "bg-emerald-500 text-slate-950" : c.rank === 2 ? "bg-slate-400 text-slate-950" : "bg-amber-600 text-slate-950"
                        }`}>
                          {c.rank}
                        </span>
                        <div>
                          <p className="font-bold text-slate-200">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.badge}</p>
                        </div>
                      </div>
                      <span className="font-bold text-emerald-400">{c.points} pts</span>
                    </div>
                  ))
                ) : (
                  [
                    { name: "John Smith", dept: "Roads", points: 890, rank: 1 },
                    { name: "Sarah Johnson", dept: "Sanitation", points: 840, rank: 2 },
                    { name: "Sanjay Kumar", dept: "Sanitation", points: 450, rank: 3 },
                  ].map((w, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          w.rank === 1 ? "bg-yellow-500 text-slate-950" : w.rank === 2 ? "bg-slate-400 text-slate-950" : "bg-amber-600 text-slate-950"
                        }`}>
                          {w.rank}
                        </span>
                        <div>
                          <p className="font-bold text-slate-200">{w.name}</p>
                          <p className="text-[10px] text-slate-500">{w.dept}</p>
                        </div>
                      </div>
                      <span className="font-bold text-yellow-500">{w.points} pts</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-950 to-slate-900 border-slate-850 shadow-2xl">
            <CardHeader className="p-4 border-b border-slate-800/50">
              <CardTitle className="text-xs uppercase tracking-wider text-indigo-300 font-bold">Emergency Signal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-center space-y-3">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto animate-bounce" />
              <p className="text-xs text-slate-300">
                Are you witnessing a major hazard like water main burst, structural collapse or fallen electric pole?
              </p>
              <Button onClick={() => alert("SOS Triggered. Control Room notified immediately.")} variant="destructive" className="w-full text-xs font-bold animate-pulse">
                TRIGGER CITIZEN SOS
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Chatbot Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatbotOpen ? (
          <button
            onClick={() => setChatbotOpen(true)}
            className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-all duration-200 relative"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
              1
            </span>
          </button>
        ) : (
          <Card className="w-80 h-96 bg-slate-900 border-slate-800 flex flex-col justify-between shadow-2xl overflow-hidden rounded-2xl animate-fadeIn">
            {/* Chatbot Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-3.5 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-400 animate-pulse" />
                <div>
                  <h3 className="font-bold text-xs text-white">CivicBot Assistant</h3>
                  <p className="text-[9px] text-green-400 font-semibold">Online • AI Help Desk</p>
                </div>
              </div>
              <button onClick={() => setChatbotOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chatbot Message Log */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-950 text-xs">
              {messages.map((m, index) => (
                <div key={index} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-2.5 rounded-xl max-w-[80%] ${
                    m.sender === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chatbot Input Box */}
            <form onSubmit={sendChatMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
              <Input
                placeholder="Ask about Sanjay, IoT, ISS-1247..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs text-white flex-1"
              />
              <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </Card>
        )}
      </div>

      {/* Redemption Barcode Modal */}
      {claimingVoucher && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm bg-slate-900 border-slate-800 text-slate-100 overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-bold">Voucher Verification</CardTitle>
                <CardDescription className="text-slate-300 text-[10px]">Present this barcode at the counter to redeem.</CardDescription>
              </div>
              <button
                onClick={() => setClaimingVoucher(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="text-center">
                <span className="text-[10px] text-indigo-400 font-extrabold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                  {claimingVoucher.name}
                </span>
                <p className="text-xs text-slate-400 mt-2 font-medium">Point Cost: {claimingVoucher.cost} pts</p>
              </div>

              {/* Barcode representation in CSS/HTML */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center w-full max-w-[240px] shadow-lg">
                <div className="flex gap-[3px] items-stretch h-14 w-full justify-center">
                  {[2,1,3,1,2,1,4,2,1,3,1,2,4,1,2,1,3,1,2,4,1,2,1,3].map((w, idx) => (
                    <div key={idx} className="bg-black rounded-sm" style={{ width: `${w * 2}px` }}></div>
                  ))}
                </div>
                <span className="text-slate-800 text-[11px] font-mono tracking-widest mt-2">{claimingVoucher.code}</span>
              </div>

              <div className="flex gap-2.5 w-full pt-2">
                <Button
                  onClick={() => setClaimingVoucher(null)}
                  variant="outline"
                  className="flex-1 text-xs border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Close
                </Button>
                {!redeemedVouchers.some(v => v.code === claimingVoucher.code) && (
                  <Button
                    onClick={confirmRedemption}
                    className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    Confirm Claim
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

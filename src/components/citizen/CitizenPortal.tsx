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
  Trash2,
  AlertTriangle,
  CheckCircle,
  Brain,
  X,
  Award,
  Coins,
  Building2,
  Clock,
  CheckCircle2,
  Gift,
  HelpCircle,
  Upload,
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
  const [activeView, setActiveView] = useState<"report" | "complaints" | "dustbins" | "rewards">("report");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [newLocation, setNewLocation] = useState("Downtown Central");
  const [predictedCategory, setPredictedCategory] = useState<string | null>(null);
  const [predictedPriority, setPredictedPriority] = useState<"Low" | "Medium" | "High" | null>(null);
  
  // Eco-Points states
  const [ecoPoints, setEcoPoints] = useState(250);
  const [redeemedVouchers, setRedeemedVouchers] = useState<{ id: string; name: string; cost: number; code: string; date: string }[]>([]);

  const rewardsCatalog = [
    { name: "Free Metro Ride Ticket", cost: 100, desc: "Single-journey metro ticket valid for any city zone." },
    { name: "Municipal Park Parking Pass", cost: 150, desc: "Free 1-day parking pass for city-managed parking lots." },
    { name: "Eco-Friendly Water Bottle", cost: 200, desc: "Branded steel water flask, redeemable at Ward Office." },
    { name: "Plant a Tree in Your Name", cost: 300, desc: "A sapling planted in municipal park with certificate." },
  ];

  const handleRedeemVoucher = (reward: typeof rewardsCatalog[0]) => {
    if (ecoPoints < reward.cost) {
      alert("Insufficient Eco-Points! Complete more verified reports to earn points.");
      return;
    }
    const code = "CIVIC-" + Math.floor(Math.random() * 900000 + 100000);
    setEcoPoints(prev => prev - reward.cost);
    setRedeemedVouchers(prev => [
      {
        id: "RD-" + Math.floor(Math.random() * 9000 + 1000),
        name: reward.name,
        cost: reward.cost,
        code,
        date: "Just now",
      },
      ...prev,
    ]);
    alert(`Voucher Claimed! Voucher Code: ${code}`);
  };

  // Reported complaints list
  const [complaints, setComplaints] = useState([
    { id: "ISS-9821", category: "Garbage Collection", location: "Main Block Circle", date: "Today", status: "Pending" },
    { id: "ISS-9812", category: "Street Light Fix", location: "Sector 4 Main Road", date: "2 days ago", status: "In Progress" },
  ]);

  // IoT Dustbins
  const [dustbins] = useState<SmartDustbin[]>([
    { id: "IoT-DB-104", location: "Bus Terminal Depot", fillLevel: 94, temperature: 35, battery: 85, status: "Critical" },
    { id: "IoT-DB-108", location: "Central Railway Gate 2", fillLevel: 88, temperature: 32, battery: 92, status: "Warning" },
    { id: "IoT-DB-112", location: "Anna Salai Junction", fillLevel: 42, temperature: 30, battery: 98, status: "Normal" },
    { id: "IoT-DB-115", location: "Marina Promenade", fillLevel: 25, temperature: 29, battery: 90, status: "Normal" },
  ]);

  // Chatbot states
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello! I am CivicBot. How can I help you report an issue or check complaint status today?" },
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
    let category = "General Maintenance";
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
      category = "Water Leakage";
      priority = "High";
    }

    setPredictedCategory(category);
    setPredictedPriority(priority);
  }, [inputText]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;
    const newId = "ISS-" + Math.floor(Math.random() * 9000 + 1000);
    const newComp = {
      id: newId,
      category: predictedCategory || "General Issue",
      location: newLocation,
      date: "Today",
      status: "Pending",
    };
    setComplaints([newComp, ...complaints]);
    setInputText("");
    alert(`Thank you! Issue #${newId} reported successfully. 50 Eco-Points added!`);
    setEcoPoints(ecoPoints + 50);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let botReply = "Thank you for reaching out! Your inquiry has been registered with CivicConnect Helpdesk.";
      const text = userMsg.toLowerCase();
      if (text.includes("status") || text.includes("track")) {
        botReply = "Your recent complaint #ISS-9821 is currently in PENDING state and assigned to Ward 4 Sanitation Officer.";
      } else if (text.includes("report") || text.includes("issue")) {
        botReply = "You can report issues directly using the 'Report an Issue' form. AI will automatically classify category and priority!";
      } else if (text.includes("reward") || text.includes("point")) {
        botReply = `You currently have ${ecoPoints} Eco-Points available to redeem for Metro rides and parking passes!`;
      }
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Friendly Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">CivicConnect Citizen Portal</h1>
              <p className="text-xs text-slate-500">Smart City Public Complaints & Community Services</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
              <Coins className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">{ecoPoints} Eco-Points</span>
            </div>

            <Button variant="outline" size="sm" onClick={onLogout} className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Primary Actions Navigation Bar */}
        <div className="max-w-6xl mx-auto px-6 flex gap-2 overflow-x-auto pt-1 border-t border-slate-100">
          {[
            { id: "report", label: "Report an Issue", icon: Send },
            { id: "complaints", label: `My Complaints (${complaints.length})`, icon: Clock },
            { id: "dustbins", label: "Smart Dustbins", icon: Trash2 },
            { id: "rewards", label: "Eco Rewards", icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-t-xl"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">

        {/* VIEW 1: REPORT AN ISSUE */}
        {activeView === "report" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Report a Civic Issue</h2>
              <p className="text-xs text-slate-500">Describe the problem in your area. AI will automatically classify the category and urgency.</p>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-5">
              <form onSubmit={handleSubmitReport} className="space-y-5 text-xs">
                
                {/* 1. Describe Issue */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-semibold text-xs">1. Describe the Issue</Label>
                  <Textarea
                    placeholder="e.g., Overflowing garbage bin near main market entrance, or deep pothole on West Street..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-28 border-slate-200 rounded-xl text-xs focus:border-blue-600"
                    required
                  />
                </div>

                {/* 2. AI Classification Informational Panel */}
                {inputText.trim().length > 0 && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-blue-600" /> AI Classification Suggestions
                      </span>
                      <Badge className="bg-blue-600 text-white text-[10px]">Auto-Detected</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Suggested Category:</span>
                        <strong className="text-slate-900">{predictedCategory}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Suggested Priority:</span>
                        <strong className={predictedPriority === "High" ? "text-red-600" : "text-amber-600"}>{predictedPriority} Priority</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Confirm Location */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-semibold text-xs">3. Select or Confirm Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Enter street name or landmark..."
                      className="pl-9 h-10 border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>

                {/* 4. Upload Image */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-semibold text-xs">4. Upload Photo (Optional)</Label>
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs">Click to attach photo from device camera or gallery</span>
                  </div>
                </div>

                {/* Submit CTA */}
                <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold h-11 rounded-xl text-xs shadow-md">
                  Submit Complaint (+50 Eco-Points)
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* VIEW 2: COMPLAINT TRACKING */}
        {activeView === "complaints" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Track My Complaints</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status progression of your reported civic issues</p>
            </div>

            <div className="space-y-4">
              {complaints.map((comp) => (
                <Card key={comp.id} className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 text-xs">{comp.id}</span>
                        <Badge className={comp.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200 text-[10px]" : "bg-blue-50 text-blue-700 border-blue-200 text-[10px]"}>
                          {comp.status}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{comp.category}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {comp.location}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Reported: {comp.date}</span>
                  </div>

                  {/* Status Progression Timeline Bar */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Reported</span>
                      <span className={comp.status !== "Pending" ? "text-blue-600 flex items-center gap-1" : "text-slate-400"}>Assigned</span>
                      <span className="text-slate-400">In Progress</span>
                      <span className="text-slate-400">Resolved</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: SMART DUSTBINS */}
        {activeView === "dustbins" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">IoT Smart Dustbin Infrastructure</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live fill-level sensors across public transit hubs and city parks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dustbins.map((bin) => (
                <Card key={bin.id} className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-xs">{bin.id}</span>
                      <h3 className="text-sm font-bold text-slate-800 mt-0.5">{bin.location}</h3>
                    </div>
                    <Badge className={
                      bin.fillLevel >= 90 ? "bg-red-50 text-red-700 border-red-200" :
                      bin.fillLevel >= 75 ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }>
                      {bin.status}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Fill Level</span>
                      <span className={bin.fillLevel >= 90 ? "text-red-600 font-bold" : "text-slate-900"}>{bin.fillLevel}%</span>
                    </div>
                    <Progress value={bin.fillLevel} className="h-2 bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div>Temp: <strong className="text-slate-800">{bin.temperature}°C</strong></div>
                    <div>Battery: <strong className="text-slate-800">{bin.battery}%</strong></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: ECO REWARDS */}
        {activeView === "rewards" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Eco Rewards & Public Incentives</h2>
                <p className="text-xs text-slate-500 mt-0.5">Earn points for reporting issues and redeem public service vouchers</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700">
                Wallet Balance: {ecoPoints} Eco-Points
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rewardsCatalog.map((reward, idx) => (
                <Card key={idx} className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{reward.name}</h3>
                    <p className="text-xs text-slate-500">{reward.desc}</p>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-2 border border-emerald-200">
                      {reward.cost} Eco-Points
                    </span>
                  </div>
                  <Button size="sm" onClick={() => handleRedeemVoucher(reward)} className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold px-4 py-2 rounded-xl shrink-0">
                    Redeem
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Floating CivicBot Chat Trigger */}
      <button
        onClick={() => setChatbotOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-900 hover:bg-blue-950 text-white p-3.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold z-40 transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
        <span>CivicBot Support</span>
      </button>

      {/* CivicBot Chat Drawer */}
      {chatbotOpen && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col h-[450px]">
          <div className="bg-blue-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-300" />
              <span className="text-xs font-bold">CivicBot Assistant</span>
            </div>
            <button onClick={() => setChatbotOpen(false)} className="text-slate-300 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-xl max-w-[80%] ${msg.sender === "user" ? "bg-blue-900 text-white" : "bg-white border border-slate-200 text-slate-800 shadow-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <Input
              placeholder="Ask CivicBot a question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="text-xs h-9 border-slate-200 rounded-xl"
            />
            <Button type="submit" size="sm" className="bg-blue-900 hover:bg-blue-950 text-white h-9 px-3 rounded-xl">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}

    </div>
  );
}

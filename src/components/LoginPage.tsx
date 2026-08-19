import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Building2, Lock, Mail, Eye, EyeOff, ShieldCheck, Users, User, Globe } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: "officer" | "worker" | "citizen") => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<"officer" | "worker" | "citizen">("officer");
  const [email, setEmail] = useState("admin@civicconnect.gov");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectRole = (newRole: "officer" | "worker" | "citizen") => {
    setRole(newRole);
    if (newRole === "officer") {
      setEmail("admin@civicconnect.gov");
      setPassword("admin123");
    } else if (newRole === "worker") {
      setEmail("worker@civicconnect.gov");
      setPassword("worker123");
    } else {
      setEmail("citizen@civicconnect.gov");
      setPassword("citizen123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      {/* Left Side - Civic Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background overlay */}
        <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-3 rounded-xl shadow-md">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">CivicConnect</h1>
              <p className="text-slate-400 text-xs font-medium">Smart City Digital Services Platform</p>
            </div>
          </div>

          <div className="space-y-8 max-w-lg">
            <div>
              <h2 className="text-white text-3xl font-bold tracking-tight mb-3 leading-tight">
                Municipal Operations &
                <br />
                <span className="text-blue-400">Citizen Services Portal</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Integrated civic administration, automated AI issue classification, field worker dispatching, and public complaint tracking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 shadow-sm">
                <div className="text-2xl font-bold text-white mb-0.5">2,489</div>
                <div className="text-slate-400 text-xs">IoT Dustbins Monitored</div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 shadow-sm">
                <div className="text-2xl font-bold text-white mb-0.5">98.2%</div>
                <div className="text-slate-400 text-xs">AI Image Verification</div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 shadow-sm">
                <div className="text-2xl font-bold text-white mb-0.5">15 Mins</div>
                <div className="text-slate-400 text-xs">Avg Emergency Dispatch</div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 shadow-sm">
                <div className="text-2xl font-bold text-white mb-0.5">86</div>
                <div className="text-slate-400 text-xs">Active Field Crews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Government Grade Encryption & Access Control System</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to CivicConnect</h2>
            <p className="text-xs text-slate-500">Select your authorization role to enter the workspace</p>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider text-center">
                Select Workspace Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Role Selectors - 3 Columns */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => selectRole("officer")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    role === "officer"
                      ? "border-blue-600 bg-blue-50/60 text-blue-950 font-semibold shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <Building2 className={`h-5 w-5 mb-1.5 ${role === "officer" ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="text-xs">Municipal Officer</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole("worker")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    role === "worker"
                      ? "border-blue-600 bg-blue-50/60 text-blue-950 font-semibold shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <Users className={`h-5 w-5 mb-1.5 ${role === "worker" ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="text-xs">Field Worker</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole("citizen")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    role === "citizen"
                      ? "border-blue-600 bg-blue-50/60 text-blue-950 font-semibold shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <Globe className={`h-5 w-5 mb-1.5 ${role === "citizen" ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="text-xs">Citizen Portal</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-slate-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@civicconnect.gov"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-10 border-slate-200 focus:border-blue-600 text-xs rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 h-10 border-slate-200 focus:border-blue-600 text-xs rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium h-10 rounded-xl text-xs transition-colors shadow-sm mt-2"
                >
                  {isLoading ? "Authenticating Credentials..." : `Sign in to ${role === "officer" ? "Admin Dashboard" : role === "worker" ? "Field Portal" : "Citizen Services"}`}
                </Button>
              </form>

            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-500">
            For technical support or credentials reset, contact Municipal IT Helpdesk.
          </p>

        </div>
      </div>
    </div>
  );
}

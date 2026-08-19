import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Building2, Lock, Mail, Eye, EyeOff, ShieldCheck, Users, User, Globe } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: "officer" | "worker") => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<"officer" | "worker">("officer");
  const [email, setEmail] = useState("admin@civicconnect.gov");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectRole = (newRole: "officer" | "worker") => {
    setRole(newRole);
    if (newRole === "officer") {
      setEmail("admin@civicconnect.gov");
      setPassword("admin123");
    } else {
      setEmail("worker@civicconnect.gov");
      setPassword("worker123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl tracking-wide">Civic Connect</h1>
              <p className="text-blue-200 text-sm">Smart City Platform</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-white text-4xl mb-4">
                Smart City Civic
                <br />
                <span className="text-blue-300">Management Hub</span>
              </h2>
              <p className="text-blue-100 text-lg">
                Coordinating officers, field workers, and citizens for clean, sustainable, and rapid urban responses.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl text-white mb-1">2,489</div>
                <div className="text-blue-200 text-sm">Dustbins Monitored</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl text-white mb-1">98.2%</div>
                <div className="text-blue-200 text-sm">AI Verification Accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl text-white mb-1">15 Mins</div>
                <div className="text-blue-200 text-sm">Avg Emergency Response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl text-white mb-1">86</div>
                <div className="text-blue-200 text-sm">Active Sanitation Workers</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-blue-200 text-sm">
            <ShieldCheck className="h-5 w-5" />
            <span>Secure Role-Based Authentication System</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 text-xl">Civic Connect</h1>
              <p className="text-gray-600 text-sm">Smart City Platform</p>
            </div>
          </div>

          <Card className="shadow-xl border-gray-200">
            <CardHeader className="space-y-1 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="text-2xl text-center">Select Your Portal</CardTitle>
              <p className="text-sm text-gray-600 text-center">
                Choose a role to access the corresponding workspace
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Role Selectors */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => selectRole("officer")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-center transition-all ${
                    role === "officer"
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                  }`}
                >
                  <Building2 className={`h-5 w-5 mb-1.5 ${role === "officer" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="text-xs font-semibold">Admin/Officer</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectRole("worker")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-center transition-all ${
                    role === "worker"
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                  }`}
                >
                  <Users className={`h-5 w-5 mb-1.5 ${role === "worker" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="text-xs font-semibold">Field Worker</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@civicconnect.gov"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connecting to Portal...</span>
                    </div>
                  ) : (
                    `Access ${role === "officer" ? "Admin" : role === "worker" ? "Worker" : "Citizen"} Dashboard`
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 py-2 rounded-lg border border-gray-100">
                  <ShieldCheck className="h-4 w-4 text-green-600 animate-pulse" />
                  <span>Authorized access only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-600 mt-6">
            Need credentials? Switch roles above to auto-fill them.
          </p>
        </div>
      </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2, Edit, ShieldCheck, Bell, User, Settings as SettingsIcon, Building2 } from "lucide-react";

const departments = [
  "Roads",
  "Sanitation",
  "Lighting",
  "Parks",
  "Water & Sewage",
  "Traffic Signals",
];

export function SettingsView() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system configuration, notifications, and municipal preferences.
        </p>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="bg-slate-200/70 p-1 rounded-xl">
          <TabsTrigger value="departments" className="text-xs rounded-lg">Departments</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs rounded-lg">Profile & Security</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs rounded-lg">Notifications</TabsTrigger>
          <TabsTrigger value="system" className="text-xs rounded-lg">System Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Department Management</h2>
                <p className="text-xs text-slate-500">Configure municipal divisions and responsibility routing</p>
              </div>
              <Button size="sm" className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-xl gap-1.5">
                <Plus className="h-4 w-4" /> Add Department
              </Button>
            </div>

            <div className="space-y-3">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{dept}</span>
                    <span className="text-slate-500">Handling municipal cases and field dispatch for {dept.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 rounded-lg">
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Admin Profile & Security Credentials</h2>
              <p className="text-xs text-slate-500">Update account credentials and security authentication</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">Administrator Name</Label>
                <Input defaultValue="Admin User" className="h-9 border-slate-200 rounded-xl text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">Designation</Label>
                <Input defaultValue="City Manager" className="h-9 border-slate-200 rounded-xl text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">Official Email</Label>
                <Input defaultValue="admin@civicconnect.gov" className="h-9 border-slate-200 rounded-xl text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">Security Password</Label>
                <Input type="password" defaultValue="admin123" className="h-9 border-slate-200 rounded-xl text-xs" />
              </div>
            </div>

            <Button onClick={() => alert("Profile Settings Saved Successfully!")} className="bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs h-9 rounded-xl px-5">
              Save Account Changes
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Notification Alerts</h2>
              <p className="text-xs text-slate-500">Configure automated email, SMS, and push notification triggers</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Critical Priority Alerts</span>
                  <span className="text-slate-500">Send immediate push notifications for critical emergency cases</span>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">IoT Dustbin Capacity Overflow</span>
                  <span className="text-slate-500">Alert sanitation officers when smart dustbins exceed 90% fill capacity</span>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Daily Digest Reports</span>
                  <span className="text-slate-500">Receive summary email reports at 08:00 AM daily</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">System Preferences</h2>
              <p className="text-xs text-slate-500">Global AI thresholds, SLA rules, and platform configuration</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">AI Image Verification Confidence Threshold (%)</Label>
                <Input defaultValue="85" className="h-9 w-36 border-slate-200 rounded-xl text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-medium">Default Resolution SLA (Hours)</Label>
                <Input defaultValue="24" className="h-9 w-36 border-slate-200 rounded-xl text-xs" />
              </div>
              <Button onClick={() => alert("System Preferences Updated!")} className="bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs h-9 rounded-xl px-5">
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

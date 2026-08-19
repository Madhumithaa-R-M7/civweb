import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2, Edit } from "lucide-react";

const departments = [
  "Roads",
  "Sanitation",
  "Lighting",
  "Parks",
  "Water",
  "Traffic",
];

const categories = [
  "Pothole",
  "Street Light",
  "Garbage Collection",
  "Water Leak",
  "Park Maintenance",
  "Road Damage",
  "Traffic Signal",
  "Other",
];

const cityZones = [
  { id: 1, name: "Downtown", area: "Zone A" },
  { id: 2, name: "Northside", area: "Zone B" },
  { id: 3, name: "Eastside", area: "Zone C" },
  { id: 4, name: "Westside", area: "Zone D" },
  { id: 5, name: "Southside", area: "Zone E" },
];

export function SettingsView() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-1">Settings</h1>
        <p className="text-gray-600 text-sm">
          Manage system configuration and preferences
        </p>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="zones">City Zones</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Department Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{dept}</p>
                      <p className="text-sm text-gray-600">
                        Active department handling {dept.toLowerCase()} related
                        issues
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Issue Categories</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium">{category}</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>City Zones & Regions</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Zone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cityZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-gray-600">{zone.area}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Map
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Issue Reports</p>
                      <p className="text-sm text-gray-600">
                        Receive email when new issues are reported
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Issue Updates</p>
                      <p className="text-sm text-gray-600">
                        Get notified about issue status changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Citizen Feedback</p>
                      <p className="text-sm text-gray-600">
                        Alerts for new feedback submissions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Notification Templates</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="issue-received">Issue Received Template</Label>
                    <Textarea
                      id="issue-received"
                      placeholder="Enter notification template..."
                      className="mt-2"
                      defaultValue="Thank you for reporting the issue. Our team will review it shortly."
                    />
                  </div>
                  <div>
                    <Label htmlFor="issue-progress">In Progress Template</Label>
                    <Textarea
                      id="issue-progress"
                      placeholder="Enter notification template..."
                      className="mt-2"
                      defaultValue="Your reported issue is now being addressed by our team."
                    />
                  </div>
                  <div>
                    <Label htmlFor="issue-resolved">Resolved Template</Label>
                    <Textarea
                      id="issue-resolved"
                      placeholder="Enter notification template..."
                      className="mt-2"
                      defaultValue="Your issue has been resolved. Please provide feedback on our service."
                    />
                  </div>
                  <Button>Save Templates</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city-name">City Name</Label>
                      <Input
                        id="city-name"
                        defaultValue="Springfield"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="est">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern (EST)</SelectItem>
                          <SelectItem value="cst">Central (CST)</SelectItem>
                          <SelectItem value="mst">Mountain (MST)</SelectItem>
                          <SelectItem value="pst">Pacific (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      defaultValue="support@cityconnect.gov"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="support-phone">Support Phone</Label>
                    <Input
                      id="support-phone"
                      type="tel"
                      defaultValue="+1 (555) 000-0000"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Chatbot Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chatbot-language">Default Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable AI Chatbot</p>
                      <p className="text-sm text-gray-600">
                        Allow citizens to use AI assistant for issue reporting
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Map Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="map-api-key">Google Maps API Key</Label>
                    <Input
                      id="map-api-key"
                      type="password"
                      placeholder="Enter API key..."
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="map-center-lat">Center Latitude</Label>
                      <Input
                        id="map-center-lat"
                        defaultValue="40.7128"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="map-center-lng">Center Longitude</Label>
                      <Input
                        id="map-center-lng"
                        defaultValue="-74.0060"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button>Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

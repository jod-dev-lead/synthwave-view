import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Trash2,
  LogOut,
  Save
} from "lucide-react";

export default function Settings() {
  const [email] = useState("user@example.com");
  const [notifications, setNotifications] = useState({
    email: true,
    dashboard: false,
    insights: true,
    security: true,
  });

  const handleSave = () => {
    // Simulate save
    console.log("Settings saved");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="flex-1"
                    />
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your email address is used for sign-in and notifications.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your display name"
                    defaultValue=""
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                  <Button onClick={handleSave} className="hover-lift">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dashboard Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about dashboard changes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dashboard}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, dashboard: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Insights</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive AI-generated insights and recommendations
                    </p>
                  </div>
                  <Switch
                    checked={notifications.insights}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, insights: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important security and account notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.security}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, security: checked }))
                    }
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={handleSave} className="hover-lift">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="space-y-3">
                  <Label>Color Scheme</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { name: "Blue", color: "hsl(var(--chart-1))" },
                      { name: "Purple", color: "hsl(var(--chart-2))" },
                      { name: "Green", color: "hsl(var(--chart-3))" },
                      { name: "Orange", color: "hsl(var(--chart-4))" },
                      { name: "Pink", color: "hsl(var(--chart-5))" },
                    ].map((scheme) => (
                      <Button
                        key={scheme.name}
                        variant="outline"
                        size="sm"
                        className="h-12 p-2 hover-lift"
                      >
                        <div
                          className="w-full h-full rounded"
                          style={{ backgroundColor: scheme.color }}
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSave} className="hover-lift">
                    <Save className="h-4 w-4 mr-2" />
                    Save Appearance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>
                  Manage your account security and data privacy settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">Magic Link Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Secure passwordless login via email
                      </p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Data Management</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
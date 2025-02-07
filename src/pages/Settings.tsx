import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Save, Power, RefreshCw, StopCircle, ExternalLink } from "lucide-react";
import { controlBackend } from "@/utils/statusMonitor";
import { StatusIndicator } from "@/components/network/StatusIndicator";
import { useState, useEffect } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [mapsApiKey, setMapsApiKey] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('VITE_GOOGLE_MAPS_API_KEY');
    if (savedApiKey) {
      setMapsApiKey(savedApiKey);
    }
  }, []);

  const handleSave = () => {
    if (mapsApiKey) {
      localStorage.setItem('VITE_GOOGLE_MAPS_API_KEY', mapsApiKey);
    }
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  };

  const handleBackendControl = async (action: 'start' | 'stop' | 'restart') => {
    await controlBackend(action);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <StatusIndicator />
      
      <div className="grid gap-6">
        {/* Backend Control Card */}
        <Card>
          <CardHeader>
            <CardTitle>Backend Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleBackendControl('start')}
              >
                <Power className="mr-2 h-4 w-4" />
                Start Backend
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleBackendControl('stop')}
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Backend
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleBackendControl('restart')}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restart Backend
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Google Maps API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Google Maps Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="maps-api-key">Google Maps API Key</Label>
                <Input
                  id="maps-api-key"
                  type="password"
                  value={mapsApiKey}
                  onChange={(e) => setMapsApiKey(e.target.value)}
                  placeholder="Enter your Google Maps API Key"
                  className="mt-1"
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>To obtain a Google Maps API key:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                    Google Cloud Console
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a></li>
                  <li>Create a new project or select an existing one</li>
                  <li>Enable the Maps JavaScript API for your project</li>
                  <li>Go to Credentials and create an API key</li>
                  <li>Restrict the API key to your domain for security</li>
                </ol>
                <p className="mt-2 text-yellow-600 dark:text-yellow-400">
                  Note: Keep your API key secure and never share it publicly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Scanning Card */}
        <Card>
          <CardHeader>
            <CardTitle>Network Scanning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-Scan Interval (minutes)</Label>
                <div className="w-[200px]">
                  <Slider defaultValue={[30]} max={120} step={5} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-scan">Enable Auto-Scan</Label>
                <Switch id="auto-scan" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>IP Range</Label>
              <div className="flex space-x-2">
                <Input placeholder="Start IP" defaultValue="192.168.1.1" />
                <Input placeholder="End IP" defaultValue="192.168.1.255" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="device-notifications">Device Status Changes</Label>
              <Switch id="device-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security-notifications">Security Alerts</Label>
              <Switch id="security-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="performance-notifications">Performance Alerts</Label>
              <Switch id="performance-notifications" />
            </div>
          </CardContent>
        </Card>

        {/* Data Management Card */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Data Retention Period (days)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-cleanup">Automatic Data Cleanup</Label>
              <Switch id="auto-cleanup" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

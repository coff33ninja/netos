import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample historical data - replace with actual data from your backend
const data = [
  { time: '00:00', devices: 12, speed: 95 },
  { time: '04:00', devices: 15, speed: 98 },
  { time: '08:00', devices: 20, speed: 85 },
  { time: '12:00', devices: 18, speed: 92 },
  { time: '16:00', devices: 25, speed: 88 },
  { time: '20:00', devices: 22, speed: 90 },
];

export const HistoricalData = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Network Performance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="devices" stroke="#8884d8" name="Active Devices" />
              <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#82ca9d" name="Network Speed (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
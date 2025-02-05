import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { api, Device } from '../../services/api';
import { useToast } from '../ui/use-toast';
import { useWebSocket } from '../../hooks/useWebSocket';
import { DeviceDetails } from './DeviceDetails';

type SortField = 'name' | 'ip' | 'type' | 'status' | 'last_seen';
type SortOrder = 'asc' | 'desc';

export function DeviceList() {
    const { devices, currentScan } = useWebSocket();
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const { toast } = useToast();

    const startScan = async () => {
        try {
            const scan = await api.startNetworkScan('192.168.1.1', '192.168.1.254');
            toast({
                title: 'Scan Started',
                description: `Scanning network from ${scan.start_ip} to ${scan.end_ip}`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to start network scan',
                variant: 'destructive',
            });
        }
    };

    const handleDeviceUpdate = (updated: Device) => {
        // WebSocket will handle the update in the UI
        toast({
            title: 'Success',
            description: 'Device updated successfully',
        });
    };

    // Get unique device types and statuses for filters
    const deviceTypes = ['all', ...new Set(devices.map(d => d.type))];
    const deviceStatuses = ['all', ...new Set(devices.map(d => d.status))];

    // Apply filters and sorting
    const filteredDevices = devices
        .filter(device => {
            const matchesSearch = 
                device.name.toLowerCase().includes(search.toLowerCase()) ||
                device.ip.toLowerCase().includes(search.toLowerCase()) ||
                device.type.toLowerCase().includes(search.toLowerCase());
            
            const matchesType = typeFilter === 'all' || device.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
            
            return matchesSearch && matchesType && matchesStatus;
        })
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            const modifier = sortOrder === 'asc' ? 1 : -1;
            
            if (aValue < bValue) return -1 * modifier;
            if (aValue > bValue) return 1 * modifier;
            return 0;
        });

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Network Devices</span>
                    <Button onClick={startScan} disabled={currentScan?.status === 'in_progress'}>
                        {currentScan?.status === 'in_progress' ? 'Scanning...' : 'Scan Network'}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-4">
                    <Input
                        placeholder="Search devices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Type: {typeFilter} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {deviceTypes.map(type => (
                                <DropdownMenuItem
                                    key={type}
                                    onClick={() => setTypeFilter(type)}
                                >
                                    {type}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Status: {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {deviceStatuses.map(status => (
                                <DropdownMenuItem
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {status}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead onClick={() => toggleSort('name')} className="cursor-pointer">
                                Name <ArrowUpDown className="inline ml-2 h-4 w-4" />
                            </TableHead>
                            <TableHead onClick={() => toggleSort('ip')} className="cursor-pointer">
                                IP Address <ArrowUpDown className="inline ml-2 h-4 w-4" />
                            </TableHead>
                            <TableHead onClick={() => toggleSort('type')} className="cursor-pointer">
                                Type <ArrowUpDown className="inline ml-2 h-4 w-4" />
                            </TableHead>
                            <TableHead onClick={() => toggleSort('status')} className="cursor-pointer">
                                Status <ArrowUpDown className="inline ml-2 h-4 w-4" />
                            </TableHead>
                            <TableHead onClick={() => toggleSort('last_seen')} className="cursor-pointer">
                                Last Seen <ArrowUpDown className="inline ml-2 h-4 w-4" />
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDevices.map((device) => (
                            <TableRow key={device.id}>
                                <TableCell>{device.name}</TableCell>
                                <TableCell>{device.ip}</TableCell>
                                <TableCell>{device.type}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        device.status === 'Online' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {device.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {device.last_seen
                                        ? new Date(device.last_seen).toLocaleString()
                                        : 'Never'}
                                </TableCell>
                                <TableCell>
                                    <DeviceDetails device={device} onUpdate={handleDeviceUpdate} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredDevices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No devices found matching the current filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
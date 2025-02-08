
import { useState } from 'react';
import { DeviceGroup } from '@/types/performance';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, X } from 'lucide-react';

interface DeviceGroupManagerProps {
    groups: DeviceGroup[];
    onCreateGroup: (group: Omit<DeviceGroup, 'id'>) => void;
    onDeleteGroup: (groupId: string) => void;
    onAddDeviceToGroup: (groupId: string, deviceId: string) => void;
}

export function DeviceGroupManager({ 
    groups, 
    onCreateGroup, 
    onDeleteGroup,
    onAddDeviceToGroup 
}: DeviceGroupManagerProps) {
    const [newGroupName, setNewGroupName] = useState('');
    const [newTag, setNewTag] = useState('');

    const handleCreateGroup = () => {
        if (!newGroupName) return;
        onCreateGroup({
            name: newGroupName,
            deviceIds: [],
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            tags: []
        });
        setNewGroupName('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Device Groups</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="New group name"
                        />
                        <Button onClick={handleCreateGroup}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {groups.map((group) => (
                            <div key={group.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                    <span className="font-medium">{group.name}</span>
                                    <div className="flex gap-1 mt-1">
                                        {group.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => onDeleteGroup(group.id)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

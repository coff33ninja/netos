import { DeviceList } from './components/network/DeviceList';
import { NetworkMap } from './components/network/NetworkMap';
import { Toaster } from './components/ui/toaster';

function App() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Network Topology Scanner</h1>
            
            <div className="grid gap-8">
                <NetworkMap />
                <DeviceList />
            </div>

            <Toaster />
        </div>
    );
}

export default App;
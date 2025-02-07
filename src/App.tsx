
import { Routes, Route } from 'react-router-dom';
import NavigationMenu from './components/navigation/NavigationMenu';
import Index from './pages/Index';
import Devices from './pages/Devices';
import Nodes from './pages/Nodes';
import NetworkTopology from './pages/NetworkTopology';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-background">
                <NavigationMenu />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/devices" element={<Devices />} />
                        <Route path="/nodes" element={<Nodes />} />
                        <Route path="/network-topology" element={<NetworkTopology />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Toaster />
            </div>
        </ErrorBoundary>
    );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import NavigationMenu from './components/navigation/NavigationMenu';
import Index from './pages/Index';
import Devices from './pages/Devices';
import Nodes from './pages/Nodes';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';

function App() {
    return (
        <div className="min-h-screen bg-background">
            <NavigationMenu />
            <main>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/nodes" element={<Nodes />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Toaster />
        </div>
    );
}

export default App;
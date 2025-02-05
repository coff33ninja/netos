
import { Home, Monitor, Server, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavigationMenu = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/devices", label: "Devices", icon: Monitor },
    { path: "/nodes", label: "Nodes", icon: Server },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground
                    ${isActive(item.path) ? "bg-accent text-accent-foreground" : "text-foreground"}`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;

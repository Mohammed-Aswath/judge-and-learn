import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../app/slices/authSlice';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  CreditCard, 
  LogOut,
  Shield
} from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { text: 'Colleges', icon: GraduationCap, path: '/admin/colleges' },
    { text: 'Users', icon: Users, path: '/admin/users' },
    { text: 'Problem Sets', icon: BookOpen, path: '/admin/problem-sets' },
    { text: 'Usage Reports', icon: BarChart3, path: '/admin/usage' },
    { text: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-card border-r border-border">
          <div className="flex items-center h-16 px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Admin Panel</span>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.text}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.text}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">Admin Portal</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
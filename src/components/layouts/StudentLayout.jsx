import React from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../../app/slices/authSlice';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  TrendingUp, 
  Target, 
  Trophy, 
  FileText, 
  LogOut,
  Code,
  Menu,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const StudentLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  
  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { text: 'Problems', icon: BookOpen, path: '/student/problems' },
    { text: 'Submissions', icon: FileText, path: '/student/submissions' },
    { text: 'Progress', icon: TrendingUp, path: '/student/progress' },
    { text: 'Leaderboard', icon: Trophy, path: '/student/leaderboard' },
    { text: 'Recommendations', icon: Target, path: '/student/recommendations' },
  ];
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col flex-1 min-h-0 bg-card border-r border-border">
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">CodeJudge</span>
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.text}
              to={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.text}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-semibold text-foreground">Student Portal</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border-border" align="end" forceMount>
                <DropdownMenuItem 
                  onClick={() => navigate('/student/profile')}
                  className="hover:bg-accent cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-accent cursor-pointer text-destructive hover:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

export default StudentLayout;
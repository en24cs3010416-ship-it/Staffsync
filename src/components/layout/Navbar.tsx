import React from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { UserRole, ActiveTab } from '../../types';
import { 
  Users, 
  RotateCcw,
  Sparkles,
  BookOpen,
  PlaySquare,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    activeTab, 
    setActiveTab, 
    resetToDefaultData,
    showToast 
  } = useStaffSync();

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`Switched active view to ${role.toUpperCase()}: ${
      role === 'hr' ? 'Sarah Lin (VP of HR)' : role === 'manager' ? 'Marcus Vance (Manager)' : 'Elena Rostova (Employee)'
    }`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg tracking-tight group-hover:bg-slate-800 transition-colors">
                S<span className="text-emerald-400">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  StaffSync
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                  MERN HRMS Platform
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Primary navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                ['dashboard', 'employees', 'attendance', 'leaves', 'training', 'announcements'].includes(activeTab)
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ER & MVC Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('demo_video')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'demo_video'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlaySquare className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600" />
              <span>Interactive Demo Video</span>
            </button>
          </nav>

          {/* Zone 3: Role Switcher & Persona Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Role Segmented Selector */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleChange('hr')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  currentRole === 'hr'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to HR Personnel View"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">HR Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('manager')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  currentRole === 'manager'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Manager View"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Manager</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('employee')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  currentRole === 'employee'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Employee View"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Employee</span>
              </button>
            </div>

            {/* Current Persona Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatarUrl || '/src/assets/images/employee_avatar_elena_1793176315916.jpg'}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  {currentUser.designation}
                </span>
              </div>
            </div>

            {/* Reset Data Button */}
            <button
              onClick={resetToDefaultData}
              title="Reset to default sample data"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

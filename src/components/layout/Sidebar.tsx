import React from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { ActiveTab } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarCheck2, 
  GraduationCap, 
  Megaphone,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, leaves, announcements, attendance } = useStaffSync();

  // Pending count badges based on role
  const pendingLeavesCount = leaves.filter(l => {
    if (currentRole === 'manager') return l.status === 'pending';
    if (currentRole === 'hr') return l.status === 'manager_approved' || l.status === 'pending';
    return false;
  }).length;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Overview & Analytics',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'employees' as ActiveTab,
      label: currentRole === 'hr' ? 'Employee Directory & Onboarding' : 'Team Directory',
      icon: Users,
      badge: undefined,
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Attendance & Punch Clock',
      icon: Clock,
      badge: undefined,
    },
    {
      id: 'leaves' as ActiveTab,
      label: 'Leave Management',
      icon: CalendarCheck2,
      badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} pending` : undefined,
      badgeColor: 'text-amber-700 bg-amber-50',
    },
    {
      id: 'training' as ActiveTab,
      label: 'Training & Development (L&D)',
      icon: GraduationCap,
      badge: currentRole === 'manager' ? 'Manage' : undefined,
      badgeColor: 'text-blue-700 bg-blue-50',
    },
    {
      id: 'announcements' as ActiveTab,
      label: 'Notices & Company Bulletins',
      icon: Megaphone,
      badge: announcements.length > 0 ? `${announcements.length}` : undefined,
      badgeColor: 'text-slate-600 bg-slate-100',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current Role Identity Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Active Role
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
            currentRole === 'hr'
              ? 'bg-purple-100 text-purple-800'
              : currentRole === 'manager'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            {currentRole === 'hr' ? 'HR Personnel' : currentRole === 'manager' ? 'Team Manager' : 'Employee'}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {currentRole === 'hr' && 'Full administrator rights: staff data, leave approvals, attendance auditing & bulletins.'}
          {currentRole === 'manager' && 'Supervisory access: team leave evaluations, skill coaching & training programs.'}
          {currentRole === 'employee' && 'Self-service portal: punch logs, personal leave requests & company bulletins.'}
        </p>
      </div>

      {/* Navigation Links */}
      <div className="p-3 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core HR Operations
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  isActive ? 'bg-slate-800 text-slate-200' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Documentation Shortcuts */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 mt-auto">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Technical Architecture
        </span>
        <button
          onClick={() => setActiveTab('architecture')}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors text-xs font-medium"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>MERN & ER Specs</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </aside>
  );
};

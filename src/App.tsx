import React from 'react';
import { StaffSyncProvider, useStaffSync } from './context/StaffSyncContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { EmployeesView } from './components/employees/EmployeesView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { LeavesView } from './components/leaves/LeavesView';
import { TrainingView } from './components/training/TrainingView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { ArchitectureHub } from './components/architecture/ArchitectureHub';
import { DemoVideoSimulator } from './components/demo/DemoVideoSimulator';
import { CheckCircle2, ShieldCheck, Database, Server } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useStaffSync();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      {activeTab === 'architecture' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <ArchitectureHub />
        </main>
      ) : activeTab === 'demo_video' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <DemoVideoSimulator />
        </main>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'employees' && <EmployeesView />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'leaves' && <LeavesView />}
            {activeTab === 'training' && <TrainingView />}
            {activeTab === 'announcements' && <AnnouncementsView />}
          </main>
        </div>
      )}

      {/* System Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">StaffSync</span>
            <span>·</span>
            <span>Modern Human Resource Management Solution</span>
            <span>·</span>
            <span className="font-mono text-slate-400">v2.4.0 (MERN Architecture)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>MongoDB 7.0</span>
            <span>·</span>
            <span>Express.js API</span>
            <span>·</span>
            <span>React 19 & Tailwind</span>
            <span>·</span>
            <span>Node.js Runtime</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StaffSyncProvider>
      <MainContent />
    </StaffSyncProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { 
  Users, 
  Clock, 
  CalendarCheck2, 
  GraduationCap, 
  Megaphone,
  ArrowUpRight,
  CheckCircle2,
  Clock4,
  AlertCircle,
  Briefcase,
  Building,
  Laptop,
  Plus
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    employees, 
    attendance, 
    leaves, 
    trainings, 
    announcements,
    todayRecord,
    clockIn,
    clockOut,
    setActiveTab,
    showToast
  } = useStaffSync();

  const [liveTime, setLiveTime] = useState<string>('');
  const [workModeSelect, setWorkModeSelect] = useState<'office' | 'remote' | 'field'>('office');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute metrics
  const totalEmployees = employees.length;
  const todayAttendance = attendance.filter(a => a.date === '2026-10-28');
  const presentCount = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;
  
  const pendingLeaves = leaves.filter(l => l.status === 'pending' || l.status === 'manager_approved');
  const activeTrainings = trainings.filter(t => t.status === 'in_progress');

  // Employee-specific metrics
  const userLeaves = leaves.filter(l => l.employeeId === currentUser.employeeId);
  const userTrainings = trainings.filter(t => 
    t.enrolledEmployees.some(e => e.employeeId === currentUser.employeeId)
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>StaffSync Workspace</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span>Dashboard Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {currentUser.designation} · {currentUser.department} · {currentUser.employeeId}
          </p>
        </div>

        {/* Quick Mode & Current Date */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono tabular-nums text-slate-700 shadow-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Wed, Oct 28, 2026</span>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-900">{liveTime || '09:30:00 AM'}</span>
          </div>
        </div>
      </div>

      {/* Hero Quick Punch & Status Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Punch Box */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Real-Time Attendance Punch
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {todayRecord ? (
                  todayRecord.checkOutTime 
                    ? 'Shift Concluded Today'
                    : 'Currently Checked In'
                ) : (
                  'Not Clocked In Yet'
                )}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {todayRecord ? (
                  todayRecord.checkOutTime ? (
                    <>Logged out at <span className="font-mono font-semibold">{todayRecord.checkOutTime}</span> · Total: <span className="font-mono font-semibold">{todayRecord.totalHours} hrs</span></>
                  ) : (
                    <>Clocked in at <span className="font-mono font-semibold text-slate-900">{todayRecord.checkInTime}</span> ({todayRecord.workMode} mode) · <span className="text-slate-500">{todayRecord.location}</span></>
                  )
                ) : (
                  'Standard shift starts at 09:00 AM. Select your workspace location below to record attendance.'
                )}
              </p>
            </div>

            <div className={`p-3 rounded-xl ${
              todayRecord 
                ? (todayRecord.checkOutTime ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-700')
                : 'bg-amber-50 text-amber-700'
            }`}>
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {!todayRecord ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Location:</span>
                  <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setWorkModeSelect('office')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        workModeSelect === 'office' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      Office
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkModeSelect('remote')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        workModeSelect === 'remote' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      Remote
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => clockIn(workModeSelect)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Clock In Now
                </button>
              </>
            ) : !todayRecord.checkOutTime ? (
              <>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Session Active: Automated geofence verified</span>
                </div>

                <button
                  type="button"
                  onClick={clockOut}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
                >
                  <Clock4 className="w-4 h-4" />
                  Clock Out (Conclude Day)
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between text-xs text-slate-500">
                <span>Daily timesheet synced to HR payroll records.</span>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-slate-900 font-semibold hover:underline"
                >
                  View Full Timesheet →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Leave Balance Quick Widget */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Personal Leave Quota
              </span>
              <button 
                onClick={() => setActiveTab('leaves')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800"
              >
                Apply →
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                <span className="block text-[11px] text-slate-500">Annual</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {currentUser.leaveBalances.annual}
                </span>
                <span className="text-[10px] text-slate-400">days left</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                <span className="block text-[11px] text-slate-500">Sick</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {currentUser.leaveBalances.sick}
                </span>
                <span className="text-[10px] text-slate-400">days left</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                <span className="block text-[11px] text-slate-500">Casual</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {currentUser.leaveBalances.casual}
                </span>
                <span className="text-[10px] text-slate-400">days left</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Accrual cycle: 2026 Calendar Year</span>
            <span className="text-slate-400">Ref: Labor Standard 104</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {currentRole === 'manager' ? 'Team Members' : 'Total Employees'}
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {currentRole === 'manager' ? 4 : totalEmployees}
            </span>
            <span className="text-xs text-emerald-600 font-medium">100% active</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {currentRole === 'manager' ? 'Direct engineering reports' : 'Across 4 company departments'}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Attendance Today</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {attendanceRate}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {presentCount}/{totalEmployees} logged
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            1 on approved sick leave
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Leave Review</span>
            <CalendarCheck2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {pendingLeaves.length}
            </span>
            <span className="text-xs text-amber-600 font-medium">Awaiting action</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {currentRole === 'manager' ? '1 in your team queue' : 'Dual-approval pipeline active'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active L&D Programs</span>
            <GraduationCap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {trainings.length}
            </span>
            <span className="text-xs text-indigo-600 font-medium">Skill development</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            2 courses in progress this month
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Leaves & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending / Recent Leave Approvals */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Leave Approvals Pipeline
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('leaves')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              View All ({leaves.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {leaves.slice(0, 4).map(leave => (
              <div key={leave._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                    {leave.employeeName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {leave.employeeName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {leave.leaveType.toUpperCase()} · {leave.startDate} to {leave.endDate} ({leave.totalDays}d)
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    leave.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : leave.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : leave.status === 'manager_approved'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {leave.status === 'approved' && 'Approved'}
                    {leave.status === 'rejected' && 'Rejected'}
                    {leave.status === 'manager_approved' && 'Mgr Approved'}
                    {leave.status === 'pending' && 'Pending'}
                  </span>

                  {(currentRole === 'manager' || currentRole === 'hr') && leave.status !== 'approved' && leave.status !== 'rejected' && (
                    <button
                      onClick={() => setActiveTab('leaves')}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded font-medium transition-colors"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Company Bulletins & Announcements */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Company Announcements & News
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('announcements')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              All Bulletins ({announcements.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann._id} className="py-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : ann.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {ann.publishedDate}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                  {ann.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { AttendanceRecord } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  Clock4, 
  AlertCircle, 
  Download, 
  Search, 
  Building, 
  Laptop, 
  MapPin, 
  PlusCircle, 
  X,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    attendance, 
    employees, 
    todayRecord, 
    clockIn, 
    clockOut, 
    addAttendanceRecord,
    showToast 
  } = useStaffSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual record form
  const [manualData, setManualData] = useState({
    employeeId: employees[0]?.employeeId || 'EMP-1001',
    date: '2026-10-28',
    checkInTime: '09:00 AM',
    checkOutTime: '05:30 PM',
    status: 'present' as const,
    workMode: 'office' as const,
    location: 'Headquarters Studio',
    notes: 'Manual entry verified by HR',
  });

  const todayStr = '2026-10-28';
  const todayRecords = attendance.filter(a => a.date === todayStr);
  const presentCount = todayRecords.filter(a => a.status === 'present' || a.status === 'late').length;
  const lateCount = todayRecords.filter(a => a.status === 'late').length;
  const absentCount = todayRecords.filter(a => a.status === 'absent').length;

  const filteredAttendance = attendance.filter(rec => {
    const matchesSearch = 
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    const matchesWorkMode = workModeFilter === 'All' || rec.workMode === workModeFilter;

    return matchesSearch && matchesStatus && matchesWorkMode;
  });

  const handleExportCSV = () => {
    const headers = 'Record ID,Employee ID,Name,Department,Date,Check-In,Check-Out,Total Hours,Status,Work Mode,Location\n';
    const rows = filteredAttendance.map(r => 
      `"${r._id}","${r.employeeId}","${r.employeeName}","${r.department}","${r.date}","${r.checkInTime}","${r.checkOutTime || '-'}","${r.totalHours || '-'}","${r.status}","${r.workMode}","${r.location}"`
    ).join('\n');
    const blob = new Blob([headers, rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `StaffSync_Attendance_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance CSV log exported.');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.employeeId === manualData.employeeId);
    if (!emp) return;

    addAttendanceRecord({
      employeeId: emp.employeeId,
      employeeName: emp.fullName,
      department: emp.department,
      date: manualData.date,
      checkInTime: manualData.checkInTime,
      checkOutTime: manualData.checkOutTime,
      totalHours: 8.5,
      status: manualData.status,
      workMode: manualData.workMode,
      location: manualData.location,
      notes: manualData.notes,
    });

    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>StaffSync Workspace</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span>Attendance & Time Tracking</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Logs & Punch Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Automated check-in timestamps, geolocation verification, shift logs, and compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {currentRole === 'hr' && (
            <button
              type="button"
              onClick={() => setIsManualModalOpen(true)}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              Manual Punch Adjustment
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Logged Present Today</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{presentCount}</span>
            <span className="text-xs text-slate-500">/ {employees.length} staff</span>
          </div>
          <span className="text-[11px] text-emerald-600 block mt-1">High quorum (86%)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Late Arrivals</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">{lateCount}</span>
            <span className="text-xs text-slate-500">after 09:15 AM</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Grace period applied</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Approved Absence</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-700">{absentCount}</span>
            <span className="text-xs text-slate-500">on leave</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Sick leave verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Average Shift Duration</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">8.4</span>
            <span className="text-xs text-slate-500">hours/day</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Standard 40h workweek</span>
        </div>
      </div>

      {/* Clock In / Out Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${
            todayRecord ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Personal Attendance for {currentUser.fullName} ({currentUser.employeeId})
            </h3>
            <p className="text-xs text-slate-500">
              {todayRecord ? (
                todayRecord.checkOutTime 
                  ? `Shift finished. Check-in: ${todayRecord.checkInTime} · Check-out: ${todayRecord.checkOutTime}`
                  : `Checked in at ${todayRecord.checkInTime} (${todayRecord.workMode}). Location: ${todayRecord.location}`
              ) : (
                'You have not checked in for today yet.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!todayRecord ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => clockIn('office')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                Clock In (Office)
              </button>
              <button
                type="button"
                onClick={() => clockIn('remote')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Laptop className="w-3.5 h-3.5" />
                Clock In (Remote)
              </button>
            </div>
          ) : !todayRecord.checkOutTime ? (
            <button
              type="button"
              onClick={clockOut}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <Clock4 className="w-4 h-4" />
              Clock Out (Conclude Shift)
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Shift Recorded (Complete)
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by employee, department, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent / On Leave</option>
          </select>

          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="All">All Work Modes</option>
            <option value="office">In-Office</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Mode & Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map(rec => (
                <tr key={rec._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                    {rec.date}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{rec.employeeName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{rec.employeeId}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {rec.department}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    {rec.checkInTime}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {rec.checkOutTime || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                    {rec.totalHours ? `${rec.totalHours}h` : 'In progress'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="capitalize font-medium text-slate-800">{rec.workMode}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{rec.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                      rec.status === 'present'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : rec.status === 'late'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal (HR) */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Manual Punch Adjustment
                </h3>
                <p className="text-xs text-slate-500">
                  HR administrative override for missed punches or schedule edits.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Employee</label>
                <select
                  value={manualData.employeeId}
                  onChange={e => setManualData({...manualData, employeeId: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>
                      {emp.fullName} ({emp.employeeId}) - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={manualData.date}
                    onChange={e => setManualData({...manualData, date: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={manualData.status}
                    onChange={e => setManualData({...manualData, status: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="half_day">Half Day</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Check-In Time</label>
                  <input
                    type="text"
                    value={manualData.checkInTime}
                    onChange={e => setManualData({...manualData, checkInTime: e.target.value})}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Check-Out Time</label>
                  <input
                    type="text"
                    value={manualData.checkOutTime}
                    onChange={e => setManualData({...manualData, checkOutTime: e.target.value})}
                    placeholder="05:30 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Location / Work Mode</label>
                <input
                  type="text"
                  value={manualData.location}
                  onChange={e => setManualData({...manualData, location: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Audit Notes</label>
                <input
                  type="text"
                  value={manualData.notes}
                  onChange={e => setManualData({...manualData, notes: e.target.value})}
                  placeholder="Reason for manual adjustment..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Commit Entry to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

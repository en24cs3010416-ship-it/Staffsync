import React, { useState } from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { LeaveRequest } from '../../types';
import { 
  CalendarCheck2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  AlertCircle, 
  Filter, 
  UserCheck, 
  ShieldCheck, 
  X,
  FileText
} from 'lucide-react';

export const LeavesView: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    leaves, 
    applyLeave, 
    reviewLeave, 
    showToast 
  } = useStaffSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [reviewingLeave, setReviewingLeave] = useState<LeaveRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Apply form state
  const [leaveFormData, setLeaveFormData] = useState({
    leaveType: 'annual' as 'annual' | 'sick' | 'casual' | 'unpaid' | 'maternity',
    startDate: '2026-11-02',
    endDate: '2026-11-04',
    totalDays: 3,
    reason: '',
  });

  const handleStartDateChange = (start: string) => {
    const end = leaveFormData.endDate;
    const diff = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)) + 1);
    setLeaveFormData({ ...leaveFormData, startDate: start, totalDays: isNaN(diff) ? 1 : diff });
  };

  const handleEndDateChange = (end: string) => {
    const start = leaveFormData.startDate;
    const diff = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)) + 1);
    setLeaveFormData({ ...leaveFormData, endDate: end, totalDays: isNaN(diff) ? 1 : diff });
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveFormData.reason.trim()) {
      showToast('Please state a reason for your leave request.');
      return;
    }

    applyLeave({
      leaveType: leaveFormData.leaveType,
      startDate: leaveFormData.startDate,
      endDate: leaveFormData.endDate,
      totalDays: Number(leaveFormData.totalDays),
      reason: leaveFormData.reason,
    });

    setIsApplyModalOpen(false);
    setLeaveFormData({
      leaveType: 'annual',
      startDate: '2026-11-02',
      endDate: '2026-11-04',
      totalDays: 3,
      reason: '',
    });
  };

  const handleExecuteReview = (action: 'approve' | 'reject') => {
    if (!reviewingLeave) return;
    reviewLeave(reviewingLeave._id, action, reviewRemarks || (action === 'approve' ? 'Approved as per company leave policy.' : 'Declined due to team coverage requirements.'));
    setReviewingLeave(null);
    setReviewRemarks('');
  };

  // Filter requests
  const filteredLeaves = leaves.filter(req => {
    const matchesSearch = 
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesType = leaveTypeFilter === 'All' || req.leaveType === leaveTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>StaffSync Workspace</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span>Leave Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leave Requests & Multi-Tier Approvals
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Automated quota tracking, two-step Manager and HR review pipelines, and entitlement auditing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Annual Paid Leave</span>
            <span className="text-[11px] font-mono">18 accrued</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {currentUser.leaveBalances.annual}
            </span>
            <span className="text-xs text-slate-500">days available</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, (currentUser.leaveBalances.annual / 18) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Medical / Sick Leave</span>
            <span className="text-[11px] font-mono">10 annual</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {currentUser.leaveBalances.sick}
            </span>
            <span className="text-xs text-slate-500">days available</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, (currentUser.leaveBalances.sick / 10) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Casual / Personal</span>
            <span className="text-[11px] font-mono">5 annual</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {currentUser.leaveBalances.casual}
            </span>
            <span className="text-xs text-slate-500">days available</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, (currentUser.leaveBalances.casual / 5) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Parental Entitlement</span>
            <span className="text-[11px] font-mono">Statutory</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {currentUser.leaveBalances.maternityPaternity}
            </span>
            <span className="text-xs text-slate-500">days allocated</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: '80%' }} />
          </div>
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
            placeholder="Search by requester, department, reason..."
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
            <option value="pending">Pending Initial Review</option>
            <option value="manager_approved">Manager Approved (Pending HR)</option>
            <option value="approved">Fully Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={leaveTypeFilter}
            onChange={(e) => setLeaveTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="All">All Leave Types</option>
            <option value="annual">Annual Paid</option>
            <option value="sick">Sick / Medical</option>
            <option value="casual">Casual</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Dates & Duration</th>
                <th className="py-3 px-4">Reason & Notes</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.map(leave => (
                <tr key={leave._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{leave.employeeName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {leave.employeeId} · {leave.department}
                    </div>
                  </td>

                  <td className="py-3 px-4 capitalize font-medium text-slate-800">
                    {leave.leaveType}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono tabular-nums text-slate-900 font-medium">
                      {leave.startDate} to {leave.endDate}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {leave.totalDays} business {leave.totalDays === 1 ? 'day' : 'days'}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-slate-700 line-clamp-2">{leave.reason}</p>
                    {leave.managerReview && (
                      <p className="text-[10px] text-blue-700 mt-1">
                        Mgr Review: {leave.managerReview.remarks} ({leave.managerReview.reviewedBy})
                      </p>
                    )}
                    {leave.hrReview && (
                      <p className="text-[10px] text-emerald-700 mt-0.5">
                        HR Review: {leave.hrReview.remarks} ({leave.hrReview.reviewedBy})
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                      leave.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : leave.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : leave.status === 'manager_approved'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {leave.status === 'manager_approved' ? 'Manager Approved' : leave.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {(currentRole === 'manager' || currentRole === 'hr') && 
                     leave.status !== 'approved' && leave.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => setReviewingLeave(leave)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-xs transition-colors"
                      >
                        Review Request
                      </button>
                    )}
                    {leave.status === 'approved' && (
                      <span className="text-slate-400 text-[11px]">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Apply for Leave */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Apply for Leave
                </h3>
                <p className="text-xs text-slate-500">
                  Submits request for manager evaluation and HR sign-off.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveFormData.leaveType}
                  onChange={e => setLeaveFormData({...leaveFormData, leaveType: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                >
                  <option value="annual">Annual Paid Leave (Balance: {currentUser.leaveBalances.annual} days)</option>
                  <option value="sick">Medical / Sick Leave (Balance: {currentUser.leaveBalances.sick} days)</option>
                  <option value="casual">Casual Leave (Balance: {currentUser.leaveBalances.casual} days)</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveFormData.startDate}
                    onChange={e => handleStartDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveFormData.endDate}
                    onChange={e => handleEndDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Calculated Business Days:</span>
                <span className="font-mono font-bold text-slate-900">{leaveFormData.totalDays} day(s)</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reason & Justification *</label>
                <textarea
                  rows={3}
                  required
                  value={leaveFormData.reason}
                  onChange={e => setLeaveFormData({...leaveFormData, reason: e.target.value})}
                  placeholder="Provide context for coverage and handover..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review Leave Request (Manager / HR) */}
      {reviewingLeave && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Review Leave Application
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluating request for {reviewingLeave.employeeName} ({reviewingLeave.department})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingLeave(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Leave Type:</span>
                  <span className="font-semibold text-slate-900 uppercase">{reviewingLeave.leaveType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested Period:</span>
                  <span className="font-mono tabular-nums text-slate-900">{reviewingLeave.startDate} to {reviewingLeave.endDate} ({reviewingLeave.totalDays}d)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted On:</span>
                  <span className="font-mono tabular-nums text-slate-700">{reviewingLeave.appliedOn}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Stated Justification:</span>
                  <p className="text-slate-800 italic">"{reviewingLeave.reason}"</p>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Evaluation Remarks / Decision Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewRemarks}
                  onChange={e => setReviewRemarks(e.target.value)}
                  placeholder="e.g. Approved. Project deliverables and sprint handover confirmed."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Reviewing as: <strong className="text-slate-900">{currentRole.toUpperCase()}</strong> ({currentUser.fullName})
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExecuteReview('reject')}
                    className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteReview('approve')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {currentRole === 'manager' ? 'Approve & Pass to HR' : 'Grant Final Approval'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { Employee, UserRole } from '../../types';
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Shield, 
  X, 
  Check,
  Edit2,
  Trash2,
  AlertTriangle,
  Building2
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { currentRole, employees, addEmployee, updateEmployee, deleteEmployee, showToast } = useStaffSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // New employee form state
  const [newEmpData, setNewEmpData] = useState({
    fullName: '',
    email: '',
    role: 'employee' as UserRole,
    designation: '',
    department: 'Engineering',
    reportingManagerName: 'Marcus Vance',
    joiningDate: '2026-10-28',
    salary: 95000,
    phone: '+1 (555) ',
    status: 'active' as const,
    skills: 'React, Node.js, TypeScript',
    emergencyName: '',
    emergencyRelationship: 'Spouse',
    emergencyPhone: '+1 (555) ',
  });

  const departments = ['All', 'People Operations', 'Engineering', 'Design', 'Marketing'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpData.fullName || !newEmpData.email || !newEmpData.designation) {
      showToast('Please fill out all required fields.');
      return;
    }

    const nextIdNum = 1000 + employees.length + 1;
    const employeeId = `EMP-${nextIdNum}`;

    addEmployee({
      employeeId,
      fullName: newEmpData.fullName,
      email: newEmpData.email,
      role: newEmpData.role,
      designation: newEmpData.designation,
      department: newEmpData.department,
      reportingManagerName: newEmpData.reportingManagerName,
      joiningDate: newEmpData.joiningDate,
      salary: Number(newEmpData.salary),
      phone: newEmpData.phone,
      status: newEmpData.status,
      avatarUrl: '',
      leaveBalances: {
        annual: 15,
        sick: 10,
        casual: 5,
        maternityPaternity: 30,
      },
      emergencyContact: {
        name: newEmpData.emergencyName || 'Primary Contact',
        relationship: newEmpData.emergencyRelationship,
        phone: newEmpData.emergencyPhone,
      },
      skills: newEmpData.skills.split(',').map(s => s.trim()).filter(Boolean),
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewEmpData({
      fullName: '',
      email: '',
      role: 'employee',
      designation: '',
      department: 'Engineering',
      reportingManagerName: 'Marcus Vance',
      joiningDate: '2026-10-28',
      salary: 95000,
      phone: '+1 (555) ',
      status: 'active',
      skills: 'React, Node.js, TypeScript',
      emergencyName: '',
      emergencyRelationship: 'Spouse',
      emergencyPhone: '+1 (555) ',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>StaffSync Workspace</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span>Employee Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Employee Directory & Workforce Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Centralized registry for staff records, role-based access levels, and department assignments.
          </p>
        </div>

        {currentRole === 'hr' ? (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Onboard New Employee
          </button>
        ) : (
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Role: <span className="font-semibold text-slate-800">{currentRole.toUpperCase()}</span> (Read-only directory access)
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, title, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Department segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
            {departments.map(dept => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  departmentFilter === dept
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="probation">Probation</option>
          </select>
        </div>
      </div>

      {/* High-density Employee Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No employees found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {emp.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">
                            {emp.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {emp.employeeId}
                    </td>

                    {/* Department & Role */}
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-medium">{emp.designation}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{emp.department}</span>
                        <span>·</span>
                        <span className="capitalize">{emp.role}</span>
                      </div>
                    </td>

                    {/* Joining Date */}
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {emp.joiningDate}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                        emp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : emp.status === 'on_leave'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : emp.status === 'probation'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedEmployee(emp)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          View Details
                        </button>
                        {currentRole === 'hr' && (
                          <button
                            type="button"
                            onClick={() => deleteEmployee(emp._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Archive Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Employee Details */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedEmployee.avatarUrl ? (
                  <img
                    src={selectedEmployee.avatarUrl}
                    alt={selectedEmployee.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-base text-slate-700">
                    {selectedEmployee.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedEmployee.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedEmployee.employeeId} · {selectedEmployee.designation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Core Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Department</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">System Access Role</span>
                  <span className="font-semibold text-slate-800 uppercase">{selectedEmployee.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <span className="font-mono text-slate-800">{selectedEmployee.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone Number</span>
                  <span className="font-mono text-slate-800">{selectedEmployee.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Joined Organization</span>
                  <span className="font-mono tabular-nums text-slate-800">{selectedEmployee.joiningDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Compensation (Base)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-800">
                    {currentRole === 'hr' ? `$${selectedEmployee.salary.toLocaleString()}/yr` : 'Confidential (HR Only)'}
                  </span>
                </div>
              </div>

              {/* Leave Balances */}
              <div>
                <span className="font-semibold text-slate-900 block mb-2">
                  Remaining Leave Balances
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 border border-slate-200 rounded-lg">
                    <span className="block text-[10px] text-slate-500">Annual</span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {selectedEmployee.leaveBalances.annual}
                    </span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded-lg">
                    <span className="block text-[10px] text-slate-500">Sick</span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {selectedEmployee.leaveBalances.sick}
                    </span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded-lg">
                    <span className="block text-[10px] text-slate-500">Casual</span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {selectedEmployee.leaveBalances.casual}
                    </span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded-lg">
                    <span className="block text-[10px] text-slate-500">Mat/Pat</span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {selectedEmployee.leaveBalances.maternityPaternity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <span className="font-semibold text-slate-900 block mb-1">
                  Emergency Contact
                </span>
                <p className="text-slate-600">
                  {selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relationship}) · <span className="font-mono">{selectedEmployee.emergencyContact.phone}</span>
                </p>
              </div>

              {/* Skills */}
              <div>
                <span className="font-semibold text-slate-900 block mb-1.5">
                  Core Competencies & Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmployee.skills.map(s => (
                    <span key={s} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Onboard New Employee (HR Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Onboard New Employee
                </h3>
                <p className="text-xs text-slate-500">
                  Register new organizational hire into MongoDB staff directory.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmpData.fullName}
                    onChange={e => setNewEmpData({...newEmpData, fullName: e.target.value})}
                    placeholder="e.g. Jordan Cruz"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmpData.email}
                    onChange={e => setNewEmpData({...newEmpData, email: e.target.value})}
                    placeholder="jordan.cruz@staffsync.io"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Job Designation *</label>
                  <input
                    type="text"
                    required
                    value={newEmpData.designation}
                    onChange={e => setNewEmpData({...newEmpData, designation: e.target.value})}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={newEmpData.department}
                    onChange={e => setNewEmpData({...newEmpData, department: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="People Operations">People Operations</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Access Role</label>
                  <select
                    value={newEmpData.role}
                    onChange={e => setNewEmpData({...newEmpData, role: e.target.value as UserRole})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Salary ($ USD)</label>
                  <input
                    type="number"
                    value={newEmpData.salary}
                    onChange={e => setNewEmpData({...newEmpData, salary: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={newEmpData.joiningDate}
                    onChange={e => setNewEmpData({...newEmpData, joiningDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newEmpData.phone}
                  onChange={e => setNewEmpData({...newEmpData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={newEmpData.emergencyName}
                    onChange={e => setNewEmpData({...newEmpData, emergencyName: e.target.value})}
                    placeholder="e.g. Maria Cruz"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={newEmpData.emergencyPhone}
                    onChange={e => setNewEmpData({...newEmpData, emergencyPhone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Technical Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newEmpData.skills}
                  onChange={e => setNewEmpData({...newEmpData, skills: e.target.value})}
                  placeholder="React, TypeScript, GraphQL"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Confirm & Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

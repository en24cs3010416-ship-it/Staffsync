import React, { useState } from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { TrainingProgram } from '../../types';
import { 
  GraduationCap, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Users, 
  Award, 
  X, 
  ChevronRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';

export const TrainingView: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    trainings, 
    employees, 
    createTrainingProgram, 
    updateTrainingProgress, 
    enrollInTraining,
    showToast 
  } = useStaffSync();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  // New program state
  const [newProgData, setNewProgData] = useState({
    title: '',
    category: 'Engineering' as TrainingProgram['category'],
    description: '',
    instructor: currentUser.fullName,
    durationWeeks: 4,
    totalModules: 8,
    startDate: '2026-11-10',
  });

  const categories = ['All', 'Engineering', 'Leadership', 'Security & Compliance', 'Product & Design', 'Soft Skills'];

  const filteredTrainings = trainings.filter(t => 
    categoryFilter === 'All' || t.category === categoryFilter
  );

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgData.title.trim()) {
      showToast('Please enter a title for the training course.');
      return;
    }

    createTrainingProgram({
      title: newProgData.title,
      category: newProgData.category,
      description: newProgData.description,
      instructor: newProgData.instructor,
      durationWeeks: Number(newProgData.durationWeeks),
      status: 'in_progress',
      totalModules: Number(newProgData.totalModules),
      startDate: newProgData.startDate,
      enrolledEmployees: [],
    });

    setIsCreateModalOpen(false);
    setNewProgData({
      title: '',
      category: 'Engineering',
      description: '',
      instructor: currentUser.fullName,
      durationWeeks: 4,
      totalModules: 8,
      startDate: '2026-11-10',
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
            <span>Learning & Development (L&D)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Training & Skill Development Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manager-curated upskilling programs, milestone progress tracking, and compliance certifications.
          </p>
        </div>

        {(currentRole === 'manager' || currentRole === 'hr') && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Training Program
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Training Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrainings.map(prog => {
          const isUserEnrolled = prog.enrolledEmployees.some(e => e.employeeId === currentUser.employeeId);
          const userEnrollment = prog.enrolledEmployees.find(e => e.employeeId === currentUser.employeeId);

          return (
            <div
              key={prog._id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {prog.category}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    {prog.durationWeeks} weeks · {prog.totalModules} modules
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {prog.title}
                </h3>
                
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Instructor: <strong className="text-slate-800">{prog.instructor}</strong></span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prog.enrolledEmployees.length} enrolled</span>
                  </span>
                </div>

                {/* If user is enrolled: progress bar */}
                {isUserEnrolled && userEnrollment && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-800">Your Course Progress</span>
                      <span className="font-mono font-bold text-slate-900">{userEnrollment.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${userEnrollment.progressPercentage}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Status: <strong className="capitalize text-slate-700">{userEnrollment.completionStatus.replace('_', ' ')}</strong>
                      </span>
                      {userEnrollment.progressPercentage < 100 ? (
                        <button
                          type="button"
                          onClick={() => updateTrainingProgress(prog._id, currentUser.employeeId, userEnrollment.progressPercentage + 15)}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                        >
                          + Advance Next Module →
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Certificate Earned
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(prog)}
                  className="text-xs text-slate-700 font-semibold hover:text-slate-900 flex items-center gap-1"
                >
                  Manage Roster & Syllabus <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {!isUserEnrolled ? (
                  <button
                    type="button"
                    onClick={() => enrollInTraining(prog._id, currentUser.employeeId)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Self-Enroll
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">
                    Enrolled
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Program Details & Roster Manager */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                  {selectedProgram.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedProgram.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <p className="text-slate-600 leading-relaxed">
                {selectedProgram.description}
              </p>

              {/* Enrolled Team Members */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">
                    Enrolled Staff & Progress Roster ({selectedProgram.enrolledEmployees.length})
                  </h4>
                  {(currentRole === 'manager' || currentRole === 'hr') && (
                    <span className="text-[11px] text-slate-500">
                      Manager can adjust progress below
                    </span>
                  )}
                </div>

                {selectedProgram.enrolledEmployees.length === 0 ? (
                  <p className="text-slate-500 py-3 text-center bg-slate-50 rounded-lg">
                    No employees enrolled in this cohort yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedProgram.enrolledEmployees.map(enroll => (
                      <div key={enroll.employeeId} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-slate-900">
                            {enroll.employeeName} ({enroll.employeeId})
                          </span>
                          <span className="font-mono font-bold text-slate-800">
                            {enroll.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${enroll.progressPercentage}%` }}
                          />
                        </div>

                        {(currentRole === 'manager' || currentRole === 'hr') && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">Adjust progress:</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateTrainingProgress(selectedProgram._id, enroll.employeeId, Math.max(0, enroll.progressPercentage - 25))}
                                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] hover:bg-slate-100"
                              >
                                -25%
                              </button>
                              <button
                                type="button"
                                onClick={() => updateTrainingProgress(selectedProgram._id, enroll.employeeId, Math.min(100, enroll.progressPercentage + 25))}
                                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] hover:bg-slate-100"
                              >
                                +25%
                              </button>
                              <button
                                type="button"
                                onClick={() => updateTrainingProgress(selectedProgram._id, enroll.employeeId, 100)}
                                className="px-2 py-0.5 bg-slate-900 text-white rounded text-[11px] hover:bg-slate-800"
                              >
                                Mark 100%
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add staff to training (Manager/HR) */}
              {(currentRole === 'manager' || currentRole === 'hr') && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-2">
                    Enroll Another Team Member
                  </span>
                  <div className="flex gap-2">
                    <select
                      id="rosterEnrollSelect"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      {employees.map(e => (
                        <option key={e._id} value={e.employeeId}>
                          {e.fullName} ({e.employeeId}) - {e.department}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const sel = document.getElementById('rosterEnrollSelect') as HTMLSelectElement;
                        if (sel && sel.value) {
                          enrollInTraining(selectedProgram._id, sel.value);
                          const updated = trainings.find(t => t._id === selectedProgram._id);
                          if (updated) setSelectedProgram(updated);
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                    >
                      Enroll Staff
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Training Program */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create Training & Development Course
                </h3>
                <p className="text-xs text-slate-500">
                  Curate team learning modules, assign mentors, and schedule cohorts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newProgData.title}
                  onChange={e => setNewProgData({...newProgData, title: e.target.value})}
                  placeholder="e.g. Advanced TypeScript & Clean Architecture"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newProgData.category}
                    onChange={e => setNewProgData({...newProgData, category: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Security & Compliance">Security & Compliance</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Instructor / Lead</label>
                  <input
                    type="text"
                    value={newProgData.instructor}
                    onChange={e => setNewProgData({...newProgData, instructor: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={newProgData.durationWeeks}
                    onChange={e => setNewProgData({...newProgData, durationWeeks: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Total Modules</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newProgData.totalModules}
                    onChange={e => setNewProgData({...newProgData, totalModules: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Curriculum & Objectives</label>
                <textarea
                  rows={3}
                  value={newProgData.description}
                  onChange={e => setNewProgData({...newProgData, description: e.target.value})}
                  placeholder="Outline topics covered, prerequisites, and learning objectives..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Launch Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

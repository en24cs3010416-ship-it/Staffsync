import React, { useState } from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { Announcement } from '../../types';
import { 
  Megaphone, 
  Plus, 
  Search, 
  CheckCheck, 
  AlertTriangle, 
  Calendar, 
  Users, 
  X, 
  ShieldAlert,
  BellRing
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    announcements, 
    postAnnouncement, 
    acknowledgeAnnouncement, 
    showToast 
  } = useStaffSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New announcement form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General' as Announcement['category'],
    priority: 'normal' as Announcement['priority'],
    targetDepartment: 'All',
  });

  const categories = ['All', 'General', 'Policy', 'Urgent', 'Event', 'Benefits'];

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.postedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = categoryFilter === 'All' || ann.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Please provide both title and announcement content.');
      return;
    }

    const todayStr = '2026-10-28';
    postAnnouncement({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      priority: formData.priority,
      targetDepartment: formData.targetDepartment,
      postedBy: {
        name: currentUser.fullName,
        role: currentUser.designation,
      },
      publishedDate: todayStr,
    });

    setIsPostModalOpen(false);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'normal',
      targetDepartment: 'All',
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
            <span>Communications & Bulletins</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Company Notices & Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Official company news, policy revisions, open enrollments, and town hall schedules.
          </p>
        </div>

        {currentRole === 'hr' ? (
          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Publish Announcement
          </button>
        ) : (
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            HR Broadcast Channel · Read & Acknowledge
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
            placeholder="Search bulletins, policies, authors..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.map(ann => {
          const isAcknowledged = ann.acknowledgedBy.includes(currentUser.employeeId);

          return (
            <div
              key={ann._id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : ann.priority === 'high'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    Target: <strong className="text-slate-700">{ann.targetDepartment}</strong>
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-mono tabular-nums">{ann.publishedDate}</span>
                  <span>·</span>
                  <span>Posted by <strong className="text-slate-800">{ann.postedBy.name}</strong> ({ann.postedBy.role})</span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>{ann.readCount} views</span>
                  <span>·</span>
                  <span>{ann.acknowledgedBy.length} employees acknowledged</span>
                </div>

                <div>
                  {isAcknowledged ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCheck className="w-3.5 h-3.5" />
                      Acknowledged by You
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => acknowledgeAnnouncement(ann._id)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Acknowledge Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Publish Announcement (HR Only) */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Publish Company Announcement
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast updates to company news feed and employee dashboards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Q4 Company All-Hands & Performance Rewards"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Policy">Policy</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Event">Event</option>
                    <option value="Benefits">Benefits</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target</label>
                  <select
                    value={formData.targetDepartment}
                    onChange={e => setFormData({...formData, targetDepartment: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="All">All Staff</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="People Operations">People Operations</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Announcement Body *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Detail the bulletin information, instructions, deadlines, or links..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Broadcast Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

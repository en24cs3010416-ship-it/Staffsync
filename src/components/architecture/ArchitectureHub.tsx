import React, { useState } from 'react';
import { DocSubTab } from '../../types';
import { 
  Database, 
  Layers, 
  Users, 
  CheckSquare, 
  Cpu, 
  GitFork, 
  Key, 
  ArrowRight, 
  Code2, 
  Copy, 
  Check, 
  Server, 
  Laptop, 
  ShieldCheck, 
  CalendarCheck2, 
  GraduationCap, 
  Megaphone,
  Clock,
  Sparkles
} from 'lucide-react';

export const ArchitectureHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<DocSubTab>('er_diagram');
  const [selectedEntity, setSelectedEntity] = useState<string>('Employee');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeLifecycleStep, setActiveLifecycleStep] = useState(0);

  const subTabs = [
    { id: 'er_diagram' as DocSubTab, label: 'ER Diagram', icon: Database },
    { id: 'mvc_pattern' as DocSubTab, label: 'MVC Pattern & MERN', icon: Layers },
    { id: 'roles_matrix' as DocSubTab, label: 'Roles & Responsibilities', icon: Users },
    { id: 'features' as DocSubTab, label: 'Features Catalog', icon: CheckSquare },
    { id: 'tech_architecture' as DocSubTab, label: 'Technical Architecture', icon: Cpu },
    { id: 'user_flows' as DocSubTab, label: 'User Flow Diagrams', icon: GitFork },
  ];

  // Schema definitions for ER Diagram
  const entities = [
    {
      name: 'Employee',
      collection: 'employees',
      description: 'Central user identity, personal credentials, role permissions, and compensation data.',
      fields: [
        { name: '_id', type: 'ObjectId', key: 'PK', desc: 'Unique MongoDB identifier' },
        { name: 'employeeId', type: 'String', key: 'UK', desc: 'Enterprise serial code (e.g. EMP-1002)' },
        { name: 'fullName', type: 'String', desc: 'Legal full name' },
        { name: 'email', type: 'String', key: 'UK', desc: 'Corporate email address' },
        { name: 'role', type: 'Enum', desc: "'hr' | 'manager' | 'employee'" },
        { name: 'department', type: 'String', key: 'FK', desc: 'Assigned organizational department' },
        { name: 'designation', type: 'String', desc: 'Job title and operational band' },
        { name: 'reportingManagerId', type: 'ObjectId', key: 'FK', desc: 'References Employee._id (Supervisor)' },
        { name: 'joiningDate', type: 'Date', desc: 'First official employment date' },
        { name: 'salary', type: 'Number', desc: 'Annual base compensation (confidential)' },
        { name: 'status', type: 'Enum', desc: "'active' | 'on_leave' | 'probation' | 'inactive'" },
        { name: 'leaveBalances', type: 'Object', desc: '{ annual: Number, sick: Number, casual: Number }' },
      ],
      relations: [
        { target: 'AttendanceRecord', type: '1 : N', desc: 'One employee logs multiple daily attendance punches' },
        { target: 'LeaveRequest', type: '1 : N', desc: 'One employee submits multiple leave applications' },
        { target: 'TrainingProgram', type: 'M : N', desc: 'Employees enroll in various training cohorts' },
        { target: 'Announcement', type: '1 : N (HR)', desc: 'HR employees author company announcements' },
      ],
      schemaCode: `// Mongoose Schema: models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ['hr', 'manager', 'employee'], default: 'employee' },
  department: { type: String, required: true, index: true },
  designation: { type: String, required: true },
  reportingManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  joiningDate: { type: Date, default: Date.now },
  salary: { type: Number, required: true },
  status: { type: String, enum: ['active', 'on_leave', 'probation', 'inactive'], default: 'active' },
  leaveBalances: {
    annual: { type: Number, default: 18 },
    sick: { type: Number, default: 10 },
    casual: { type: Number, default: 5 },
    maternityPaternity: { type: Number, default: 30 }
  },
  skills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);`,
    },
    {
      name: 'AttendanceRecord',
      collection: 'attendance_records',
      description: 'Daily timestamps, work mode, geolocation coordinates, and total shift duration.',
      fields: [
        { name: '_id', type: 'ObjectId', key: 'PK', desc: 'Record identifier' },
        { name: 'employeeId', type: 'String', key: 'FK', desc: 'Foreign key to Employee.employeeId' },
        { name: 'date', type: 'String', key: 'IDX', desc: 'Shift date (YYYY-MM-DD)' },
        { name: 'checkInTime', type: 'String', desc: 'Punch in time formatted' },
        { name: 'checkOutTime', type: 'String', desc: 'Punch out time formatted' },
        { name: 'totalHours', type: 'Number', desc: 'Calculated billable shift duration' },
        { name: 'workMode', type: 'Enum', desc: "'office' | 'remote' | 'field'" },
        { name: 'status', type: 'Enum', desc: "'present' | 'late' | 'half_day' | 'absent'" },
        { name: 'location', type: 'String', desc: 'Geofenced office branch or IP location' },
      ],
      relations: [
        { target: 'Employee', type: 'N : 1', desc: 'Each attendance punch belongs to one employee' },
      ],
      schemaCode: `// Mongoose Schema: models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, index: true, ref: 'Employee' },
  employeeName: { type: String, required: true },
  department: { type: String, required: true },
  date: { type: String, required: true, index: true },
  checkInTime: { type: String, required: true },
  checkOutTime: { type: String },
  totalHours: { type: Number },
  status: { type: String, enum: ['present', 'late', 'half_day', 'absent'], default: 'present' },
  workMode: { type: String, enum: ['office', 'remote', 'field'], default: 'office' },
  location: { type: String, required: true }
}, { timestamps: true });

// Compound index for fast date + employee lookups
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);`,
    },
    {
      name: 'LeaveRequest',
      collection: 'leave_requests',
      description: 'Absence requests, leave quotas, dual-stage approvals (Manager & HR), and remarks.',
      fields: [
        { name: '_id', type: 'ObjectId', key: 'PK', desc: 'Leave request identifier' },
        { name: 'employeeId', type: 'String', key: 'FK', desc: 'Foreign key to Employee' },
        { name: 'leaveType', type: 'Enum', desc: "'annual' | 'sick' | 'casual' | 'unpaid'" },
        { name: 'startDate', type: 'String', desc: 'First day of leave' },
        { name: 'endDate', type: 'String', desc: 'Last day of leave' },
        { name: 'totalDays', type: 'Number', desc: 'Total business days requested' },
        { name: 'reason', type: 'String', desc: 'Employee justification text' },
        { name: 'status', type: 'Enum', desc: "'pending' | 'manager_approved' | 'approved' | 'rejected'" },
        { name: 'managerReview', type: 'SubDoc', desc: '{ reviewedBy, reviewedAt, status, remarks }' },
        { name: 'hrReview', type: 'SubDoc', desc: '{ reviewedBy, reviewedAt, status, remarks }' },
      ],
      relations: [
        { target: 'Employee', type: 'N : 1', desc: 'Associated employee requester' },
      ],
      schemaCode: `// Mongoose Schema: models/LeaveRequest.js
const mongoose = require('mongoose');

const reviewSubSchema = new mongoose.Schema({
  reviewedBy: { type: String, required: true },
  reviewedAt: { type: String, default: () => new Date().toISOString() },
  status: { type: String, enum: ['approved', 'rejected'], required: true },
  remarks: { type: String, trim: true }
}, { _id: false });

const leaveRequestSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, index: true },
  employeeName: { type: String, required: true },
  department: { type: String, required: true },
  leaveType: { type: String, enum: ['annual', 'sick', 'casual', 'unpaid', 'maternity'], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalDays: { type: Number, required: true, min: 1 },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'manager_approved', 'approved', 'rejected'], 
    default: 'pending',
    index: true 
  },
  managerReview: reviewSubSchema,
  hrReview: reviewSubSchema
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);`,
    },
    {
      name: 'TrainingProgram',
      collection: 'training_programs',
      description: 'L&D courses curated by managers with milestone percentages and certifications.',
      fields: [
        { name: '_id', type: 'ObjectId', key: 'PK', desc: 'Program identifier' },
        { name: 'title', type: 'String', desc: 'Course title and syllabus' },
        { name: 'category', type: 'String', desc: 'Domain (Engineering, Leadership, etc.)' },
        { name: 'instructor', type: 'String', desc: 'Course mentor / external lead' },
        { name: 'durationWeeks', type: 'Number', desc: 'Curriculum length' },
        { name: 'totalModules', type: 'Number', desc: 'Total modules required' },
        { name: 'enrolledEmployees', type: 'Array', desc: 'Subdocuments with progress %' },
        { name: 'status', type: 'Enum', desc: "'upcoming' | 'in_progress' | 'completed'" },
      ],
      relations: [
        { target: 'Employee', type: 'M : N', desc: 'Many employees enrolled in training cohorts' },
      ],
      schemaCode: `// Mongoose Schema: models/TrainingProgram.js
const mongoose = require('mongoose');

const enrollmentSubSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  completionStatus: { type: String, enum: ['enrolled', 'in_progress', 'completed'], default: 'enrolled' },
  lastUpdated: { type: String }
}, { _id: false });

const trainingProgramSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  durationWeeks: { type: Number, required: true },
  totalModules: { type: Number, required: true },
  status: { type: String, enum: ['upcoming', 'in_progress', 'completed'], default: 'in_progress' },
  enrolledEmployees: [enrollmentSubSchema]
}, { timestamps: true });

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);`,
    },
    {
      name: 'Announcement',
      collection: 'announcements',
      description: 'Company-wide notices, policy releases, and employee acknowledgement registry.',
      fields: [
        { name: '_id', type: 'ObjectId', key: 'PK', desc: 'Announcement identifier' },
        { name: 'title', type: 'String', desc: 'Headline announcement' },
        { name: 'content', type: 'String', desc: 'Full bulletin body' },
        { name: 'category', type: 'Enum', desc: "'General' | 'Policy' | 'Urgent' | 'Event' | 'Benefits'" },
        { name: 'priority', type: 'Enum', desc: "'normal' | 'high' | 'urgent'" },
        { name: 'targetDepartment', type: 'String', desc: "'All' or specific department" },
        { name: 'postedBy', type: 'Object', desc: '{ name, role }' },
        { name: 'acknowledgedBy', type: 'Array', desc: 'List of Employee IDs who read the notice' },
      ],
      relations: [
        { target: 'Employee', type: 'N : 1', desc: 'Posted by HR Personnel' },
      ],
      schemaCode: `// Mongoose Schema: models/Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'Policy', 'Urgent', 'Event', 'Benefits'], default: 'General' },
  priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
  targetDepartment: { type: String, default: 'All' },
  postedBy: {
    name: { type: String, required: true },
    role: { type: String, required: true }
  },
  publishedDate: { type: String, required: true },
  readCount: { type: Number, default: 0 },
  acknowledgedBy: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);`,
    }
  ];

  const currentEntityData = entities.find(e => e.name === selectedEntity) || entities[0];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>StaffSync Engineering</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span>Architecture & Specifications Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Architecture, ER Diagrams & MVC Specifications
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Full-stack engineering blueprints for the StaffSync MERN (MongoDB, Express, React, Node.js) platform.
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: ER DIAGRAM */}
      {activeSubTab === 'er_diagram' && (
        <div className="space-y-6">
          {/* Visual Schema Topology */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive Entity-Relationship Database Topology (MongoDB)
                </h3>
                <p className="text-xs text-slate-500">
                  Click any entity card to inspect its fields, indexes, and Mongoose ODM schema definitions.
                </p>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Engine: MongoDB 7.0 / Mongoose ODM
              </div>
            </div>

            {/* Entity Node Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {entities.map(ent => (
                <button
                  key={ent.name}
                  type="button"
                  onClick={() => setSelectedEntity(ent.name)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    selectedEntity === ent.name
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold">{ent.name}</span>
                    <Database className={`w-3.5 h-3.5 ${selectedEntity === ent.name ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div className={`text-[10px] font-mono ${selectedEntity === ent.name ? 'text-slate-300' : 'text-slate-500'}`}>
                    col: {ent.collection}
                  </div>
                  <div className={`text-[11px] mt-2 line-clamp-2 ${selectedEntity === ent.name ? 'text-slate-200' : 'text-slate-600'}`}>
                    {ent.fields.length} schema attributes
                  </div>
                </button>
              ))}
            </div>

            {/* Cardinality Connectors Summary */}
            <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-4">
              <span className="font-semibold text-slate-900">Key Relationships:</span>
              <span className="font-mono text-[11px]">Employee (1) ──(1:N)──&gt; AttendanceRecord</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-[11px]">Employee (1) ──(1:N)──&gt; LeaveRequest</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-[11px]">Employee (N) ──(M:N)──&gt; TrainingProgram</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-[11px]">Employee (Supervisor) ──(1:N)──&gt; Employee (Direct Report)</span>
            </div>
          </div>

          {/* Drilldown: Fields Table & Mongoose Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fields and Attributes */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Collection Schema: <span className="font-mono text-indigo-600">{currentEntityData.name}</span>
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {currentEntityData.fields.length} fields
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3">
                {currentEntityData.description}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Field</th>
                      <th className="py-2 px-3">BSON Type</th>
                      <th className="py-2 px-3">Constraint</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {currentEntityData.fields.map(f => (
                      <tr key={f.name} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {f.name}
                        </td>
                        <td className="py-2 px-3 text-indigo-600">
                          {f.type}
                        </td>
                        <td className="py-2 px-3">
                          {f.key && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              f.key === 'PK' ? 'bg-amber-100 text-amber-800' :
                              f.key === 'UK' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {f.key}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-600 text-xs">
                          {f.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Entity Relations */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-800 block mb-2">
                  Cardinality & Foreign Keys:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {currentEntityData.relations.map(rel => (
                    <li key={rel.target} className="flex items-center gap-2">
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {rel.type}
                      </span>
                      <strong className="text-slate-900">{rel.target}:</strong>
                      <span>{rel.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Code Viewer: Mongoose ODM Schema */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 shadow-xs flex flex-col justify-between text-slate-100">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      models/{currentEntityData.name}.js
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(currentEntityData.schemaCode)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Schema'}</span>
                  </button>
                </div>

                <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-900/60 rounded-lg leading-relaxed max-h-[440px]">
                  <code>{currentEntityData.schemaCode}</code>
                </pre>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Indexes: Automated compound indexing on active query paths</span>
                <span className="text-emerald-400 font-mono">BSON Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MVC PATTERN & MERN BLUEPRINT */}
      {activeSubTab === 'mvc_pattern' && (
        <div className="space-y-6">
          {/* MERN Architecture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-3">
                M
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Model Layer (Mongoose & MongoDB)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Represents organizational entities, schema constraints, validation rules, indexing strategies, and automated hooks (e.g. leave quota deductions, status mutations).
              </p>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[11px] text-slate-700 space-y-1">
                <div>📁 server/models/Employee.js</div>
                <div>📁 server/models/LeaveRequest.js</div>
                <div>📁 server/models/Attendance.js</div>
                <div>📁 server/models/Training.js</div>
              </div>
            </div>

            {/* View Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-base mb-3">
                V
              </div>
              <h3 className="text-base font-bold text-slate-900">
                View Layer (React 19 & Tailwind CSS)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Declarative component hierarchy built with React 19, Motion micro-interactions, responsive Tailwind typography, and role-conditioned workspace layouts.
              </p>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[11px] text-slate-700 space-y-1">
                <div>📁 src/components/dashboard/</div>
                <div>📁 src/components/employees/</div>
                <div>📁 src/components/leaves/</div>
                <div>📁 src/components/attendance/</div>
              </div>
            </div>

            {/* Controller Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-base mb-3">
                C
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Controller Layer (Express & Node.js)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                RESTful endpoint routers, RBAC authorization guards, business logic processors, payload sanitizers, and centralized error handlers.
              </p>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[11px] text-slate-700 space-y-1">
                <div>📁 server/controllers/leaveController.js</div>
                <div>📁 server/controllers/authController.js</div>
                <div>📁 server/controllers/attendanceController.js</div>
                <div>📁 server/middleware/authRole.js</div>
              </div>
            </div>
          </div>

          {/* Interactive Request-Response Lifecycle Tracer */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive Request-Response Lifecycle Tracer
                </h3>
                <p className="text-xs text-slate-500">
                  Follow an incoming HRMS request: <code className="font-mono font-semibold text-slate-800">POST /api/leaves/apply</code> through each architectural tier.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                Step {activeLifecycleStep + 1} of 5
              </span>
            </div>

            {/* Timeline Stepper */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[
                { title: '1. View Action', desc: 'React Form Click' },
                { title: '2. Express Route', desc: 'Endpoint & JWT Auth' },
                { title: '3. Controller Logic', desc: 'Quota & RBAC Check' },
                { title: '4. Mongoose Model', desc: 'MongoDB BSON Write' },
                { title: '5. Client Update', desc: 'Optimistic UI State' }
              ].map((step, idx) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveLifecycleStep(idx)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    activeLifecycleStep === idx
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold text-xs">{step.title}</div>
                  <div className={`text-[10px] mt-0.5 ${activeLifecycleStep === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Detail Box for Active Step */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              {activeLifecycleStep === 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Step 1: User Submits Leave Application in React View</div>
                  <p className="text-slate-600 leading-relaxed">
                    The employee fills out the leave application form in <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">src/components/leaves/LeavesView.tsx</code>. Client-side validation verifies that date boundaries are valid and justification is provided. React dispatches an HTTP POST payload with Bearer authentication token.
                  </p>
                  <div className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto">
                    {`fetch('/api/leaves/apply', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  body: JSON.stringify({ leaveType: 'annual', startDate: '2026-11-09', endDate: '2026-11-13', totalDays: 5, reason: 'Conference' })
});`}
                  </div>
                </div>
              )}

              {activeLifecycleStep === 1 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Step 2: Express Router & Authentication Guard</div>
                  <p className="text-slate-600 leading-relaxed">
                    The Express router intercepts the request at <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">/api/leaves/apply</code>. The <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">verifyToken</code> middleware decodes the JWT, extracts user ID and role, and attaches it to <code className="font-mono">req.user</code>.
                  </p>
                  <div className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto">
                    {`// routes/leaveRoutes.js
router.post('/apply', verifyToken, checkRole(['employee', 'manager', 'hr']), leaveController.applyLeave);`}
                  </div>
                </div>
              )}

              {activeLifecycleStep === 2 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Step 3: Controller Executes Business Logic & Quota Verification</div>
                  <p className="text-slate-600 leading-relaxed">
                    <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">leaveController.applyLeave</code> fetches the employee's current quota balance from the database, ensures <code className="font-mono">requestedDays &lt;= availableBalance</code>, and constructs a pending LeaveRequest document with initial status <code className="font-mono">'pending'</code>.
                  </p>
                  <div className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto">
                    {`// controllers/leaveController.js
const employee = await Employee.findOne({ employeeId: req.user.employeeId });
if (employee.leaveBalances[leaveType] < totalDays) {
  return res.status(400).json({ error: 'Insufficient leave balance quota.' });
}`}
                  </div>
                </div>
              )}

              {activeLifecycleStep === 3 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Step 4: Mongoose Model Commits to MongoDB Replica Set</div>
                  <p className="text-slate-600 leading-relaxed">
                    Mongoose casts fields into BSON types, evaluates schema constraints, and executes an atomic write transaction to the <code className="font-mono">leave_requests</code> collection. The primary key <code className="font-mono">_id</code> is assigned and index trees are updated.
                  </p>
                  <div className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto">
                    {`const newLeave = await LeaveRequest.create({
  employeeId: req.user.employeeId,
  employeeName: req.user.fullName,
  department: req.user.department,
  leaveType, startDate, endDate, totalDays, reason, status: 'pending'
});`}
                  </div>
                </div>
              )}

              {activeLifecycleStep === 4 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Step 5: JSON Response Dispatched & React View Optimistically Updates</div>
                  <p className="text-slate-600 leading-relaxed">
                    Express sends an HTTP 201 Created JSON response. React Context catches the created object, updates the in-memory array, renders a success notification toast, and immediately notifies the assigned manager's review queue.
                  </p>
                  <div className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto">
                    {`res.status(201).json({ success: true, message: 'Leave request registered.', data: newLeave });`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ROLES & RESPONSIBILITIES MATRIX */}
      {activeSubTab === 'roles_matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                StaffSync Roles & Responsibilities Matrix (RACI Governance)
              </h3>
              <p className="text-xs text-slate-500">
                Operational authority and clearance levels across HR Personnel, Department Managers, and Staff Employees.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">HR & Operational Lifecycle Module</th>
                    <th className="py-3 px-4">HR Personnel (Sarah Lin)</th>
                    <th className="py-3 px-4">Department Manager (Marcus Vance)</th>
                    <th className="py-3 px-4">Staff Employee (Elena Rostova)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    {
                      module: 'Employee Directory & Onboarding',
                      hr: 'Accountable (Full CRUD & Provisioning)',
                      manager: 'Consulted (View department reports)',
                      emp: 'Informed (View company directory)',
                    },
                    {
                      module: 'Daily Attendance Punch & Geofence',
                      hr: 'Accountable (Audit & manual overrides)',
                      manager: 'Informed (View team presence)',
                      emp: 'Responsible (Self clock-in & out)',
                    },
                    {
                      module: 'Leave Application Submission',
                      hr: 'Responsible (Self apply)',
                      manager: 'Responsible (Self apply)',
                      emp: 'Responsible (Self apply)',
                    },
                    {
                      module: 'Leave Request Evaluation (Tier 1)',
                      hr: 'Consulted (Policy escalation)',
                      manager: 'Responsible (Approve or Reject team)',
                      emp: 'Informed (Track application status)',
                    },
                    {
                      module: 'Leave Policy Final Sign-Off (Tier 2)',
                      hr: 'Accountable (Deduct quota & execute)',
                      manager: 'Informed (Receives final decision)',
                      emp: 'Informed (Receives confirmation)',
                    },
                    {
                      module: 'L&D Training Program Creation',
                      hr: 'Consulted (Compliance courses)',
                      manager: 'Responsible (Create & assign courses)',
                      emp: 'Informed (Browse catalog)',
                    },
                    {
                      module: 'Training Progress & Module Advance',
                      hr: 'Informed (Audit certificates)',
                      manager: 'Accountable (Grade & adjust progress)',
                      emp: 'Responsible (Complete modules)',
                    },
                    {
                      module: 'Company Bulletins & Announcements',
                      hr: 'Accountable (Author & broadcast)',
                      manager: 'Informed (Read & acknowledge)',
                      emp: 'Responsible (Read & acknowledge)',
                    },
                    {
                      module: 'Compensation & Payroll Records',
                      hr: 'Accountable (Access & manage salaries)',
                      manager: 'Consulted (Appraisal feedback)',
                      emp: 'Informed (Personal payslips)',
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {row.module}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {row.hr}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {row.manager}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {row.emp}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FEATURES CATALOG */}
      {activeSubTab === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Core HR & Employee Directory',
              icon: Users,
              color: 'text-indigo-600 bg-indigo-50',
              points: [
                'Complete digital employee registry with unique IDs',
                'Emergency contact and skills repository',
                'HR onboarding modal with role assignments',
                'Department-based filtering & instant search'
              ]
            },
            {
              title: 'Smart Leave Management',
              icon: CalendarCheck2,
              color: 'text-emerald-600 bg-emerald-50',
              points: [
                'Automated leave balance ledger (Annual, Sick, Casual)',
                'Business day calculator excluding holidays',
                'Two-tier approval pipeline (Manager -> HR)',
                'Automated balance deduction upon approval'
              ]
            },
            {
              title: 'Time & Attendance Tracking',
              icon: Clock,
              color: 'text-blue-600 bg-blue-50',
              points: [
                'One-touch Clock-In and Clock-Out recording',
                'Work mode selection (In-Office vs Remote vs Field)',
                'Late arrival and anomaly tracking flags',
                'One-click CSV attendance logs export'
              ]
            },
            {
              title: 'Learning & Development (L&D)',
              icon: GraduationCap,
              color: 'text-purple-600 bg-purple-50',
              points: [
                'Manager-curated upskilling programs',
                'Milestone percentage tracker per employee',
                'Module completion certificates',
                'Self-enrollment & roster management'
              ]
            },
            {
              title: 'Company Communications Feed',
              icon: Megaphone,
              color: 'text-amber-600 bg-amber-50',
              points: [
                'HR company-wide broadcast publishing',
                'Urgency and priority flags (Urgent, High, Normal)',
                'Targeted department dissemination',
                'Employee read & acknowledgement signatures'
              ]
            },
            {
              title: 'Role-Based Access Control (RBAC)',
              icon: ShieldCheck,
              color: 'text-slate-700 bg-slate-100',
              points: [
                'Distinct HR, Manager, and Employee security clearance',
                'Confidential salary encryption and viewing limits',
                'Audit logging for manual attendance overrides',
                'Persistent state across browser sessions'
              ]
            }
          ].map(feat => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className={`w-9 h-9 rounded-lg ${feat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {feat.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 5: TECHNICAL ARCHITECTURE */}
      {activeSubTab === 'tech_architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-base font-bold text-slate-900">
                StaffSync Full-Stack Technical Architecture (MERN)
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end data flow between Client Presentation, Express API, Business Logic Services, and MongoDB Storage.
              </p>
            </div>

            {/* Architecture Stack Diagram */}
            <div className="space-y-4">
              {/* Tier 1: Client */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-xs uppercase tracking-wider text-blue-900">
                      Tier 1: Client Presentation Layer (React 19 SPA)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-700">Port 3000 / Vite Bundler</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                  <div className="p-2 bg-white rounded border border-blue-100">React 19 Components</div>
                  <div className="p-2 bg-white rounded border border-blue-100">Tailwind CSS v4 Styling</div>
                  <div className="p-2 bg-white rounded border border-blue-100">StaffSync Context API</div>
                  <div className="p-2 bg-white rounded border border-blue-100">Motion Micro-interactions</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <span>↓ HTTPS / RESTful JSON / Bearer JWT ↓</span>
                </div>
              </div>

              {/* Tier 2: Gateway */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-xs uppercase tracking-wider text-purple-900">
                      Tier 2: Express.js Routing & Security Gateway
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-700">Node.js Runtime</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                  <div className="p-2 bg-white rounded border border-purple-100">CORS & Rate Limiting</div>
                  <div className="p-2 bg-white rounded border border-purple-100">JWT Token Auth Guard</div>
                  <div className="p-2 bg-white rounded border border-purple-100">RBAC Role Middleware</div>
                  <div className="p-2 bg-white rounded border border-purple-100">Input Body Sanitizer</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <span>↓ Controller Invocation & Service Methods ↓</span>
                </div>
              </div>

              {/* Tier 3: Business Logic */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900">
                      Tier 3: Business Logic & Policy Engine
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-700">Domain Services</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                  <div className="p-2 bg-white rounded border border-amber-100">Leave Quota Validator</div>
                  <div className="p-2 bg-white rounded border border-amber-100">Shift Hours Calculator</div>
                  <div className="p-2 bg-white rounded border border-amber-100">L&D Progress Evaluator</div>
                  <div className="p-2 bg-white rounded border border-amber-100">Notification Dispatcher</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <span>↓ Mongoose ODM Queries (BSON) ↓</span>
                </div>
              </div>

              {/* Tier 4: Database */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                      Tier 4: MongoDB Database Storage Cluster
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700">MongoDB Replica Set</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-slate-700">
                  <div className="p-2 bg-white rounded border border-emerald-100 font-mono">employees</div>
                  <div className="p-2 bg-white rounded border border-emerald-100 font-mono">attendance_records</div>
                  <div className="p-2 bg-white rounded border border-emerald-100 font-mono">leave_requests</div>
                  <div className="p-2 bg-white rounded border border-emerald-100 font-mono">training_programs</div>
                  <div className="p-2 bg-white rounded border border-emerald-100 font-mono">announcements</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: USER FLOW DIAGRAMS */}
      {activeSubTab === 'user_flows' && (
        <div className="space-y-6">
          {/* Flow 1: Leave Approval Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Workflow 1: Leave Application & Dual-Level Approval Pipeline
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Complete path from employee request creation to Manager review and HR final balance deduction.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="w-full md:w-1/5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-bold text-slate-900 block mb-1">1. Employee Request</span>
                <span className="text-slate-500 text-[11px]">Selects leave category, start/end dates, inputs reason</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />

              <div className="w-full md:w-1/5 p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <span className="font-bold text-blue-900 block mb-1">2. Manager Review</span>
                <span className="text-blue-700 text-[11px]">Checks team bandwidth & grants Tier-1 approval</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />

              <div className="w-full md:w-1/5 p-3.5 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <span className="font-bold text-purple-900 block mb-1">3. HR Sign-Off</span>
                <span className="text-purple-700 text-[11px]">Final audit against statutory policy & compliance</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />

              <div className="w-full md:w-1/5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <span className="font-bold text-emerald-900 block mb-1">4. Quota Deducted</span>
                <span className="text-emerald-700 text-[11px]">Balance updated, calendar booked, alerts sent</span>
              </div>
            </div>
          </div>

          {/* Flow 2: Daily Attendance Flow */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Workflow 2: Daily Attendance Punch & Geofence Verification
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Automated punch verification, anomaly detection (late/absent), and shift duration tracking.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="w-full md:w-1/4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-bold text-slate-900 block mb-1">Clock In Punch</span>
                <span className="text-slate-500 text-[11px]">User selects In-Office or Remote mode at arrival</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />

              <div className="w-full md:w-1/4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-bold text-slate-900 block mb-1">Timestamp & Policy Check</span>
                <span className="text-slate-500 text-[11px]">Flags late arrival if checked in after 09:15 AM</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />

              <div className="w-full md:w-1/4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-bold text-slate-900 block mb-1">Clock Out Punch</span>
                <span className="text-slate-500 text-[11px]">Calculates total shift duration (e.g. 8.5 hours)</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />

              <div className="w-full md:w-1/4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <span className="font-bold text-emerald-900 block mb-1">Payroll Sync</span>
                <span className="text-emerald-700 text-[11px]">Syncs to timesheet table with CSV export readiness</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

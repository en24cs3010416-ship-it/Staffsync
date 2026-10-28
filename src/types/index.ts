export type UserRole = 'hr' | 'manager' | 'employee';

export interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  joiningDate: string;
  salary: number;
  phone: string;
  status: 'active' | 'on_leave' | 'probation' | 'inactive';
  avatarUrl: string;
  leaveBalances: {
    annual: number;
    sick: number;
    casual: number;
    maternityPaternity: number;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
}

export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm AM/PM
  checkOutTime?: string;
  totalHours?: number;
  status: 'present' | 'late' | 'half_day' | 'absent';
  workMode: 'office' | 'remote' | 'field';
  location: string;
  notes?: string;
}

export interface LeaveRequest {
  _id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: 'annual' | 'sick' | 'casual' | 'unpaid' | 'maternity';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'manager_approved' | 'approved' | 'rejected';
  appliedOn: string;
  managerReview?: {
    reviewedBy: string;
    reviewedAt: string;
    status: 'approved' | 'rejected';
    remarks: string;
  };
  hrReview?: {
    reviewedBy: string;
    reviewedAt: string;
    status: 'approved' | 'rejected';
    remarks: string;
  };
}

export interface TrainingProgram {
  _id: string;
  title: string;
  category: 'Engineering' | 'Leadership' | 'Security & Compliance' | 'Product & Design' | 'Soft Skills';
  description: string;
  instructor: string;
  durationWeeks: number;
  status: 'upcoming' | 'in_progress' | 'completed';
  enrolledEmployees: {
    employeeId: string;
    employeeName: string;
    progressPercentage: number;
    completionStatus: 'enrolled' | 'in_progress' | 'completed';
    lastUpdated: string;
  }[];
  totalModules: number;
  startDate: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: 'General' | 'Policy' | 'Urgent' | 'Event' | 'Benefits';
  priority: 'normal' | 'high' | 'urgent';
  targetDepartment: string;
  postedBy: {
    name: string;
    role: string;
  };
  publishedDate: string;
  readCount: number;
  acknowledgedBy: string[];
}

export type ActiveTab = 
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'training'
  | 'announcements'
  | 'architecture'
  | 'demo_video';

export type DocSubTab = 
  | 'er_diagram'
  | 'mvc_pattern'
  | 'roles_matrix'
  | 'features'
  | 'tech_architecture'
  | 'user_flows';

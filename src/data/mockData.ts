import { Employee, AttendanceRecord, LeaveRequest, TrainingProgram, Announcement } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    _id: 'emp-001',
    employeeId: 'EMP-1001',
    fullName: 'Sarah Lin',
    email: 'sarah.lin@staffsync.io',
    role: 'hr',
    designation: 'VP of Human Resources',
    department: 'People Operations',
    joiningDate: '2022-03-15',
    salary: 135000,
    phone: '+1 (555) 234-8901',
    status: 'active',
    avatarUrl: '/src/assets/images/hr_avatar_sarah_1793176316015.jpg',
    leaveBalances: {
      annual: 16,
      sick: 10,
      casual: 4,
      maternityPaternity: 60,
    },
    emergencyContact: {
      name: 'David Lin',
      relationship: 'Spouse',
      phone: '+1 (555) 890-1234',
    },
    skills: ['Talent Acquisition', 'Labor Compliance', 'Compensation & Benefits', 'Strategic Planning'],
  },
  {
    _id: 'emp-002',
    employeeId: 'EMP-1002',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@staffsync.io',
    role: 'manager',
    designation: 'Engineering & Product Manager',
    department: 'Engineering',
    reportingManagerId: 'emp-001',
    reportingManagerName: 'Sarah Lin',
    joiningDate: '2022-08-01',
    salary: 148000,
    phone: '+1 (555) 345-9012',
    status: 'active',
    avatarUrl: '/src/assets/images/manager_avatar_marcus_1793176316317.jpg',
    leaveBalances: {
      annual: 14,
      sick: 8,
      casual: 3,
      maternityPaternity: 30,
    },
    emergencyContact: {
      name: 'Clara Vance',
      relationship: 'Spouse',
      phone: '+1 (555) 789-2345',
    },
    skills: ['Node.js', 'System Architecture', 'Agile Coaching', 'Team Mentorship', 'Cloud Ops'],
  },
  {
    _id: 'emp-003',
    employeeId: 'EMP-1003',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@staffsync.io',
    role: 'employee',
    designation: 'Senior Product Designer',
    department: 'Design',
    reportingManagerId: 'emp-002',
    reportingManagerName: 'Marcus Vance',
    joiningDate: '2023-02-10',
    salary: 115000,
    phone: '+1 (555) 456-0123',
    status: 'active',
    avatarUrl: '/src/assets/images/employee_avatar_elena_1793176315916.jpg',
    leaveBalances: {
      annual: 12,
      sick: 7,
      casual: 2,
      maternityPaternity: 45,
    },
    emergencyContact: {
      name: 'Ilya Rostov',
      relationship: 'Brother',
      phone: '+1 (555) 678-3456',
    },
    skills: ['Design Systems', 'Figma', 'User Research', 'Interactive Prototyping', 'Accessibility'],
  },
  {
    _id: 'emp-004',
    employeeId: 'EMP-1004',
    fullName: 'Devon Patel',
    email: 'devon.patel@staffsync.io',
    role: 'employee',
    designation: 'Full Stack Engineer',
    department: 'Engineering',
    reportingManagerId: 'emp-002',
    reportingManagerName: 'Marcus Vance',
    joiningDate: '2023-06-20',
    salary: 118000,
    phone: '+1 (555) 567-1234',
    status: 'active',
    avatarUrl: '',
    leaveBalances: {
      annual: 15,
      sick: 9,
      casual: 4,
      maternityPaternity: 30,
    },
    emergencyContact: {
      name: 'Asha Patel',
      relationship: 'Mother',
      phone: '+1 (555) 567-9988',
    },
    skills: ['React', 'Express.js', 'MongoDB', 'TypeScript', 'GraphQL'],
  },
  {
    _id: 'emp-005',
    employeeId: 'EMP-1005',
    fullName: 'Amara Okafor',
    email: 'amara.okafor@staffsync.io',
    role: 'employee',
    designation: 'HR & People Operations Specialist',
    department: 'People Operations',
    reportingManagerId: 'emp-001',
    reportingManagerName: 'Sarah Lin',
    joiningDate: '2023-09-01',
    salary: 86000,
    phone: '+1 (555) 678-2345',
    status: 'active',
    avatarUrl: '',
    leaveBalances: {
      annual: 18,
      sick: 10,
      casual: 5,
      maternityPaternity: 60,
    },
    emergencyContact: {
      name: 'Kobe Okafor',
      relationship: 'Father',
      phone: '+1 (555) 901-2345',
    },
    skills: ['Employee Relations', 'Payroll Auditing', 'Onboarding', 'HRIS Management'],
  },
  {
    _id: 'emp-006',
    employeeId: 'EMP-1006',
    fullName: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@staffsync.io',
    role: 'employee',
    designation: 'Cloud Infrastructure Engineer',
    department: 'Engineering',
    reportingManagerId: 'emp-002',
    reportingManagerName: 'Marcus Vance',
    joiningDate: '2024-01-15',
    salary: 125000,
    phone: '+1 (555) 789-3456',
    status: 'on_leave',
    avatarUrl: '',
    leaveBalances: {
      annual: 8,
      sick: 5,
      casual: 1,
      maternityPaternity: 30,
    },
    emergencyContact: {
      name: 'Leila Al-Mansoor',
      relationship: 'Sister',
      phone: '+1 (555) 432-8765',
    },
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Terraform'],
  },
  {
    _id: 'emp-007',
    employeeId: 'EMP-1007',
    fullName: 'Chloe Dupont',
    email: 'chloe.dupont@staffsync.io',
    role: 'employee',
    designation: 'Marketing & Brand Specialist',
    department: 'Marketing',
    reportingManagerId: 'emp-001',
    reportingManagerName: 'Sarah Lin',
    joiningDate: '2024-03-01',
    salary: 92000,
    phone: '+1 (555) 890-4567',
    status: 'probation',
    avatarUrl: '',
    leaveBalances: {
      annual: 6,
      sick: 4,
      casual: 2,
      maternityPaternity: 30,
    },
    emergencyContact: {
      name: 'Henri Dupont',
      relationship: 'Father',
      phone: '+1 (555) 234-5678',
    },
    skills: ['Brand Strategy', 'Internal Communications', 'Copywriting', 'SEO & Analytics'],
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    _id: 'att-101',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    department: 'Design',
    date: '2026-10-28',
    checkInTime: '09:02 AM',
    checkOutTime: undefined,
    status: 'present',
    workMode: 'office',
    location: 'Headquarters - Floor 4 Studio',
    notes: 'In-office design sprint & design system workshop',
  },
  {
    _id: 'att-102',
    employeeId: 'EMP-1002',
    employeeName: 'Marcus Vance',
    department: 'Engineering',
    date: '2026-10-28',
    checkInTime: '08:45 AM',
    checkOutTime: undefined,
    status: 'present',
    workMode: 'office',
    location: 'Headquarters - Room 302',
    notes: 'Sprint planning and quarterly roadmapping',
  },
  {
    _id: 'att-103',
    employeeId: 'EMP-1001',
    employeeName: 'Sarah Lin',
    department: 'People Operations',
    date: '2026-10-28',
    checkInTime: '08:30 AM',
    checkOutTime: undefined,
    status: 'present',
    workMode: 'office',
    location: 'Headquarters - HR Suite',
    notes: 'All-hands prep & performance appraisals',
  },
  {
    _id: 'att-104',
    employeeId: 'EMP-1004',
    employeeName: 'Devon Patel',
    department: 'Engineering',
    date: '2026-10-28',
    checkInTime: '09:35 AM',
    checkOutTime: undefined,
    status: 'late',
    workMode: 'remote',
    location: 'San Francisco, CA (Remote VPN)',
    notes: 'Transit delay; notified team in Slack',
  },
  {
    _id: 'att-105',
    employeeId: 'EMP-1005',
    employeeName: 'Amara Okafor',
    department: 'People Operations',
    date: '2026-10-28',
    checkInTime: '08:58 AM',
    checkOutTime: undefined,
    status: 'present',
    workMode: 'office',
    location: 'Headquarters - HR Suite',
    notes: 'New hire onboarding kit distribution',
  },
  {
    _id: 'att-106',
    employeeId: 'EMP-1006',
    employeeName: 'Tariq Al-Mansoor',
    department: 'Engineering',
    date: '2026-10-28',
    checkInTime: '-',
    status: 'absent',
    workMode: 'office',
    location: 'On Approved Sick Leave',
    notes: 'Medical leave approved by Marcus Vance',
  },
  {
    _id: 'att-107',
    employeeId: 'EMP-1007',
    employeeName: 'Chloe Dupont',
    department: 'Marketing',
    date: '2026-10-28',
    checkInTime: '09:10 AM',
    checkOutTime: undefined,
    status: 'present',
    workMode: 'remote',
    location: 'Remote Workstation',
  },
  // Yesterday's records
  {
    _id: 'att-091',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    department: 'Design',
    date: '2026-10-27',
    checkInTime: '08:55 AM',
    checkOutTime: '05:30 PM',
    totalHours: 8.58,
    status: 'present',
    workMode: 'office',
    location: 'Headquarters - Floor 4',
  },
  {
    _id: 'att-092',
    employeeId: 'EMP-1002',
    employeeName: 'Marcus Vance',
    department: 'Engineering',
    date: '2026-10-27',
    checkInTime: '08:40 AM',
    checkOutTime: '06:10 PM',
    totalHours: 9.5,
    status: 'present',
    workMode: 'office',
    location: 'Headquarters - Room 302',
  },
  {
    _id: 'att-093',
    employeeId: 'EMP-1004',
    employeeName: 'Devon Patel',
    department: 'Engineering',
    date: '2026-10-27',
    checkInTime: '09:05 AM',
    checkOutTime: '05:45 PM',
    totalHours: 8.66,
    status: 'present',
    workMode: 'remote',
    location: 'San Francisco, CA (Remote VPN)',
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    _id: 'leave-201',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    employeeAvatar: '/src/assets/images/employee_avatar_elena_1793176315916.jpg',
    department: 'Design',
    leaveType: 'annual',
    startDate: '2026-11-09',
    endDate: '2026-11-13',
    totalDays: 5,
    reason: 'Attending Figma Config design conference and taking personal rejuvenation days.',
    status: 'pending',
    appliedOn: '2026-10-26',
    managerReview: undefined,
  },
  {
    _id: 'leave-202',
    employeeId: 'EMP-1006',
    employeeName: 'Tariq Al-Mansoor',
    employeeAvatar: '',
    department: 'Engineering',
    leaveType: 'sick',
    startDate: '2026-10-27',
    endDate: '2026-10-29',
    totalDays: 3,
    reason: 'Seasonal viral infection, doctor prescribed rest.',
    status: 'approved',
    appliedOn: '2026-10-26',
    managerReview: {
      reviewedBy: 'Marcus Vance',
      reviewedAt: '2026-10-26 14:10',
      status: 'approved',
      remarks: 'Get well soon Tariq. Team will cover on-call rotations.',
    },
    hrReview: {
      reviewedBy: 'Sarah Lin',
      reviewedAt: '2026-10-26 16:30',
      status: 'approved',
      remarks: 'Medical certificate logged in compliance records.',
    },
  },
  {
    _id: 'leave-203',
    employeeId: 'EMP-1004',
    employeeName: 'Devon Patel',
    employeeAvatar: '',
    department: 'Engineering',
    leaveType: 'casual',
    startDate: '2026-11-02',
    endDate: '2026-11-03',
    totalDays: 2,
    reason: 'Family wedding event in Seattle.',
    status: 'manager_approved',
    appliedOn: '2026-10-25',
    managerReview: {
      reviewedBy: 'Marcus Vance',
      reviewedAt: '2026-10-27 10:15',
      status: 'approved',
      remarks: 'Approved on team side. Pending final HR processing.',
    },
  },
  {
    _id: 'leave-204',
    employeeId: 'EMP-1007',
    employeeName: 'Chloe Dupont',
    employeeAvatar: '',
    department: 'Marketing',
    leaveType: 'annual',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    totalDays: 2,
    reason: 'Relocation apartment handover process.',
    status: 'approved',
    appliedOn: '2026-10-10',
    managerReview: {
      reviewedBy: 'Sarah Lin',
      reviewedAt: '2026-10-11 09:20',
      status: 'approved',
      remarks: 'Granted. Handover notes confirmed.',
    },
    hrReview: {
      reviewedBy: 'Sarah Lin',
      reviewedAt: '2026-10-11 09:30',
      status: 'approved',
      remarks: 'Processed under probationary allowance.',
    },
  }
];

export const INITIAL_TRAININGS: TrainingProgram[] = [
  {
    _id: 'train-301',
    title: 'Microservices & Distributed Systems with Node.js & Docker',
    category: 'Engineering',
    description: 'Comprehensive advanced course covering event-driven architecture, MongoDB replica sets, container orchestration, and zero-downtime deployment pipelines.',
    instructor: 'Marcus Vance & External AWS Architect',
    durationWeeks: 6,
    status: 'in_progress',
    totalModules: 12,
    startDate: '2026-10-05',
    enrolledEmployees: [
      {
        employeeId: 'EMP-1004',
        employeeName: 'Devon Patel',
        progressPercentage: 65,
        completionStatus: 'in_progress',
        lastUpdated: '2026-10-27',
      },
      {
        employeeId: 'EMP-1006',
        employeeName: 'Tariq Al-Mansoor',
        progressPercentage: 80,
        completionStatus: 'in_progress',
        lastUpdated: '2026-10-24',
      }
    ],
  },
  {
    _id: 'train-302',
    title: 'Accessible Design Systems (WCAG 2.2 AA) & Design Tokens',
    category: 'Product & Design',
    description: 'Deep dive into accessible contrast algorithms, keyboard navigation patterns, ARIA authoring practices, and token synchronization across web applications.',
    instructor: 'Elena Rostova (Lead)',
    durationWeeks: 4,
    status: 'in_progress',
    totalModules: 8,
    startDate: '2026-10-12',
    enrolledEmployees: [
      {
        employeeId: 'EMP-1003',
        employeeName: 'Elena Rostova',
        progressPercentage: 90,
        completionStatus: 'in_progress',
        lastUpdated: '2026-10-28',
      },
      {
        employeeId: 'EMP-1007',
        employeeName: 'Chloe Dupont',
        progressPercentage: 45,
        completionStatus: 'in_progress',
        lastUpdated: '2026-10-25',
      }
    ],
  },
  {
    _id: 'train-303',
    title: 'Modern People Leadership, Psychological Safety & 1-on-1s',
    category: 'Leadership',
    description: 'Executive management workshop focusing on empathetic feedback, performance coaching frameworks, career progression ladders, and inclusive hiring.',
    instructor: 'Sarah Lin & Prof. Andrea Meyers',
    durationWeeks: 3,
    status: 'upcoming',
    totalModules: 6,
    startDate: '2026-11-05',
    enrolledEmployees: [
      {
        employeeId: 'EMP-1002',
        employeeName: 'Marcus Vance',
        progressPercentage: 0,
        completionStatus: 'enrolled',
        lastUpdated: '2026-10-26',
      }
    ],
  },
  {
    _id: 'train-304',
    title: 'Enterprise Cyber Security & Data Privacy (SOC2 / GDPR)',
    category: 'Security & Compliance',
    description: 'Mandatory annual certification training on phishing mitigation, data handling protocols, zero-trust network access, and incident reporting.',
    instructor: 'InfoSec Compliance Division',
    durationWeeks: 2,
    status: 'completed',
    totalModules: 4,
    startDate: '2026-09-01',
    enrolledEmployees: [
      {
        employeeId: 'EMP-1001',
        employeeName: 'Sarah Lin',
        progressPercentage: 100,
        completionStatus: 'completed',
        lastUpdated: '2026-09-14',
      },
      {
        employeeId: 'EMP-1002',
        employeeName: 'Marcus Vance',
        progressPercentage: 100,
        completionStatus: 'completed',
        lastUpdated: '2026-09-14',
      },
      {
        employeeId: 'EMP-1003',
        employeeName: 'Elena Rostova',
        progressPercentage: 100,
        completionStatus: 'completed',
        lastUpdated: '2026-09-15',
      }
    ],
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    _id: 'ann-401',
    title: 'Annual Benefits Enrollment Window Open (Medical, Dental & 401k Match)',
    content: 'The open enrollment portal is now officially active through November 20. All employees can adjust healthcare tiers, configure HSA contributions, and update designated life insurance beneficiaries in the StaffSync benefits hub.',
    category: 'Benefits',
    priority: 'high',
    targetDepartment: 'All',
    postedBy: {
      name: 'Sarah Lin',
      role: 'VP of Human Resources',
    },
    publishedDate: '2026-10-25',
    readCount: 42,
    acknowledgedBy: ['EMP-1001', 'EMP-1002', 'EMP-1003'],
  },
  {
    _id: 'ann-402',
    title: 'Q4 All-Hands Town Hall & Product Roadmap Reveal',
    content: 'Join us this Thursday at 10:00 AM PST for our quarterly town hall. We will celebrate milestone promotions, review financial performance metrics, and unveil next quarter’s strategic priorities. Hybrid attendance supported.',
    category: 'Event',
    priority: 'normal',
    targetDepartment: 'All',
    postedBy: {
      name: 'Sarah Lin',
      role: 'VP of Human Resources',
    },
    publishedDate: '2026-10-27',
    readCount: 38,
    acknowledgedBy: ['EMP-1002'],
  },
  {
    _id: 'ann-403',
    title: 'Updated Remote Work & Equipment Reimbursement Policy',
    content: 'HR has published the revised 2026-2027 Hybrid Work Guidelines. Effective November 1st, full-time hybrid staff are eligible for a $600 ergonomic workspace stipend upon submitting eligible receipts to People Operations.',
    category: 'Policy',
    priority: 'high',
    targetDepartment: 'All',
    postedBy: {
      name: 'Amara Okafor',
      role: 'HR & People Operations Specialist',
    },
    publishedDate: '2026-10-20',
    readCount: 51,
    acknowledgedBy: ['EMP-1001', 'EMP-1002', 'EMP-1003', 'EMP-1004'],
  }
];

const STORAGE_KEYS = {
  EMPLOYEES: 'staffsync_employees_v1',
  ATTENDANCE: 'staffsync_attendance_v1',
  LEAVES: 'staffsync_leaves_v1',
  TRAININGS: 'staffsync_trainings_v1',
  ANNOUNCEMENTS: 'staffsync_announcements_v1',
};

export const getStoredData = () => {
  try {
    const employees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    const attendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    const leaves = localStorage.getItem(STORAGE_KEYS.LEAVES);
    const trainings = localStorage.getItem(STORAGE_KEYS.TRAININGS);
    const announcements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);

    return {
      employees: employees ? JSON.parse(employees) : INITIAL_EMPLOYEES,
      attendance: attendance ? JSON.parse(attendance) : INITIAL_ATTENDANCE,
      leaves: leaves ? JSON.parse(leaves) : INITIAL_LEAVES,
      trainings: trainings ? JSON.parse(trainings) : INITIAL_TRAININGS,
      announcements: announcements ? JSON.parse(announcements) : INITIAL_ANNOUNCEMENTS,
    };
  } catch (e) {
    console.error('Failed reading localStorage, using initial state', e);
    return {
      employees: INITIAL_EMPLOYEES,
      attendance: INITIAL_ATTENDANCE,
      leaves: INITIAL_LEAVES,
      trainings: INITIAL_TRAININGS,
      announcements: INITIAL_ANNOUNCEMENTS,
    };
  }
};

export const saveStoredData = (data: {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  trainings: TrainingProgram[];
  announcements: Announcement[];
}) => {
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(data.employees));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data.attendance));
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(data.leaves));
    localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(data.trainings));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(data.announcements));
  } catch (e) {
    console.error('Failed writing to localStorage', e);
  }
};

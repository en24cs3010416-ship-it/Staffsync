import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  TrainingProgram, 
  Announcement, 
  UserRole,
  ActiveTab 
} from '../types';
import { 
  getStoredData, 
  saveStoredData, 
  INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES, 
  INITIAL_TRAININGS, 
  INITIAL_ANNOUNCEMENTS 
} from '../data/mockData';

interface StaffSyncContextType {
  // Current user session & role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: Employee;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Data
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  trainings: TrainingProgram[];
  announcements: Announcement[];
  
  // Actions - Employee Management (HR)
  addEmployee: (emp: Omit<Employee, '_id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Actions - Attendance Tracking (Employee & HR)
  todayRecord: AttendanceRecord | undefined;
  clockIn: (workMode: 'office' | 'remote' | 'field', location?: string) => void;
  clockOut: () => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, '_id'>) => void;
  
  // Actions - Leaves (Employee, Manager, HR)
  applyLeave: (leaveData: {
    leaveType: 'annual' | 'sick' | 'casual' | 'unpaid' | 'maternity';
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
  }) => void;
  reviewLeave: (
    leaveId: string, 
    action: 'approve' | 'reject', 
    remarks: string
  ) => void;
  
  // Actions - Training & Development (Manager)
  createTrainingProgram: (program: Omit<TrainingProgram, '_id'>) => void;
  updateTrainingProgress: (programId: string, employeeId: string, progress: number) => void;
  enrollInTraining: (programId: string, employeeId: string) => void;
  
  // Actions - Announcements (HR)
  postAnnouncement: (announcement: Omit<Announcement, '_id' | 'readCount' | 'acknowledgedBy'>) => void;
  acknowledgeAnnouncement: (announcementId: string) => void;
  
  // Utilities
  resetToDefaultData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StaffSyncContext = createContext<StaffSyncContextType | undefined>(undefined);

export const StaffSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [trainings, setTrainings] = useState<TrainingProgram[]>(INITIAL_TRAININGS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  
  // Current active role & view
  const [currentRole, setCurrentRole] = useState<UserRole>('hr');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredData();
    setEmployees(stored.employees);
    setAttendance(stored.attendance);
    setLeaves(stored.leaves);
    setTrainings(stored.trainings);
    setAnnouncements(stored.announcements);
    setDataLoaded(true);
  }, []);

  // Save to localStorage when state updates
  useEffect(() => {
    if (!dataLoaded) return;
    saveStoredData({ employees, attendance, leaves, trainings, announcements });
  }, [employees, attendance, leaves, trainings, announcements, dataLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Derive current persona based on role
  const currentUser: Employee = React.useMemo(() => {
    if (currentRole === 'hr') {
      return employees.find(e => e.role === 'hr') || employees[0];
    }
    if (currentRole === 'manager') {
      return employees.find(e => e.role === 'manager') || employees[1];
    }
    // employee role
    return employees.find(e => e.role === 'employee' && e.employeeId === 'EMP-1003') || employees[2];
  }, [currentRole, employees]);

  // Today's attendance record for current user
  const todayStr = '2026-10-28';
  const todayRecord = attendance.find(
    a => a.employeeId === currentUser.employeeId && a.date === todayStr
  );

  // Employee actions
  const addEmployee = (empData: Omit<Employee, '_id'>) => {
    const newEmp: Employee = {
      ...empData,
      _id: `emp-${Date.now()}`,
    };
    setEmployees(prev => [newEmp, ...prev]);
    showToast(`Employee ${newEmp.fullName} (${newEmp.employeeId}) onboarded successfully.`);
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => (emp._id === id ? { ...emp, ...updatedFields } : emp))
    );
    showToast('Employee profile updated successfully.');
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp._id !== id));
    showToast('Employee record archived.');
  };

  // Attendance actions
  const clockIn = (workMode: 'office' | 'remote' | 'field', location?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if already clocked in today
    if (todayRecord) {
      showToast('You are already clocked in for today.');
      return;
    }

    const newRecord: AttendanceRecord = {
      _id: `att-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.fullName,
      department: currentUser.department,
      date: todayStr,
      checkInTime: timeFormatted,
      status: 'present',
      workMode,
      location: location || (workMode === 'office' ? 'Headquarters Studio' : 'Remote Workstation'),
    };

    setAttendance(prev => [newRecord, ...prev]);
    showToast(`Clocked in at ${timeFormatted} (${workMode}). Have a productive day!`);
  };

  const clockOut = () => {
    if (!todayRecord) {
      showToast('No active clock-in found for today.');
      return;
    }
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance(prev =>
      prev.map(rec => {
        if (rec._id === todayRecord._id) {
          return {
            ...rec,
            checkOutTime: timeFormatted,
            totalHours: 8.25,
          };
        }
        return rec;
      })
    );
    showToast(`Clocked out at ${timeFormatted}. Work duration recorded.`);
  };

  const addAttendanceRecord = (recordData: Omit<AttendanceRecord, '_id'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      _id: `att-${Date.now()}`,
    };
    setAttendance(prev => [newRecord, ...prev]);
    showToast('Attendance entry logged successfully.');
  };

  // Leave actions
  const applyLeave = (leaveData: {
    leaveType: 'annual' | 'sick' | 'casual' | 'unpaid' | 'maternity';
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
  }) => {
    const newLeave: LeaveRequest = {
      _id: `leave-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.fullName,
      employeeAvatar: currentUser.avatarUrl,
      department: currentUser.department,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      totalDays: leaveData.totalDays,
      reason: leaveData.reason,
      status: 'pending',
      appliedOn: todayStr,
    };

    setLeaves(prev => [newLeave, ...prev]);
    showToast(`Leave request for ${leaveData.totalDays} day(s) submitted for approval.`);
  };

  const reviewLeave = (leaveId: string, action: 'approve' | 'reject', remarks: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

    setLeaves(prev =>
      prev.map(leave => {
        if (leave._id !== leaveId) return leave;

        // If Manager is reviewing
        if (currentRole === 'manager') {
          const newStatus = action === 'approve' ? 'manager_approved' : 'rejected';
          return {
            ...leave,
            status: newStatus,
            managerReview: {
              reviewedBy: currentUser.fullName,
              reviewedAt: now,
              status: action === 'approve' ? 'approved' : 'rejected',
              remarks,
            },
          };
        }

        // If HR is reviewing (can do final approval or override)
        if (currentRole === 'hr') {
          const newStatus = action === 'approve' ? 'approved' : 'rejected';
          
          // Deduct from employee leave balance if approved
          if (action === 'approve') {
            setEmployees(empList =>
              empList.map(e => {
                if (e.employeeId === leave.employeeId) {
                  const type = leave.leaveType;
                  const currentBal = e.leaveBalances[type === 'annual' ? 'annual' : type === 'sick' ? 'sick' : 'casual'] ?? 0;
                  return {
                    ...e,
                    leaveBalances: {
                      ...e.leaveBalances,
                      [type === 'annual' ? 'annual' : type === 'sick' ? 'sick' : 'casual']: Math.max(0, currentBal - leave.totalDays),
                    },
                  };
                }
                return e;
              })
            );
          }

          return {
            ...leave,
            status: newStatus,
            hrReview: {
              reviewedBy: currentUser.fullName,
              reviewedAt: now,
              status: action === 'approve' ? 'approved' : 'rejected',
              remarks,
            },
          };
        }

        return leave;
      })
    );

    showToast(`Leave request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
  };

  // Training actions
  const createTrainingProgram = (programData: Omit<TrainingProgram, '_id'>) => {
    const newProg: TrainingProgram = {
      ...programData,
      _id: `train-${Date.now()}`,
    };
    setTrainings(prev => [newProg, ...prev]);
    showToast(`Training Program "${newProg.title}" created.`);
  };

  const updateTrainingProgress = (programId: string, employeeId: string, progress: number) => {
    setTrainings(prev =>
      prev.map(prog => {
        if (prog._id !== programId) return prog;
        const updatedEnrollments = prog.enrolledEmployees.map(enroll => {
          if (enroll.employeeId !== employeeId) return enroll;
          const status: 'completed' | 'in_progress' | 'enrolled' = 
            progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'enrolled';
          return {
            ...enroll,
            progressPercentage: Math.min(100, Math.max(0, progress)),
            completionStatus: status,
            lastUpdated: todayStr,
          };
        });
        return {
          ...prog,
          enrolledEmployees: updatedEnrollments,
        };
      })
    );
    showToast(`Updated progress to ${progress}%`);
  };

  const enrollInTraining = (programId: string, employeeId: string) => {
    const targetEmp = employees.find(e => e.employeeId === employeeId);
    if (!targetEmp) return;

    setTrainings(prev =>
      prev.map(prog => {
        if (prog._id !== programId) return prog;
        if (prog.enrolledEmployees.some(e => e.employeeId === employeeId)) {
          showToast(`${targetEmp.fullName} is already enrolled.`);
          return prog;
        }
        return {
          ...prog,
          enrolledEmployees: [
            ...prog.enrolledEmployees,
            {
              employeeId: targetEmp.employeeId,
              employeeName: targetEmp.fullName,
              progressPercentage: 0,
              completionStatus: 'enrolled',
              lastUpdated: todayStr,
            },
          ],
        };
      })
    );
    showToast(`Enrolled ${targetEmp.fullName} in training.`);
  };

  // Announcement actions
  const postAnnouncement = (announcementData: Omit<Announcement, '_id' | 'readCount' | 'acknowledgedBy'>) => {
    const newAnn: Announcement = {
      ...announcementData,
      _id: `ann-${Date.now()}`,
      readCount: 1,
      acknowledgedBy: [currentUser.employeeId],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast('Company bulletin announcement published to all active staff.');
  };

  const acknowledgeAnnouncement = (announcementId: string) => {
    setAnnouncements(prev =>
      prev.map(ann => {
        if (ann._id !== announcementId) return ann;
        if (ann.acknowledgedBy.includes(currentUser.employeeId)) return ann;
        return {
          ...ann,
          readCount: ann.readCount + 1,
          acknowledgedBy: [...ann.acknowledgedBy, currentUser.employeeId],
        };
      })
    );
    showToast('Announcement marked as acknowledged.');
  };

  const resetToDefaultData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setTrainings(INITIAL_TRAININGS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    saveStoredData({
      employees: INITIAL_EMPLOYEES,
      attendance: INITIAL_ATTENDANCE,
      leaves: INITIAL_LEAVES,
      trainings: INITIAL_TRAININGS,
      announcements: INITIAL_ANNOUNCEMENTS,
    });
    showToast('Reset system to default sample data.');
  };

  return (
    <StaffSyncContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        activeTab,
        setActiveTab,
        employees,
        attendance,
        leaves,
        trainings,
        announcements,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        todayRecord,
        clockIn,
        clockOut,
        addAttendanceRecord,
        applyLeave,
        reviewLeave,
        createTrainingProgram,
        updateTrainingProgress,
        enrollInTraining,
        postAnnouncement,
        acknowledgeAnnouncement,
        resetToDefaultData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StaffSyncContext.Provider>
  );
};

export const useStaffSync = () => {
  const context = useContext(StaffSyncContext);
  if (!context) {
    throw new Error('useStaffSync must be used within a StaffSyncProvider');
  }
  return context;
};

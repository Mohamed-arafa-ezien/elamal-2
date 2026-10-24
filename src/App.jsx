import React, { useState, useEffect } from 'react';

// 🎨 اللوجو المدمج كـ SVG Data URL
const NURSERY_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'><circle cx='250' cy='220' r='120' fill='%23fbbf24'/><path d='M250 80 L250 20 M250 360 L250 420 M110 220 L50 220 M390 220 L450 220 M150 120 L100 70 M350 320 L400 370 M350 120 L400 70 M150 320 L100 370' stroke='%23f59e0b' stroke-width='12' stroke-linecap='round'/><circle cx='210' cy='190' r='12' fill='%231e293b'/><circle cx='290' cy='190' r='12' fill='%231e293b'/><circle cx='180' cy='230' r='18' fill='%23f87171' opacity='0.7'/><circle cx='320' cy='230' r='18' fill='%23f87171' opacity='0.7'/><path d='M210 250 Q250 290 290 250' fill='none' stroke='%231e293b' stroke-width='8' stroke-linecap='round'/><path d='M100 340 C180 300 320 300 400 340 C320 380 180 380 100 340 Z' fill='%23334155'/><text x='250' y='60' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='26' fill='%231e3a8a'>حضانة الأمل الخاصة</text><text x='250' y='430' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='28' fill='%231e3a8a'>ثنائية اللغة بصنبو</text></svg>";

const PERMISSION_LIST = [
  { key: 'viewDashboard', label: 'رؤية لوحة التحكم' },
  { key: 'viewChildren', label: 'رؤية قائمة الأطفال' },
  { key: 'addChild', label: 'إضافة طفل جديد' },
  { key: 'deleteChild', label: 'حذف طفل' },
  { key: 'viewFees', label: 'رؤية صفحة الرسوم' },
  { key: 'collectFees', label: 'تحصيل دفعة (تسجيل إيراد)' },
  { key: 'viewAccounting', label: 'رؤية الإيرادات والمصروفات' },
  { key: 'addExpense', label: 'إضافة مصروف' },
  { key: 'viewReports', label: 'رؤية التقارير الشاملة' },
  { key: 'manageClassrooms', label: 'إدارة الفصول' },
  { key: 'manageAttendance', label: 'تسجيل الحضور والغياب' },
  { key: 'manageActivities', label: 'إدارة الأنشطة' },
  { key: 'manageVideos', label: 'إدارة الفيديوهات' },
  { key: 'manageUsers', label: 'إدارة الصلاحيات والمستخدمين' },
  { key: 'backupData', label: 'النسخ الاحتياطي والاسترجاع' },
];

const DEFAULT_ROLE_PERMISSIONS = {
  admin: { viewDashboard: true, viewChildren: true, addChild: true, deleteChild: true, viewFees: true, collectFees: true, viewAccounting: true, addExpense: true, viewReports: true, manageClassrooms: true, manageAttendance: true, manageActivities: true, manageVideos: true, manageUsers: true, backupData: true },
  teacher: { viewDashboard: true, viewChildren: true, addChild: true, deleteChild: true, viewFees: false, collectFees: false, viewAccounting: false, addExpense: false, viewReports: false, manageClassrooms: true, manageAttendance: true, manageActivities: true, manageVideos: true, manageUsers: false, backupData: false },
  accountant: { viewDashboard: true, viewChildren: true, addChild: true, deleteChild: false, viewFees: true, collectFees: true, viewAccounting: true, addExpense: true, viewReports: true, manageClassrooms: false, manageAttendance: false, manageActivities: false, manageVideos: false, manageUsers: false, backupData: false }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // فلاتر التقارير
  const [reportFromDate, setReportFromDate] = useState('');
  const [reportToDate, setReportToDate] = useState('');
  const [reportChildId, setReportChildId] = useState('all');
  const [reportClassroom, setReportClassroom] = useState('all');
  
  // فلاتر الحضور والبحث
  const [searchChildQuery, setSearchChildQuery] = useState('');
  const [attendanceFilterClassroom, setAttendanceFilterClassroom] = useState('all');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  
  // إيصال الدفع
  const [receiptData, setReceiptData] = useState(null);

  // States التعديل
  const [editingChildId, setEditingChildId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nursery_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, username: 'admin', password: '123', name: 'محمد عرفه', role: 'admin', roleLabel: 'مدير النظام' },
      { id: 2, username: 'teacher', password: '123', name: 'سارة علي', role: 'teacher', roleLabel: 'معلمة' },
      { id: 3, username: 'accountant', password: '123', name: 'محمد حسن', role: 'accountant', roleLabel: 'محاسب' }
    ];
  });

  const [userPermissions, setUserPermissions] = useState(() => {
    const saved = localStorage.getItem('nursery_user_permissions');
    if (saved) return JSON.parse(saved);
    const initialPerms = {};
    users.forEach(u => { initialPerms[u.id] = { ...DEFAULT_ROLE_PERMISSIONS[u.role] }; });
    return initialPerms;
  });

  const [selectedUserId, setSelectedUserId] = useState(null);

  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('nursery_attendance_logs');
    if (saved) return JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    return [
      { id: 1, childId: 1, date: today, status: 'present', checkIn: '07:45 ص' },
      { id: 2, childId: 2, date: today, status: 'present', checkIn: '08:00 ص' },
      { id: 3, childId: 3, date: today, status: 'absent', checkIn: '-' },
      { id: 4, childId: 1, date: yesterday, status: 'absent', checkIn: '-' },
      { id: 5, childId: 2, date: yesterday, status: 'present', checkIn: '08:10 ص' },
    ];
  });

  useEffect(() => { localStorage.setItem('nursery_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nursery_user_permissions', JSON.stringify(userPermissions)); }, [userPermissions]);
  useEffect(() => { localStorage.setItem('nursery_attendance_logs', JSON.stringify(attendanceLogs)); }, [attendanceLogs]);
  useEffect(() => { setIsMounted(true); }, []);

  const hasPermission = (key) => {
    if (!currentUser) return false;
    if (currentUser.username === 'admin') return true;
    const perms = userPermissions[currentUser.id] || DEFAULT_ROLE_PERMISSIONS[currentUser.role];
    return perms?.[key] === true;
  };

  const toggleUserPermission = (userId, key) => {
    const user = users.find(u => u.id === userId);
    if (user && user.username === 'admin') return alert('لا يمكن تعديل صلاحيات المدير الأساسي!');
    setUserPermissions(prev => {
      const userPerms = prev[userId] || { ...DEFAULT_ROLE_PERMISSIONS[user.role] };
      return { ...prev, [userId]: { ...userPerms, [key]: !userPerms[key] } };
    });
  };

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('teacher');

  const [children, setChildren] = useState(() => {
    const saved = localStorage.getItem('nursery_children');
    return saved ?

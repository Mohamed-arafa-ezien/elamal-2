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
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "يوسف محمد", dob: "2022-05-10", joinDate: "2026-08-01", phone: "01012345678", classroom: "فصل الزهور", status: "present", checkIn: "07:45 ص", monthlyFee: 1000, paidFee: 2000, bloodType: "O+", allergies: "لا يوجد", emergencyContact: "01000000000" },
      { id: 2, name: "مريم أحمد", dob: "2021-08-15", joinDate: "2026-09-10", phone: "01198765432", classroom: "فصل الزهور", status: "present", checkIn: "08:00 ص", monthlyFee: 1200, paidFee: 1200, bloodType: "A+", allergies: "حساسية فول", emergencyContact: "01111111111" },
      { id: 3, name: "عمر خالد", dob: "2022-02-20", joinDate: "2026-10-01", phone: "01234567890", classroom: "فصل البراعم", status: "absent", checkIn: "-", monthlyFee: 1000, paidFee: 0, bloodType: "B+", allergies: "لا يوجد", emergencyContact: "01222222222" }
    ];
  });
  
  const [newChildName, setNewChildName] = useState('');
  const [newChildDob, setNewChildDob] = useState('');
  const [newChildJoinDate, setNewChildJoinDate] = useState('');
  const [newChildPhone, setNewChildPhone] = useState('');
  const [newChildClassroom, setNewChildClassroom] = useState('');
  const [newChildMonthlyFee, setNewChildMonthlyFee] = useState('');
  const [newChildBloodType, setNewChildBloodType] = useState('O+');
  const [newChildAllergies, setNewChildAllergies] = useState('');
  const [newChildEmergencyContact, setNewChildEmergencyContact] = useState('');

  const [revenues, setRevenues] = useState(() => {
    const saved = localStorage.getItem('nursery_revenues');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "تحصيل رسوم - يوسف محمد", amount: 1000, date: "2026-08-01" },
      { id: 2, title: "تحصيل رسوم - مريم أحمد", amount: 1200, date: "2026-09-10" }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('nursery_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "أجور ورواتب المعلمات", amount: 1500, category: "أجور ورواتب", date: "2026-10-01" },
      { id: 2, title: "مستلزمات وأدوات تلوين", amount: 200, category: "مستلزمات تعليمية", date: "2026-10-05" }
    ];
  });
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('أجور ورواتب');

  const [classrooms, setClassrooms] = useState(() => {
    const saved = localStorage.getItem('nursery_classrooms');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "فصل البراعم", supervisor: "أستاذة فاطمة", ageGroup: "سنة إلى سنتين" },
      { id: 2, name: "فصل الزهور", supervisor: "أستاذة سارة", ageGroup: "سنتان إلى 3 سنوات" }
    ];
  });
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newClassroomSupervisor, setNewClassroomSupervisor] = useState('');
  const [newClassroomAge, setNewClassroomAge] = useState('');

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('nursery_videos');
    return saved ? JSON.parse(saved) : [{ id: 1, title: "تعليم الحروف العربية للأطفال", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "تعليمي" }];
  });
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('تعليمي');

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('nursery_activities');
    return saved ? JSON.parse(saved) : [{ id: 1, title: "نشاط الرسم والتلوين", category: "إنجاز", classroom: "فصل الزهور", time: "09:00 صباحاً" }];
  });
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityCategory, setNewActivityCategory] = useState('إنجاز');
  const [newActivityTime, setNewActivityTime] = useState('');

  useEffect(() => { localStorage.setItem('nursery_children', JSON.stringify(children)); }, [children]);
  useEffect(() => { localStorage.setItem('nursery_revenues', JSON.stringify(revenues)); }, [revenues]);
  useEffect(() => { localStorage.setItem('nursery_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('nursery_classrooms', JSON.stringify(classrooms)); }, [classrooms]);
  useEffect(() => { localStorage.setItem('nursery_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('nursery_activities', JSON.stringify(activities)); }, [activities]);

  const downloadCSV = (data, filename, headers) => {
    const csvRows = [];
    csvRows.push(headers.join(','));
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportData = () => {
    const backupData = { users, children, revenues, expenses, classrooms, videos, activities, userPermissions, attendanceLogs };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nursery_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.children) setChildren(parsed.children);
        if (parsed.revenues) setRevenues(parsed.revenues);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.classrooms) setClassrooms(parsed.classrooms);
        if (parsed.videos) setVideos(parsed.videos);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.userPermissions) setUserPermissions(parsed.userPermissions);
        if (parsed.attendanceLogs) setAttendanceLogs(parsed.attendanceLogs);
        alert('تم استرجاع كافة البيانات بنجاح تام! ✨');
      } catch (err) {
        alert('حدث خطأ: ملف النسخة الاحتياطية غير صالح!');
      }
    };
    reader.readAsText(file);
  };

  const calculateTotalDueFee = (child) => {
    if (!child.joinDate || !child.monthlyFee) return Number(child.monthlyFee) || 0;
    const join = new Date(child.joinDate);
    const today = new Date();
    let months = (today.getFullYear() - join.getFullYear()) * 12 + (today.getMonth() - join.getMonth());
    if (today.getDate() >= join.getDate()) months += 1;
    months = Math.max(1, months);
    return months * Number(child.monthlyFee);
  };

  const totalPaidRevenue = revenues.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalDueFeesAll = children.reduce((sum, c) => sum + calculateTotalDueFee(c), 0);
  const totalReceivableBalance = totalDueFeesAll - totalPaidRevenue;
  const netIncome = totalPaidRevenue - totalExpenses;

  const presentCount = children.filter(c => c.status === 'present').length;
  const absentCount = children.filter(c => c.status === 'absent').length;
  const attendancePercentage = children.length === 0 ? 0 : Math.round((presentCount / children.length) * 100);

  const filteredLogs = attendanceLogs.filter(log => {
      const matchFrom = !reportFromDate || log.date >= reportFromDate;
      const matchTo = !reportToDate || log.date <= reportToDate;
      const matchChild = reportChildId === 'all' || log.childId === Number(reportChildId);
      const childInfo = children.find(c => c.id === log.childId);
      const matchClassroom = reportClassroom === 'all' || childInfo?.classroom === reportClassroom;
      return matchFrom && matchTo && matchChild && matchClassroom;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredRevenues = revenues.filter(rev => {
    const matchFrom = !reportFromDate || rev.date >= reportFromDate;
    const matchTo = !reportToDate || rev.date <= reportToDate;
    return matchFrom && matchTo;
  });

  const filteredExpenses = expenses.filter(exp => {
    const matchFrom = !reportFromDate || exp.date >= reportFromDate;
    const matchTo = !reportToDate || exp.date <= reportToDate;
    return matchFrom && matchTo;
  });

  const filteredTotalRevenue = filteredRevenues.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const filteredTotalExpenses = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const filteredNetIncome = filteredTotalRevenue - filteredTotalExpenses;
  
  const childrenForFilter = reportClassroom === 'all' ? children : children.filter(c => c.classroom === reportClassroom);
  const searchedChildren = children.filter(c => c.name.includes(searchChildQuery) || c.phone.includes(searchChildQuery));

  const attendanceDisplayChildren = children.filter(c => {
    const matchClass = attendanceFilterClassroom === 'all' || c.classroom === attendanceFilterClassroom;
    const matchName = c.name.includes(attendanceSearchQuery);
    return matchClass && matchName;
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(u => u.username === usernameInput && u.password === passwordInput);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    } else {
      alert('اسم المستخدم أو كلمة المرور غير مسجلة بشكل صحيح!');
    }
  };

  const startEditChild = (child) => {
    setEditingChildId(child.id);
    setNewChildName(child.name);
    setNewChildDob(child.dob);
    setNewChildJoinDate(child.joinDate);
    setNewChildPhone(child.phone);
    setNewChildClassroom(child.classroom);
    setNewChildMonthlyFee(child.monthlyFee);
    setNewChildBloodType(child.bloodType || 'O+');
    setNewChildAllergies(child.allergies || '');
    setNewChildEmergencyContact(child.emergencyContact || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditChild = () => {
    setEditingChildId(null);
    setNewChildName(''); setNewChildDob(''); setNewChildJoinDate(''); setNewChildPhone(''); setNewChildMonthlyFee(''); setNewChildAllergies(''); setNewChildEmergencyContact('');
  };

  const handleSaveChild = (e) => {
    e.preventDefault();
    if (editingChildId) {
      setChildren(children.map(c => c.id === editingChildId ? { 
        ...c, name: newChildName, dob: newChildDob, joinDate: newChildJoinDate, phone: newChildPhone, 
        classroom: newChildClassroom, monthlyFee: Number(newChildMonthlyFee), bloodType: newChildBloodType, 
        allergies: newChildAllergies || 'لا يوجد', emergencyContact: newChildEmergencyContact || 'لا يوجد'
      } : c));
      alert('تم تحديث بيانات الطفل بنجاح!');
      cancelEditChild();
    } else {
      const newChild = { 
        id: Date.now(), name: newChildName, dob: newChildDob, joinDate: newChildJoinDate || new Date().toISOString().split('T')[0], 
        phone: newChildPhone, classroom: newChildClassroom, status: 'absent', checkIn: '-', monthlyFee: Number(newChildMonthlyFee), 
        paidFee: 0, bloodType: newChildBloodType, allergies: newChildAllergies || 'لا يوجد', emergencyContact: newChildEmergencyContact || 'لا يوجد'
      };
      setChildren([...children, newChild]);
      setNewChildName(''); setNewChildDob(''); setNewChildJoinDate(''); setNewChildPhone(''); setNewChildMonthlyFee(''); setNewChildAllergies(''); setNewChildEmergencyContact('');
      alert('تم إضافة الطفل بنجاح!');
    }
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setNewName(user.name);
    setNewUsername(user.username);
    setNewPassword(user.password);
    setNewRole(user.role);
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setNewUsername(''); setNewPassword(''); setNewName(''); setNewRole('teacher');
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const roleLabel = newRole === 'admin' ? 'مدير النظام' : newRole === 'teacher' ? 'معلمة' : 'محاسب';
    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, username: newUsername, password: newPassword, name: newName, role: newRole, roleLabel } : u));
      alert('تم تحديث بيانات المستخدم بنجاح!');
      cancelEditUser();
    } else {
      const newUserId = Date.now();
      setUsers([...users, { id: newUserId, username: newUsername, password: newPassword, name: newName, role: newRole, roleLabel }]);
      setUserPermissions(prev => ({ ...prev, [newUserId]: { ...DEFAULT_ROLE_PERMISSIONS[newRole] } }));
      setNewUsername(''); setNewPassword(''); setNewName('');
      alert('تم إضافة المستخدم بنجاح!');
    }
  };

  const handlePaymentUpdate = (childId, addedAmount) => {
    const amount = Number(addedAmount);
    if (isNaN(amount) || amount <= 0) return;
    const child = children.find(c => c.id === childId);
    if (!child) return;
    const currentBalance = calculateTotalDueFee(child) - (Number(child.paidFee) || 0);
    const newBalance = currentBalance - amount;
    setChildren(children.map(c => c.id === childId ? { ...c, paidFee: (Number(c.paidFee) || 0

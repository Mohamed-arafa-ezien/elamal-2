import React, { useState, useEffect } from 'react';

const LOGO_URL = "/logo.png";

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
  
  const [reportFromDate, setReportFromDate] = useState('');
  const [reportToDate, setReportToDate] = useState('');
  const [reportChildId, setReportChildId] = useState('all');
  const [reportClassroom, setReportClassroom] = useState('all');
  
  const [searchChildQuery, setSearchChildQuery] = useState('');
  const [attendanceFilterClassroom, setAttendanceFilterClassroom] = useState('all');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  
  const [receiptData, setReceiptData] = useState(null);

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
    setChildren(children.map(c => c.id === childId ? { ...c, paidFee: (Number(c.paidFee) || 0) + amount } : c));
    setRevenues([...revenues, { id: Date.now(), title: `تحصيل رسوم - ${child.name}`, amount: amount, date: new Date().toISOString().split('T')[0] }]);
    setReceiptData({ childName: child.name, amountPaid: amount, remaining: newBalance > 0 ? newBalance : 0, date: new Date().toLocaleDateString('ar-EG'), time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) });
  };

  const sendWhatsApp = (child, balance) => {
    let cleanPhone = child.phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('00')) {
      cleanPhone = cleanPhone.substring(2);
    }
    
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '20' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('1') && cleanPhone.length === 10) {
      cleanPhone = '20' + cleanPhone;
    }

    const msg = `أهلاً أ/ ${child.name.split(' ')[0]}، نود تذكيركم بضرورة سداد باقي أقساط الطفل ${child.name} وقدرها ${balance} جنيه. شكراً لكم - حضانة الأمل.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const printReceipt = () => {
    if (!receiptData) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="rtl"><head><title>إيصال دفع</title><style>body { font-family: 'Segoe UI', sans-serif; padding: 30px; text-align: right; } .header { text-align: center; border-bottom: 2px dashed #ccc; margin-bottom: 20px; padding-bottom: 10px; display: flex; flex-direction: column; align-items: center; } .logo { width: 100px; height: 100px; object-fit: contain; margin-bottom: 10px; } .row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; } .total { background-color: #ecfdf5; padding: 12px; font-weight: bold; color: #047857; }</style></head>
      <body>
        <div class="header">
          <img src="${window.location.origin}${LOGO_URL}" class="logo" alt="Logo" />
          <h2>حضانة الأمل</h2>
          <p>إيصال استلام نقدية</p>
        </div>
        <div class="row"><span>اسم الطالب:</span> <strong>${receiptData.childName}</strong></div>
        <div class="row"><span>التاريخ:</span> <strong>${receiptData.date} - ${receiptData.time}</strong></div>
        <div class="row total"><span>المبلغ المدفوع:</span> <strong>${receiptData.amountPaid} ج.م</strong></div>
        <div class="row"><span>المتبقي:</span> <strong>${receiptData.remaining} ج.م</strong></div>
        <div style="text-align:center; margin-top:50px;">توقيع المحاسب: ....................</div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses([...expenses, { id: Date.now(), title: newExpenseTitle, amount: Number(newExpenseAmount), category: newExpenseCategory, date: new Date().toISOString().split('T')[0] }]);
    setNewExpenseTitle(''); setNewExpenseAmount('');
  };

  const handleAddClassroom = (e) => {
    e.preventDefault();
    setClassrooms([...classrooms, { id: Date.now(), name: newClassroomName, supervisor: newClassroomSupervisor || 'غير محدد', ageGroup: newClassroomAge || 'عام' }]);
    setNewClassroomName(''); setNewClassroomSupervisor(''); setNewClassroomAge('');
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    setVideos([...videos, { id: Date.now(), title: newVideoTitle, url: newVideoUrl, category: newVideoCategory }]);
    setNewVideoTitle(''); setNewVideoUrl('');
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    setActivities([...activities, { id: Date.now(), title: newActivityTitle, category: newActivityCategory, classroom: 'جميع الفصول', time: newActivityTime }]);
    setNewActivityTitle(''); setNewActivityTime('');
  };

  const deleteChild = (id) => { if (window.confirm('حذف الطفل؟')) setChildren(children.filter(c => c.id !== id)); };
  const deleteClassroom = (id) => { if (window.confirm('حذف الفصل؟')) setClassrooms(classrooms.filter(c => c.id !== id)); };
  const deleteExpense = (id) => { if (window.confirm('حذف المصروف؟')) setExpenses(expenses.filter(e => e.id !== id)); };
  const deleteRevenue = (id) => { if (window.confirm('حذف الإيراد؟')) setRevenues(revenues.filter(r => r.id !== id)); };
  const deleteVideo = (id) => { if (window.confirm('حذف الفيديو؟')) setVideos(videos.filter(v => v.id !== id)); };
  const deleteActivity = (id) => { if (window.confirm('حذف النشاط؟')) setActivities(activities.filter(a => a.id !== id)); };
  const deleteUser = (id) => { 
    if (window.confirm('حذف الحساب؟')) {
      setUsers(users.filter(u => u.id !== id));
      setUserPermissions(prev => { const newPerms = { ...prev }; delete newPerms[id]; return newPerms; });
      if (selectedUserId === id) setSelectedUserId(null);
    }
  };

  const handleStatusChange = (id, status) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const checkInTime = status !== 'absent' ? currentTime : '-';
    setChildren(children.map(c => c.id === id ? { ...c, status, checkIn: checkInTime } : c));
    setAttendanceLogs(prev => {
      const existingIndex = prev.findIndex(log => log.childId === id && log.date === today);
      if (existingIndex >= 0) {
        const newLogs = [...prev];
        newLogs[existingIndex] = { ...newLogs[existingIndex], status, checkIn: checkInTime };
        return newLogs;
      } else {
        return [...prev, { id: Date.now(), childId: id, date: today, status, checkIn: checkInTime }];
      }
    });
  };

  const maxFinance = Math.max(totalPaidRevenue, totalExpenses, Math.abs(netIncome), 1000); 
  const revenueHeight = Math.min((totalPaidRevenue / maxFinance) * 100, 100);
  const expenseHeight = Math.min((totalExpenses / maxFinance) * 100, 100);
  const netHeight = Math.min((Math.abs(netIncome) / maxFinance) * 100, 100);
    if (!isLoggedIn) {
    return (
      <div dir="rtl" className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-indigo-100 transform transition-all duration-500 scale-100 hover:scale-105">
          
          <div className="flex justify-center mb-4">
            <img src={LOGO_URL} alt="شعار حضانة الأمل" className="w-32 h-32 object-contain" />
          </div>

          <h1 className="text-2xl font-bold text-indigo-900 text-center mb-1">حضانة الأمل الخاصة</h1>
          <p className="text-indigo-500 text-xs text-center mb-6">نظام الإدارة المالي والإداري</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-xs font-semibold mb-1">اسم المستخدم</label><input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm" placeholder="admin" required /></div>
            <div><label className="block text-xs font-semibold mb-1">كلمة المرور</label><input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm" placeholder="123" required /></div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition shadow-lg text-sm transform hover:-translate-y-1">تسجيل الدخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpFade 0.6s ease-out forwards; }
        @keyframes growBar { from { height: 0; } to { height: var(--target-height); } }
        .animate-bar { animation: growBar 1s ease-out forwards; }
        .dark .bg-white { background-color: #1e293b; color: #e2e8f0; }
        .dark .bg-slate-50 { background-color: #0f172a; }
        .dark .bg-slate-100 { background-color: #334155; }
        .dark .text-slate-800, .dark .text-slate-700, .dark .text-slate-600 { color: #cbd5e1; }
        .dark .border-slate-200, .dark .border-slate-300 { border-color: #334155; }
        .dark input, .dark select { background-color: #0f172a; border-color: #334155; color: white; }
        
        @media print {
          @page { margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <header className={`px-6 py-4 flex justify-between items-center shadow-md print:hidden ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-700'} text-white`}>
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
          <div>
            <h1 className="text-lg font-bold">حضانة الأمل الخاصة - بصنبو</h1>
            <p className="text-xs text-indigo-200">نظام الإدارة الشاملة</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition transform hover:scale-105">{isDarkMode ? '☀️ وضع نهاري' : '🌙 وضع ليلي'}</button>
          <span className="text-sm font-bold">{currentUser?.name}</span>
          <span className="text-xs bg-indigo-800 px-2 py-1 rounded-lg">{currentUser?.roleLabel}</span>
          <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }} className="bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-xl text-xs transition">خروج 🚪</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 print:p-0 print:block">
        <aside className={`w-full md:w-64 rounded-3xl p-4 border shadow-sm h-fit print:hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <nav className="space-y-1">
            {hasPermission('viewDashboard') && <button onClick={() => setActiveTab('dashboard')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>📊 لوحة التحكم</button>}
            {hasPermission('viewChildren') && <button onClick={() => setActiveTab('children')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'children' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>👶 الأطفال والطلاب</button>}
            {hasPermission('manageClassrooms') && <button onClick={() => setActiveTab('classrooms')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'classrooms' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>🏫 الفصول الدراسية</button>}
            {hasPermission('manageAttendance') && <button onClick={() => setActiveTab('attendance')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'attendance' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>📋 سجل الحضور</button>}
            {hasPermission('viewFees') && <button onClick={() => setActiveTab('fees')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'fees' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>💳 الرسوم والتحصيل</button>}
            {hasPermission('viewAccounting') && <button onClick={() => setActiveTab('accounting')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'accounting' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>📈 الإيرادات والمصروفات</button>}
            {hasPermission('viewReports') && <button onClick={() => setActiveTab('reports')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>📄 التقارير الشاملة</button>}
            {hasPermission('manageActivities') && <button onClick={() => setActiveTab('activities')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'activities' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>📅 الأنشطة اليومية</button>}
            {hasPermission('manageVideos') && <button onClick={() => setActiveTab('videos')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'videos' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>🎥 الفيديوهات التعليمية</button>}
            {hasPermission('manageUsers') && <button onClick={() => setActiveTab('permissions')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'permissions' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}>🔐 إدارة الصلاحيات والمستخدمين</button>}
          </nav>
        </aside>

        <main className="flex-1 print:w-full print:m-0">
          
          {activeTab === 'dashboard' && hasPermission('viewDashboard') && (
            <div className="space-y-6 print:hidden">
              <div className={`bg-gradient-to-l from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transform transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div><h2 className="text-2xl font-extrabold mb-2">مرحباً بك أ. {currentUser?.name} ✨</h2><p className="text-indigo-200 text-sm">نظامك الإداري والمالي جاهز لمتابعة كل التفاصيل.</p></div>
                {hasPermission('backupData') && (
                  <div className="flex gap-3">
                    <button onClick={handleExportData} className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition transform hover:scale-105">💾 حفظ نسخة JSON</button>
                    <label className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition transform hover:scale-105 cursor-pointer">📂 استرجاع<input type="file" accept=".json" onChange={handleImportData} className="hidden" /></label>
                  </div>
                )}
              </div>

              {(hasPermission('viewAccounting') || hasPermission('viewFees')) ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${isMounted ? 'animate-slide-up opacity-0' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                      <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold">إجمالي الإيرادات</span><span className="text-2xl">💰</span></div>
                      <h3 className="text-3xl font-black text-emerald-500">{totalPaidRevenue} <span className="text-sm font-bold text-slate-400">ج.م</span></h3>
                    </div>
                    <div className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${isMounted ? 'animate-slide-up opacity-0' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                      <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold">إجمالي المصروفات</span><span className="text-2xl">📉</span></div>
                      <h3 className="text-3xl font-black text-rose-500">{totalExpenses} <span className="text-sm font-bold text-slate-400">ج.م</span></h3>
                    </div>
                    <div className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${isMounted ? 'animate-slide-up opacity-0' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                      <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold">صافي الربح</span><span className="text-2xl">📈</span></div>
                      <h3 className={`text-3xl font-black ${netIncome >= 0 ? 'text-indigo-500' : 'text-rose-500'}`}>{netIncome} <span className="text-sm font-bold text-slate-400">ج.م</span></h3>
                    </div>
                    <div className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${isMounted ? 'animate-slide-up opacity-0' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                      <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold">الذمم المتبقية</span><span className="text-2xl">⏳</span></div>
                      <h3 className="text-3xl font-black text-amber-500">{totalReceivableBalance} <span className="text-sm font-bold text-slate-400">ج.م</span></h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${isMounted ? 'animate-slide-up opacity-0' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                      <h3 className="font-bold mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>التحليل المالي</h3>
                      <div className="h-64 flex items-end justify-around gap-4 pb-4 border-b border-slate-300">
                        <div className="flex flex-col items-center w-1/4 group">
                          <span className="text-sm font-bold text-emerald-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{totalPaidRevenue}</span>
                          <div className="w-full bg-slate-300 rounded-t-xl relative h-48 flex items-end">
                            <div className={`w-full bg-emerald-500 rounded-t-xl transition-all duration-1000 ease-out ${isMounted ? 'animate-bar' : ''}`} style={{ '--target-height': `${revenueHeight}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-500 mt-2">الإيرادات</span>
                        </div>
                        <div className="flex flex-col items-center w-1/4 group">
                          <span className="text-sm font-bold text-rose-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{totalExpenses}</span>
                          <div className="w-full bg-slate-300 rounded-t-xl relative h-48 flex items-end">
                            <div className={`w-full bg-rose-500 rounded-t-xl transition-all duration-1000 ease-out ${isMounted ? 'animate-bar' : ''}`} style={{ '--target-height': `${expenseHeight}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-500 mt-2">المصروفات</span>
                        </div>
                        <div className="flex flex-col items-center w-1/4 group">
                          <span className="text-sm font-bold text-indigo-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{netIncome}</span>
                          <div className="w-full bg-slate-300 rounded-t-xl relative h-48 flex items-end">
                            <div className={`w-full ${netIncome >= 0 ? 'bg-indigo-500' : 'bg-rose-500'} rounded-t-xl transition-all duration-1000 ease-out ${isMounted ? 'animate-bar' : ''}`} style={{ '--target-height': `${netHeight}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-500 mt-2">صافي الربح</span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${isMounted ? 'animate-slide-up opacity-0' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                       <h3 className="font-bold mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-emerald-500 rounded-full inline-block"></span>نسبة الحضور اليوم</h3>
                      <div className="relative w-40 h-40 mx-auto rounded-full flex items-center justify-center bg-slate-300" style={{ background: `conic-gradient(#10b981 ${attendancePercentage * 3.6}deg, #cbd5e1 0deg)` }}>
                        <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                          <span className="text-3xl font-black text-emerald-500">{attendancePercentage}%</span>
                          <span className="text-xs font-bold text-slate-400 mt-1">حضور</span>
                        </div>
                      </div>
                      <div className="flex justify-around mt-8 text-sm">
                        <div className="text-center"><span className="block text-emerald-500 font-bold text-lg">{presentCount}</span><span className="text-slate-500 text-xs">حاضر</span></div>
                        <div className="text-center"><span className="block text-rose-500 font-bold text-lg">{absentCount}</span><span className="text-slate-500 text-xs">غائب</span></div>
                        <div className="text-center"><span className="block text-indigo-500 font-bold text-lg">{children.length}</span><span className="text-slate-500 text-xs">إجمالي</span></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`p-10 rounded-3xl border shadow-sm flex flex-col items-center justify-center text-center space-y-4 py-20 mt-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${isMounted ? 'animate-slide-up opacity-0' : 'opacity-0'}`}>
                  <span className="text-6xl animate-bounce">🌸</span>
                  <h3 className="text-2xl font-bold">أهلاً بك أ/ {currentUser?.name}</h3>
                  <p className="text-slate-500 max-w-md">استخدم القائمة الجانبية للوصول إلى الصفحات المسموح لك بها. نتمنى لك يوماً سعيداً!</p>
                </div>
              )}
            </div>
          )}
                    {activeTab === 'children' && hasPermission('viewChildren') && (
            <div className="space-y-6">
              <div className="hidden print:block text-center mb-6 border-b-2 border-slate-800 pb-4">
                <h1 className="text-2xl font-bold">حضانة الأمل - تقرير بيانات الأطفال</h1>
                <p className="text-sm text-slate-500">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <h2 className="text-xl font-bold">قائمة الأطفال</h2>
                <div className="flex flex-wrap gap-2">
                  <input type="text" placeholder="🔍 ابحث بالاسم أو التليفون..." value={searchChildQuery} onChange={(e) => setSearchChildQuery(e.target.value)} className={`px-4 py-2 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                  <button onClick={() => downloadCSV(children.map(c => ({ 'اسم الطفل': c.name, 'تاريخ الدخول': c.joinDate, 'رقم ولي الأمر': c.phone, 'الفصل': c.classroom, 'القسط': c.monthlyFee, 'المدفوع': c.paidFee })), 'بيانات_الأطفال', ['اسم الطفل', 'تاريخ الدخول', 'رقم ولي الأمر', 'الفصل', 'القسط', 'المدفوع'])} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition">📊 تصدير إكسيل</button>
                  <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition">🖨️ طباعة</button>
                </div>
              </div>

              {hasPermission('addChild') && (
                <div className={`p-6 rounded-3xl border shadow-sm print:hidden ${editingChildId ? 'border-indigo-400 bg-indigo-50/30' : isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-lg font-bold mb-4">{editingChildId ? '✏️ تعديل بيانات الطفل' : 'إضافة طفل جديد'}</h2>
                  <form onSubmit={handleSaveChild} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <input type="text" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} placeholder="اسم الطفل..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} required />
                    <input type="date" value={newChildDob} onChange={(e) => setNewChildDob(e.target.value)} className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} required />
                    <input type="date" value={newChildJoinDate} onChange={(e) => setNewChildJoinDate(e.target.value)} className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} required />
                    <input type="tel" value={newChildPhone} onChange={(e) => setNewChildPhone(e.target.value)} placeholder="رقم ولي الأمر..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} required />
                    <input type="number" value={newChildMonthlyFee} onChange={(e) => setNewChildMonthlyFee(e.target.value)} placeholder="القسط الشهري..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} required />
                    <select value={newChildClassroom} onChange={(e) => setNewChildClassroom(e.target.value)} className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`}>
                      {classrooms.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <select value={newChildBloodType} onChange={(e) => setNewChildBloodType(e.target.value)} className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`}><option value="O+">O+</option><option value="A+">A+</option><option value="B+">B+</option><option value="AB+">AB+</option><option value="O-">O-</option><option value="A-">A-</option><option value="B-">B-</option><option value="AB-">AB-</option></select>
                    <div className="flex gap-2">
                      <input type="text" value={newChildAllergies} onChange={(e) => setNewChildAllergies(e.target.value)} placeholder="الحساسية..." className={`w-1/2 px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} />
                      <input type="tel" value={newChildEmergencyContact} onChange={(e) => setNewChildEmergencyContact(e.target.value)} placeholder="رقم الطوارئ..." className={`w-1/2 px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} />
                    </div>
                    <div className="flex gap-2 md:col-span-4 mt-2">
                      <button type="submit" className={`flex-1 ${editingChildId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-semibold px-4 py-2 rounded-xl text-sm transition`}>
                        {editingChildId ? 'تحديث البيانات ✔️' : 'إضافة الطفل ➕'}
                      </button>
                      {editingChildId && (
                        <button type="button" onClick={cancelEditChild} className="bg-slate-400 hover:bg-slate-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">إلغاء التعديل ❌</button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              <div className={`rounded-3xl border shadow-sm print:border-0 print:shadow-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="overflow-x-auto print:overflow-visible">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className={`text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <th className="p-4 font-bold">اسم الطفل</th>
                        <th className="p-4 font-bold">بيانات طبية 🩸</th>
                        <th className="p-4 font-bold">ولي الأمر</th>
                        {(hasPermission('viewFees') || hasPermission('viewAccounting')) && (<><th className="p-4 font-bold">القسط</th><th className="p-4 font-bold">المستحق</th><th className="p-4 font-bold">المدفوع</th><th className="p-4 font-bold">المتبقي</th></>)}
                        {(hasPermission('deleteChild') || hasPermission('addChild')) && <th className="p-4 font-bold text-center print:hidden">إجراءات</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {searchedChildren.map(child => {
                        const totalDue = calculateTotalDueFee(child);
                        const balance = totalDue - (Number(child.paidFee) || 0);
                        return (
                          <tr key={child.id} className={`transition print:border-b ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                            <td className="p-4 font-semibold">{child.name}</td>
                            <td className="p-4 text-xs"><div className="flex flex-col gap-1 text-[11px]"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">فصيلة: {child.bloodType}</span>{child.allergies !== 'لا يوجد' && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">حساسية: {child.allergies}</span>}</div></td>
                            <td className="p-4 text-xs font-mono">{child.phone}</td>
                            {(hasPermission('viewFees') || hasPermission('viewAccounting')) && (<><td className="p-4 font-bold">{child.monthlyFee}</td><td className="p-4 font-bold text-indigo-500">{totalDue}</td><td className="p-4 font-bold text-emerald-500">{child.paidFee}</td><td className="p-4 font-bold text-amber-500">{balance}</td></>)}
                            {(hasPermission('deleteChild') || hasPermission('addChild')) && (
                              <td className="p-4 text-center print:hidden space-x-1 space-x-reverse whitespace-nowrap">
                                {hasPermission('addChild') && <button onClick={() => startEditChild(child)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl transition" title="تعديل">✏️</button>}
                                {hasPermission('deleteChild') && <button onClick={() => deleteChild(child.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition" title="حذف">🗑️</button>}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && hasPermission('viewFees') && (
            <div className="space-y-6">
              <div className="hidden print:block text-center mb-6 border-b-2 border-slate-800 pb-4">
                <h1 className="text-2xl font-bold">حضانة الأمل - تقرير الرسوم</h1>
                <p className="text-sm text-slate-500">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <h2 className="text-xl font-bold">تحصيل الرسوم</h2>
                <div className="flex gap-2">
                  <button onClick={() => downloadCSV(children.map(c => ({ 'اسم الطفل': c.name, 'المستحق': calculateTotalDueFee(c), 'المدفوع': c.paidFee, 'المتبقي': calculateTotalDueFee(c) - c.paidFee })), 'تقرير_الرسوم', ['اسم الطفل', 'المستحق', 'المدفوع', 'المتبقي'])} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">📊 تصدير إكسيل</button>
                  <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">🖨️ طباعة</button>
                </div>
              </div>
              <div className={`rounded-3xl border shadow-sm print:border-0 print:shadow-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="overflow-x-auto print:overflow-visible">
                  <table className="w-full text-right border-collapse">
                    <thead><tr className={`text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}><th className="p-4 font-bold">اسم الطفل</th><th className="p-4 font-bold">القسط</th><th className="p-4 font-bold">المستحق</th><th className="p-4 font-bold">المدفوع</th><th className="p-4 font-bold">المتبقي</th>{hasPermission('collectFees') && <th className="p-4 font-bold text-center print:hidden">إجراءات</th>}</tr></thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {children.map(child => {
                        const totalDue = calculateTotalDueFee(child);
                        const balance = totalDue - (Number(child.paidFee) || 0);
                        return (
                          <tr key={child.id} className={`transition print:border-b ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                            <td className="p-4 font-semibold">{child.name}</td><td className="p-4 font-bold">{child.monthlyFee}</td><td className="p-4 font-bold text-indigo-500">{totalDue}</td><td className="p-4 font-bold text-emerald-500">{child.paidFee}</td>
                            <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${balance <= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{balance <= 0 ? 'مخالص ✔️' : `${balance} متبقي`}</span></td>
                            {hasPermission('collectFees') && (
                              <td className="p-4 text-center print:hidden space-x-2 space-x-reverse">
                                {balance > 0 ? (<><button onClick={() => { const pay = prompt(`مبلغ التحصيل لـ ${child.name}:`); if (pay) handlePaymentUpdate(child.id, pay); }} className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">تحصيل 💳</button><button onClick={() => sendWhatsApp(child, balance)} className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold">واتساب 💬</button></>) : (<span className="text-xs text-slate-400">لا يوجد</span>)}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounting' && hasPermission('viewAccounting') && (
            <div className="space-y-6">
              <div className="hidden print:block text-center mb-6 border-b-2 border-slate-800 pb-4">
                <h1 className="text-2xl font-bold">حضانة الأمل - التقرير المالي</h1>
                <p className="text-sm text-slate-500">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
              <div className="flex justify-between items-center print:hidden">
                <h2 className="text-xl font-bold">الإيرادات والمصروفات</h2>
                <div className="flex gap-2">
                  <button onClick={() => downloadCSV([...revenues.map(r => ({ 'النوع': 'إيراد', 'التاريخ': r.date, 'البيان': r.title, 'المبلغ': r.amount })), ...expenses.map(e => ({ 'النوع': 'مصروف', 'التاريخ': e.date, 'البيان': e.title, 'المبلغ': e.amount }))], 'التقرير_المالي', ['النوع', 'التاريخ', 'البيان', 'المبلغ'])} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">📊 تصدير إكسيل</button>
                  <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">🖨️ طباعة</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl border shadow-sm print:border-slate-800 print:rounded-none ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}><span className="text-xs font-semibold">إجمالي الإيرادات</span><h3 className="text-2xl font-bold text-emerald-500 print:text-black">{totalPaidRevenue}</h3></div>
                <div className={`p-5 rounded-2xl border shadow-sm print:border-slate-800 print:rounded-none ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}><span className="text-xs font-semibold">إجمالي المصروفات</span><h3 className="text-2xl font-bold text-rose-500 print:text-black">{totalExpenses}</h3></div>
                <div className={`p-5 rounded-2xl border shadow-sm print:border-slate-800 print:rounded-none ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}><span className="text-xs font-semibold">صافي الربح</span><h3 className={`text-2xl font-bold print:text-black ${netIncome >= 0 ? 'text-indigo-500' : 'text-rose-500'}`}>{netIncome}</h3></div>
              </div>
              <div className={`rounded-3xl border shadow-sm mt-6 print:border-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="p-4 bg-emerald-50 border-b print:bg-transparent"><h4 className="font-bold text-emerald-800 text-sm print:text-black">سجل الإيرادات</h4></div>
                <div className="overflow-x-auto print:overflow-visible">
                  <table className="w-full text-right border-collapse">
                    <thead><tr className={`text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}><th className="p-4 font-bold">التاريخ</th><th className="p-4 font-bold">البيان</th><th className="p-4 font-bold">المبلغ</th><th className="p-4 text-center print:hidden">حذف</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {revenues.map(rev => (<tr key={rev.id} className="print:border-b"><td className="p-4 text-xs font-mono">{rev.date}</td><td className="p-4 font-semibold">{rev.title}</td><td className="p-4 font-bold text-emerald-500 print:text-black">{rev.amount}</td><td className="p-4 text-center print:hidden"><button onClick={() => deleteRevenue(rev.id)} className="text-rose-600 p-2">🗑️</button></td></tr>))}
                    </tbody>
                  </table>
                </div>
              </div>
              {hasPermission('addExpense') && (
                <div className={`p-6 rounded-3xl border shadow-sm print:hidden mt-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-lg font-bold mb-3">تسجيل مصروف جديد</h3>
                  <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input type="text" value={newExpenseTitle} onChange={(e) => setNewExpenseTitle(e.target.value)} placeholder="بيان المصروف..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} required />
                    <input type="number" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} placeholder="المبلغ..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`} required />
                    <select value={newExpenseCategory} onChange={(e) => setNewExpenseCategory(e.target.value)} className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'border-slate-300'}`}><option value="أجور ورواتب">أجور ورواتب</option><option value="إيجار ومرافق">إيجار ومرافق</option><option value="مستلزمات تعليمية">مستلزمات تعليمية</option><option value="صيانة وتشغيل">صيانة وتشغيل</option></select>
                    <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة مصروف ➕</button>
                  </form>
                </div>
              )}
              <div className={`rounded-3xl border shadow-sm mt-6 print:border-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="p-4 bg-rose-50 border-b print:bg-transparent"><h4 className="font-bold text-rose-800 text-sm print:text-black">سجل المصروفات</h4></div>
                <div className="overflow-x-auto print:overflow-visible">
                  <table className="w-full text-right border-collapse">
                    <thead><tr className={`text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}><th className="p-4 font-bold">التاريخ</th><th className="p-4 font-bold">البيان</th><th className="p-4 font-bold">المبلغ</th><th className="p-4 text-center print:hidden">حذف</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {expenses.map(exp => (<tr key={exp.id} className="print:border-b"><td className="p-4 text-xs font-mono">{exp.date}</td><td className="p-4 font-semibold">{exp.title}</td><td className="p-4 font-bold text-rose-500 print:text-black">{exp.amount}</td><td className="p-4 text-center print:hidden"><button onClick={() => deleteExpense(exp.id)} className="text-rose-600 p-2">🗑️</button></td></tr>))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && hasPermission('manageAttendance') && (
            <div className="space-y-6">
              <div className="hidden print:block text-center mb-6 border-b-2 border-slate-800 pb-4">
                <h1 className="text-2xl font-bold">حضانة الأمل - تقرير الحضور اليومي</h1>
                <p className="text-sm text-slate-500">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <h2 className="text-xl font-bold">سجل الحضور</h2>
                <div className="flex flex-wrap gap-2">
                  <input type="text" placeholder="🔍 بحث بالاسم..." value={attendanceSearchQuery} onChange={(e) => setAttendanceSearchQuery(e.target.value)} className={`px-4 py-2 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                  <select value={attendanceFilterClassroom} onChange={(e) => setAttendanceFilterClassroom(e.target.value)} className={`px-4 py-2 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}>
                    <option value="all">كل الفصول</option>
                    {classrooms.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">🖨️ طباعة</button>
                </div>
              </div>
              <div className={`rounded-3xl border shadow-sm print:border-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="overflow-x-auto print:overflow-visible">
                  <table className="w-full text-right border-collapse">
                    <thead><tr className={`text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}><th className="p-4 font-bold">الطفل</th><th className="p-4 font-bold">الفصل</th><th className="p-4 font-bold">الحالة</th><th className="p-4 font-bold">الوقت</th><th className="p-4 text-center print:hidden">التحكم</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {attendanceDisplayChildren.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-slate-400">لا يوجد أطفال مطابقين للبحث أو الفلتر.</td></tr>
                      ) : (
                        attendanceDisplayChildren.map(child => (
                          <tr key={child.id} className="print:border-b">
                            <td className="p-4 font-semibold">{child.name}</td><td className="p-4 text-xs">{child.classroom}</td>
                            <td className={`p-4 font-bold ${child.status === 'present' ? 'text-emerald-500' : 'text-rose-500'}`}>{child.status === 'present' ? 'حاضر ✔️' : 'غائب ✖️'}</td>
                            <td className="p-4 text-xs">{child.checkIn}</td>
                            <td className="p-4 text-center space-x-2 print:hidden">
                              <button onClick={() => handleStatusChange(child.id, 'present')} className={`px-3 py-1 rounded-xl text-xs font-bold ${child.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>حاضر ✔️</button>
                              <button onClick={() => handleStatusChange(child.id, 'absent')} className={`px-3 py-1 rounded-xl text-xs font-bold ${child.status === 'absent' ? 'bg-rose-500 text-white' : 'bg-slate-200'}`}>غائب ✖️</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && hasPermission('viewReports') && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center print:hidden gap-4">
                <div><h2 className="text-xl font-bold">التقارير الشاملة</h2><p className="text-sm text-slate-500 mt-1">فلتر بالفترة والفصل والطالب.</p></div>
                <div className="flex gap-2">
                  <button onClick={() => { setReportFromDate(''); setReportToDate(''); setReportChildId('all'); setReportClassroom('all'); }} className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold">🔄 إعادة تعيين</button>
                  <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md">🖨️ طباعة / تصدير PDF</button>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border shadow-sm print:hidden flex flex-wrap gap-4 items-end ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex flex-col gap-1"><label className="text-xs font-bold">من تاريخ</label><input type="date" value={reportFromDate} onChange={(e) => setReportFromDate(e.target.value)} className={`px-3 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} /></div>
                <div className="flex flex-col gap-1"><label className="text-xs font-bold">إلى تاريخ</label><input type="date" value={reportToDate} onChange={(e) => setReportToDate(e.target.value)} className={`px-3 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} /></div>
                <div className="flex flex-col gap-1"><label className="text-xs font-bold">الفصل</label><select value={reportClassroom} onChange={(e) => { setReportClassroom(e.target.value); setReportChildId('all'); }} className={`px-3 py-2 border rounded-xl text-sm min-w-[150px] ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`}><option value="all">كل الفصول</option>{[...new Set(children.map(c => c.classroom))].map((cls, idx) => (<option key={idx} value={cls}>{cls}</option>))}</select></div>
                <div className="flex flex-col gap-1"><label className="text-xs font-bold">الطالب</label><select value={reportChildId} onChange={(e) => setReportChildId(e.target.value)} className={`px-3 py-2 border rounded-xl text-sm min-w-[150px] ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`}><option value="all">كل الطلاب</option>{childrenForFilter.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm print:border-0 print:shadow-none text-slate-900">
                <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold">حضانة الأمل الخاصة</h1>
                  <div className="mt-2 text-sm space-y-1">
                    <p className="font-bold text-indigo-700">الفترة: {reportFromDate || reportToDate ? `من ${reportFromDate || 'البداية'} إلى ${reportToDate || 'الآن'}` : 'كل الفترات'}</p>
                    {reportClassroom !== 'all' && <p className="font-bold text-indigo-700">الفصل: {reportClassroom}</p>}
                    {reportChildId !== 'all' && <p className="font-bold text-indigo-700">الطالب: {children.find(c => c.id === Number(reportChildId))?.name}</p>}
                  </div>
                </div>
                <div className="mb-10">
                  <h2 className="text-lg font-bold bg-indigo-50 p-2 mb-4 print:bg-transparent print:border-b">1. التقرير المالي</h2>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="border p-3 rounded-xl text-center print:bg-transparent"><span className="text-sm font-bold">الإيرادات</span><span className="block text-xl font-bold text-emerald-700">{filteredTotalRevenue}</span></div>
                    <div className="border p-3 rounded-xl text-center print:bg-transparent"><span className="text-sm font-bold">المصروفات</span><span className="block text-xl font-bold text-rose-700">{filteredTotalExpenses}</span></div>
                    <div className="border p-3 rounded-xl text-center print:bg-transparent"><span className="text-sm font-bold">صافي الربح</span><span className="block text-xl font-bold text-indigo-700">{filteredNetIncome}</span></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-indigo-50 p-2 mb-4 print:bg-transparent print:border-b">2. تقرير الحضور والغياب</h2>
                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full text-right border-collapse border border-slate-300">
                      <thead><tr className="bg-slate-100 text-sm"><th className="p-2 border">التاريخ</th><th className="p-2 border">الطفل</th><th className="p-2 border">الفصل</th><th className="p-2 border">الحالة</th></tr></thead>
                      <tbody className="text-sm">
                        {filteredLogs.map(log => {
                          const childInfo = children.find(c => c.id === log.childId);
                          return (<tr key={log.id}><td className="p-2 border">{log.date}</td><td className="p-2 border font-bold">{childInfo?.name}</td><td className="p-2 border">{childInfo?.classroom}</td><td className={`p-2 border font-bold ${log.status === 'present' ? 'text-emerald-600' : 'text-rose-600'}`}>{log.status === 'present' ? 'حاضر' : 'غائب'}</td></tr>);
                        })}
                        {filteredLogs.length === 0 && (<tr><td colSpan="4" className="p-4 text-center">لا توجد سجلات مطابقة.</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classrooms' && hasPermission('manageClassrooms') && (
            <div className="space-y-6 print:hidden">
              <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-bold mb-4">إدارة الفصول الدراسية</h2>
                {hasPermission('manageUsers') && (
                  <form onSubmit={handleAddClassroom} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input type="text" value={newClassroomName} onChange={(e) => setNewClassroomName(e.target.value)} placeholder="اسم الفصل..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} required />
                    <input type="text" value={newClassroomSupervisor} onChange={(e) => setNewClassroomSupervisor(e.target.value)} placeholder="المشرفة..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} />
                    <input type="text" value={newClassroomAge} onChange={(e) => setNewClassroomAge(e.target.value)} placeholder="الفئة العمرية..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة فصل ➕</button>
                  </form>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classrooms.map(cls => (
                  <div key={cls.id} className={`p-6 rounded-3xl border shadow-sm flex justify-between items-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div><h3 className="font-bold text-lg">{cls.name}</h3><p className="text-slate-400 text-xs mt-1">المشرفة: {cls.supervisor}</p></div>
                    {hasPermission('manageUsers') && <button onClick={() => deleteClassroom(cls.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl">🗑️</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && hasPermission('manageVideos') && (
            <div className="space-y-6 print:hidden">
              <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-bold mb-4">الفيديوهات التعليمية</h2>
                <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input type="text" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="عنوان الفيديو..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} required />
                  <input type="url" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="رابط الفيديو..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} required />
                  <select value={newVideoCategory} onChange={(e) => setNewVideoCategory(e.target.value)} className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`}><option value="تعليمي">تعليمي</option><option value="ترفيهي">ترفيهي</option></select>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة فيديو ➕</button>
                </form>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map(vid => (
                  <div key={vid.id} className={`p-5 rounded-3xl border shadow-sm flex justify-between items-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div><h3 className="font-bold text-base mb-2">{vid.title}</h3><a href={vid.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 font-semibold hover:underline">مشاهدة الفيديو 🎥</a></div>
                    <button onClick={() => deleteVideo(vid.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl">🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && hasPermission('manageActivities') && (
            <div className="space-y-6 print:hidden">
              <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-bold mb-4">جدول الأنشطة اليومية</h2>
                <form onSubmit={handleAddActivity} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input type="text" value={newActivityTitle} onChange={(e) => setNewActivityTitle(e.target.value)} placeholder="عنوان النشاط..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} required />
                  <select value={newActivityCategory} onChange={(e) => setNewActivityCategory(e.target.value)} className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`}><option value="إنجاز">إنجاز</option><option value="وجبات">وجبات</option></select>
                  <input type="text" value={newActivityTime} onChange={(e) => setNewActivityTime(e.target.value)} placeholder="الوقت..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-700' : 'border-slate-300'}`} required />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة نشاط ➕</button>
                </form>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activities.map(act => (
                  <div key={act.id} className={`p-5 rounded-2xl border shadow-sm flex justify-between items-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div><h3 className="font-bold text-base mb-1">{act.title}</h3><p className="text-slate-400 text-xs">الوقت: {act.time}</p></div>
                    <button onClick={() => deleteActivity(act.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl">🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'permissions' && hasPermission('manageUsers') && (
            <div className="space-y-6 print:hidden">
              <div className={`p-6 rounded-3xl border shadow-sm ${editingUserId ? 'border-amber-400 bg-amber-50/30' : isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-bold mb-4">{editingUserId ? '✏️ تعديل بيانات المستخدم' : 'إدارة الصلاحيات والمستخدمين'}</h2>
                
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className={`w-full md:w-1/3 border-l pl-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <h3 className="font-bold mb-3 text-sm">اختر المستخدم لتعديل صلاحياته:</h3>
                    <div className="space-y-2">
                      {users.map(u => (
                        <button key={u.id} onClick={() => setSelectedUserId(u.id)} className={`w-full text-right px-4 py-3 rounded-xl transition border ${selectedUserId === u.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : `hover:bg-slate-100 ${isDarkMode ? 'border-slate-600' : 'bg-white border-slate-200'}`}`}>
                          <div className="flex justify-between items-center">
                            <span className="block font-bold">{u.name}</span>
                            <div className="flex gap-1">
                              <button onClick={(e) => { e.stopPropagation(); startEditUser(u); }} className="p-1 text-indigo-600 hover:bg-indigo-100 rounded">✏️</button>
                              {u.username !== 'admin' && <button onClick={(e) => { e.stopPropagation(); deleteUser(u.id); }} className="p-1 text-rose-600 hover:bg-rose-100 rounded">🗑️</button>}
                            </div>
                          </div>
                          <span className="text-xs">{u.roleLabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    {selectedUserId ? (
                      <div className={`border rounded-xl ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                        <table className="w-full text-right">
                          <thead><tr className={`text-sm ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}><th className="p-3">الصلاحية</th><th className="p-3 text-center">السماح</th></tr></thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                            {PERMISSION_LIST.map(perm => {
                              const user = users.find(u => u.id === selectedUserId);
                              const isAdmin = user?.username === 'admin';
                              const isAllowed = isAdmin ? true : (userPermissions[selectedUserId]?.[perm.key] ?? DEFAULT_ROLE_PERMISSIONS[user?.role]?.[perm.key]);
                              return (
                                <tr key={perm.key}><td className="p-3">{perm.label}</td><td className="p-3 text-center"><input type="checkbox" checked={isAllowed} onChange={() => toggleUserPermission(selectedUserId, perm.key)} disabled={isAdmin} className="w-5 h-5 accent-indigo-600" /></td></tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (<div className="text-center text-slate-400 py-10">اختر مستخدم من القائمة لعرض صلاحياته</div>)}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                  <h3 className="text-lg font-bold mb-3">{editingUserId ? 'تحديث بيانات المستخدم' : 'إضافة مستخدم جديد'}</h3>
                  <form onSubmit={handleSaveUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="الاسم الكامل..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'border-slate-300'}`} required />
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="اسم المستخدم..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'border-slate-300'}`} required />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور..." className={`px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'border-slate-300'}`} required />
                    <div className="flex gap-2">
                      <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={`flex-1 px-3 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'border-slate-300'}`}><option value="admin">مدير النظام</option><option value="teacher">معلمة</option><option value="accountant">محاسب</option></select>
                      <button type="submit" className={`${editingUserId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-semibold px-4 py-2 rounded-xl text-sm transition`}>{editingUserId ? 'تحديث ✔️' : 'إضافة ➕'}</button>
                      {editingUserId && (
                        <button type="button" onClick={cancelEditUser} className="bg-slate-400 hover:bg-slate-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition">إلغاء ❌</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {receiptData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-8">
              <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4 flex flex-col items-center">
                <img src={LOGO_URL} alt="Logo" className="w-20 h-20 object-contain mb-2" />
                <h2 className="text-2xl font-black text-indigo-900">حضانة الأمل</h2>
                <p className="text-xs text-slate-500 font-bold mt-1">إيصال استلام نقدية</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span>اسم الطالب:</span><span className="font-bold">{receiptData.childName}</span></div>
                <div className="flex justify-between border-b pb-2"><span>التاريخ:</span><span className="font-bold">{receiptData.date}</span></div>
                <div className="flex justify-between border-b pb-2 bg-emerald-50 p-2 rounded"><span className="text-emerald-700 font-bold">المبلغ المدفوع:</span><span className="font-black text-emerald-700">{receiptData.amountPaid} ج.م</span></div>
                <div className="flex justify-between border-b pb-2"><span>المتبقي:</span><span className="font-bold text-rose-600">{receiptData.remaining} ج.م</span></div>
              </div>
              <div className="text-center mt-8 pt-4 border-t-2 border-dashed border-slate-300"><p className="text-xs text-slate-400">شكراً لتعاملكم معنا.</p></div>
            </div>
            <div className="bg-slate-100 p-4 flex gap-2">
              <button onClick={printReceipt} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition shadow-md">🖨️ طباعة</button>
              <button onClick={() => setReceiptData(null)} className="flex-1 bg-white text-slate-600 border border-slate-300 font-bold py-2.5 rounded-xl">إغلاق</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

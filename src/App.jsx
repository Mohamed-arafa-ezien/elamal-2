import React, { useState, useEffect } from 'react';

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
  { key: 'manageSettings', label: 'إعدادات المؤسسة واللوجو' },
];

const DEFAULT_ROLE_PERMISSIONS = {
  admin: { viewDashboard: true, viewChildren: true, addChild: true, deleteChild: true, viewFees: true, collectFees: true, viewAccounting: true, addExpense: true, viewReports: true, manageClassrooms: true, manageAttendance: true, manageActivities: true, manageVideos: true, manageUsers: true, backupData: true, manageSettings: true },
  teacher: { viewDashboard: true, viewChildren: true, addChild: true, deleteChild: true, viewFees: false, collectFees: false, viewAccounting: false, addExpense: false, viewReports: false, manageClassrooms: true, manageAttendance: true, manageActivities: true, manageVideos: true, manageUsers: false, backupData: false, manageSettings: false },
  accountant: { viewDashboard: true, viewChildren: true, addChild: true, deleteChild: false, viewFees: true, collectFees: true, viewAccounting: true, addExpense: true, viewReports: true, manageClassrooms: false, manageAttendance: false, manageActivities: false, manageVideos: false, manageUsers: false, backupData: false, manageSettings: false }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ✅ إعدادات المؤسسة
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('nursery_settings');
    return saved ? JSON.parse(saved) : { 
      name: 'حضانة الأمل الخاصة', 
      subTitle: 'نظام الإدارة الشاملة', 
      logo: null 
    };
  });

  useEffect(() => {
    localStorage.setItem('nursery_settings', JSON.stringify(settings));
  }, [settings]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
    const backupData = { users, children, revenues, expenses, classrooms, videos, activities, userPermissions, attendanceLogs, settings };
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
        if (parsed.settings) setSettings(parsed.settings);
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
    if (cleanPhone.startsWith('00')) cleanPhone = cleanPhone.substring(2);
    if (cleanPhone.startsWith('0')) cleanPhone = '20' + cleanPhone.substring(1);
    else if (cleanPhone.startsWith('1') && cleanPhone.length === 10) cleanPhone = '20' + cleanPhone;
    const msg = `أهلاً أ/ ${child.name.split(' ')[0]}، نود تذكيركم بضرورة سداد باقي أقساط الطفل ${child.name} وقدرها ${balance} جنيه. شكراً لكم - ${settings.name}.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const printReceipt = () => {
    if (!receiptData) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="rtl"><head><title>إيصال دفع</title><style>body { font-family: 'Segoe UI', sans-serif; padding: 30px; text-align: right; } .header { text-align: center; border-bottom: 2px dashed #ccc; margin-bottom: 20px; padding-bottom: 10px; display: flex; flex-direction: column; align-items: center; } .logo { width: 100px; height: 100px; object-fit: contain; margin-bottom: 10px; } .row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; } .total { background-color: #ecfdf5; padding: 12px; font-weight: bold; color: #047857; }</style></head>
      <body>
        <div class="header">
          ${settings.logo ? `<img src="${settings.logo}" class="logo" alt="Logo" />` : ''}
          <h2>${settings.name}</h2>
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
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="w-32 h-32 object-contain" />
            ) : (
              <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-400 font-bold">لا يوجد لوجو</div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-indigo-900 text-center mb-1">{settings.name}</h1>
          <p className="text-indigo-500 text-xs text-center mb-6">{settings.subTitle}</p>
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
    <div dir="rtl" className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark

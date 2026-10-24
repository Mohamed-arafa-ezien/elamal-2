import React, { useState } from 'react';
import {
Users,
UserCheck,
UserX,
Plus,
Search,
Trash2,
Calendar,
Heart,
Baby
} from 'lucide-react';

export default function App() {
const [children, setChildren] = useState([
{ id: 1, name: 'أحمد محمد', age: '4 سنوات', isPresent: true, date: '2026-10-24' },
{ id: 2, name: 'مريم علي', age: '3 سنوات', isPresent: false, date: '2026-10-24' },
{ id: 3, name: 'عمر خالد', age: '5 سنوات', isPresent: true, date: '2026-10-24' },
{ id: 4, name: 'فاطمة حسن', age: '4 سنوات', isPresent: true, date: '2026-10-24' },
]);

const [newName, setNewName] = useState('');
const [newAge, setNewAge] = useState('');
const [searchTerm, setSearchTerm] = useState('');

// إحصائيات الأطفال
const totalCount = children.length;
const presentCount = children.filter((child) => child.isPresent).length;
const absentCount = totalCount - presentCount;

// إضافة طفل جديد
const handleAddChild = (e) => {
e.preventDefault();
if (!newName.trim() || !newAge.trim()) return;

const newChild = {
  id: Date.now(),
  name: newName,
  age: newAge,
  isPresent: true,
  date: new Date().toISOString().split('T')[0],
};

setChildren([...children, newChild]);
setNewName('');
setNewAge('');


};

// تغيير حالة الحضور/الغياب
const toggleAttendance = (id) => {
setChildren(
children.map((child) =>
child.id === id ? { ...child, isPresent: !child.isPresent } : child
)
);
};

// حذف طفل
const handleDelete = (id) => {
setChildren(children.filter((child) => child.id !== id));
};

// تصفية الأطفال حسب البحث
const filteredChildren = children.filter((child) =>
child.name.toLowerCase().includes(searchTerm.toLowerCase())
);

return (

{/* Header */}







روضة الأمل
نظام تسجيل وحضور الأطفال




{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}




  <main className="max-w-6xl mx-auto px-4 py-8">
    {/* Statistics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">إجمالي الأطفال</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalCount}</h3>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
          <Users className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">الحاضرون</p>
          <h3 className="text-3xl font-bold text-emerald-600 mt-1">{presentCount}</h3>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
          <UserCheck className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">الغياب</p>
          <h3 className="text-3xl font-bold text-rose-600 mt-1">{absentCount}</h3>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl text-rose-600">
          <UserX className="w-6 h-6" />
        </div>
      </div>
    </div>

    {/* Form and List Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add Child Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          إضافة طفل جديد
        </h2>
        <form onSubmit={handleAddChild} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم الطفل</label>
            <input
              type="text"
              placeholder="مثال: أحمد محمد"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">العمر</label>
            <input
              type="text"
              placeholder="مثال: 4 سنوات"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            حفظ البيانات
          </button>
        </form>
      </div>

      {/* Children List */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-bold text-slate-800">قائمة الأطفال</h2>
          
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث عن طفل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* List */}
        {filteredChildren.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            لا يوجد أطفال مطبق عليهم خيار البحث.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${child.isPresent ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{child.name}</h4>
                    <span className="text-xs text-slate-500">{child.age}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAttendance(child.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      child.isPresent
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                  >
                    {child.isPresent ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        حاضر
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        غائب
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(child.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </main>
</div>


);
}

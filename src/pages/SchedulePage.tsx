import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  X,
  BookOpen,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { ScheduleItem } from '../types';

export const SchedulePage: React.FC = () => {
  const { schedule, addScheduleItem } = useLms();
  const [selectedDay, setSelectedDay] = useState<string>('Barchasi');
  const [showAddModal, setShowAddModal] = useState(false);

  // New class form
  const [newDay, setNewDay] = useState<ScheduleItem['day']>('Dushanba');
  const [newSubject, setNewSubject] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:30');
  const [newRoom, setNewRoom] = useState('');
  const [newType, setNewType] = useState<ScheduleItem['type']>('Amaliyot');

  const days: ScheduleItem['day'][] = [
    'Dushanba',
    'Seshanba',
    'Chorshanba',
    'Payshanba',
    'Juma',
    'Shanba',
  ];

  const filteredSchedule = schedule.filter((item) => {
    return selectedDay === 'Barchasi' || item.day === selectedDay;
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTeacher.trim() || !newRoom.trim()) {
      return;
    }

    addScheduleItem({
      day: newDay,
      subject: newSubject,
      teacher: newTeacher,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom,
      type: newType,
      color: 'border-l-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/20',
    });

    setNewSubject('');
    setNewTeacher('');
    setNewRoom('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            📅 Haftalik Dars Jadvali
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dushanbadan Shanbagacha bo'lgan barcha ma'ruza, amaliyot va laboratoriya mashg'ulotlari
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Dars Qo'shish</span>
        </button>
      </div>

      {/* Days Tabs (Dushanba, Seshanba, Chorshanba, Payshanba, Juma, Shanba) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDay('Barchasi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedDay === 'Barchasi'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          Barcha Kunlar
        </button>

        {days.map((day) => {
          const count = schedule.filter((s) => s.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  selectedDay === day
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Items Grid / Timeline */}
      {selectedDay === 'Barchasi' ? (
        <div className="space-y-8">
          {days.map((day) => {
            const dayItems = schedule.filter((s) => s.day === day);
            if (dayItems.length === 0) return null;

            return (
              <div key={day} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-indigo-600" />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {day}
                  </h3>
                  <span className="text-xs text-slate-400">
                    ({dayItems.length} ta dars)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayItems.map((item) => (
                    <ScheduleCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedule.map((item) => (
            <ScheduleCard key={item.id} item={item} />
          ))}
          {filteredSchedule.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 font-semibold">
                Ushbu kunda hech qanday dars belgilanmagan.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                Jadvalga dars qo'shish
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Hafta kuni
                </label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value as ScheduleItem['day'])}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Fan nomi
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Masalan: Web Dasturlash, Kiberxavfsizlik..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  O‘qituvchi
                </label>
                <input
                  type="text"
                  required
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  placeholder="Ustoz F.I.SH."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Boshlanish vaqti
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tugash vaqti
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Auditoriya / Xona
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="Masalan: 304-xona, IT Lab 1"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Dars turi
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ScheduleItem['type'])}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                  >
                    <option value="Ma'ruza">Ma'ruza</option>
                    <option value="Amaliyot">Amaliyot</option>
                    <option value="Laboratoriya">Laboratoriya</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual schedule cards
const ScheduleCard: React.FC<{ item: ScheduleItem }> = ({ item }) => {
  return (
    <div
      className={`p-5 rounded-2xl border-l-4 ${item.color} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 inline-block mb-1.5">
            {item.type}
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
            {item.subject}
          </h4>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {item.startTime} - {item.endTime}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span className="truncate">{item.teacher}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>{item.room}</span>
        </div>
      </div>
    </div>
  );
};

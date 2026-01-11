import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';

const PEOPLE = {
  Kami: { color: 'bg-rose-400', text: 'text-rose-700', light: 'bg-rose-100', border: 'border-rose-400' },
  HJ: { color: 'bg-sky-400', text: 'text-sky-700', light: 'bg-sky-100', border: 'border-sky-400' },
  Levi: { color: 'bg-amber-400', text: 'text-amber-700', light: 'bg-amber-100', border: 'border-amber-400' },
  Bert: { color: 'bg-emerald-400', text: 'text-emerald-700', light: 'bg-emerald-100', border: 'border-emerald-400' },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({ person: 'Kami', text: '' });

  const year = 2026;

  const getDaysInMonth = (month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () => setCurrentMonth((m) => (m === 11 ? 0 : m + 1));

  const getDateKey = (day) => `${year}-${currentMonth}-${day}`;

  const openModal = (day) => {
    setSelectedDate(day);
    setShowModal(true);
    setNewNote({ person: 'Kami', text: '' });
  };

  const addNote = () => {
    if (!newNote.text.trim()) return;
    const key = getDateKey(selectedDate);
    setNotes((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { ...newNote, id: Date.now() }],
    }));
    setNewNote({ person: 'Kami', text: '' });
  };

  const deleteNote = (noteId) => {
    const key = getDateKey(selectedDate);
    setNotes((prev) => ({
      ...prev,
      [key]: prev[key].filter((n) => n.id !== noteId),
    }));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = getDateKey(day);
      const dayNotes = notes[key] || [];
      const isToday = new Date().getFullYear() === year && 
                      new Date().getMonth() === currentMonth && 
                      new Date().getDate() === day;

      days.push(
        <div
          key={day}
          onClick={() => openModal(day)}
          className={`h-24 p-1.5 rounded-lg cursor-pointer transition-all hover:shadow-md border-2 ${
            isToday ? 'border-indigo-500 bg-indigo-50' : 'border-transparent bg-white hover:border-gray-200'
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-0.5 overflow-hidden">
            {dayNotes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                className={`text-xs px-1.5 py-0.5 rounded truncate ${PEOPLE[note.person].color} text-white`}
              >
                {note.text}
              </div>
            ))}
            {dayNotes.length > 3 && (
              <div className="text-xs text-gray-500 px-1">+{dayNotes.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">2026 Family Calendar</h1>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(PEOPLE).map(([name, styles]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full ${styles.color}`} />
                <span className="text-sm font-medium text-gray-600">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{MONTHS[currentMonth]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
            {MONTHS.map((month, idx) => (
              <button
                key={month}
                onClick={() => setCurrentMonth(idx)}
                className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  currentMonth === idx ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{MONTHS[currentMonth]} {selectedDate}, {year}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {(notes[getDateKey(selectedDate)] || []).map((note) => (
                  <div key={note.id} className={`flex items-center gap-2 p-2 rounded-lg ${PEOPLE[note.person].light} ${PEOPLE[note.person].border} border-2`}>
                    <div className={`w-2 h-full min-h-6 rounded-full ${PEOPLE[note.person].color}`} />
                    <div className="flex-1">
                      <span className={`text-xs font-semibold ${PEOPLE[note.person].text}`}>{note.person}</span>
                      <p className="text-sm text-gray-700">{note.text}</p>
                    </div>
                    <button onClick={() => deleteNote(note.id)} className="p-1 hover:bg-white/50 rounded-full">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
                {(notes[getDateKey(selectedDate)] || []).length === 0 && (
                  <p className="text-gray-400 text-center py-4">No notes for this day</p>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-2 mb-3">
                  {Object.entries(PEOPLE).map(([name, styles]) => (
                    <button
                      key={name}
                      onClick={() => setNewNote((n) => ({ ...n, person: name }))}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                        newNote.person === name ? `${styles.color} text-white shadow-md` : `${styles.light} ${styles.text} hover:opacity-80`
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote.text}
                    onChange={(e) => setNewNote((n) => ({ ...n, text: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400"
                  />
                  <button onClick={addNote} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

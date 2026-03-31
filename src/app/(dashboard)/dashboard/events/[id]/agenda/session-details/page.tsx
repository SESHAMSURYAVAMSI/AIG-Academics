"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/* ================= TYPES ================= */

type Session = {
  id: number;
  title: string;
  hall: string;
  date: string;
  start: string;
  end: string;
  description: string;
  sessionDate: string;
  track: string;
  active: boolean;
};

type SessionDate = {
  id: number;
  name: string;
  active: boolean;
};

type Track = {
  id: number;
  name: string;
  active: boolean;
};

export default function SessionDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const sessionKey = `sessions_${id}`;
  const sessionDateKey = `sessionDates_${id}`;
  const trackKey = `tracks_${id}`;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionDates, setSessionDates] = useState<SessionDate[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    hall: "",
    date: "",
    start: "",
    end: "",
    description: "",
    sessionDate: "",
    track: "",
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessions(JSON.parse(localStorage.getItem(sessionKey) || "[]"));
    setSessionDates(JSON.parse(localStorage.getItem(sessionDateKey) || "[]"));
    setTracks(JSON.parse(localStorage.getItem(trackKey) || "[]"));
  }, [id]);

  const saveData = (data: Session[]) => {
    setSessions(data);
    localStorage.setItem(sessionKey, JSON.stringify(data));
  };

  const handleSubmit = () => {
    if (!form.title || !form.start || !form.end) return;

    if (editingId) {
      saveData(
        sessions.map((s) => (s.id === editingId ? { ...s, ...form } : s)),
      );
    } else {
      saveData([...sessions, { id: Date.now(), ...form }]);
    }

    setForm({
      title: "",
      hall: "",
      date: "",
      start: "",
      end: "",
      description: "",
      sessionDate: "",
      track: "",
      active: true,
    });

    setEditingId(null);
    setOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    saveData(sessions.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  const handleEdit = (s: Session) => {
    setForm({ ...s });
    setEditingId(s.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Session Details</h1>
        <Button onClick={() => setOpen(true)}>+ Add Session</Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Hall</th>
              <th className="p-4 text-left">Time</th>
              <th className="p-4 text-left">Track</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-400">
                  No sessions added
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50 group">
                  <td className="p-4 font-medium">{s.title}</td>
                  <td className="p-4">{s.hall}</td>
                  <td className="p-4">
                    {s.start} - {s.end}
                  </td>
                  <td className="p-4">{s.track}</td>
                  <td className="p-4">{s.sessionDate}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        s.active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ✅ PREMIUM ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                        hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 
                        transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                        hover:bg-red-50 hover:border-red-200 hover:text-red-600 
                        transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 w-[420px] h-full bg-white p-6 shadow-xl overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? "Edit Session" : "Add Session"}
              </h2>

              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Hall</Label>
                  <Input
                    value={form.hall}
                    onChange={(e) => setForm({ ...form, hall: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={form.start}
                      onChange={(e) =>
                        setForm({ ...form, start: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={form.end}
                      onChange={(e) =>
                        setForm({ ...form, end: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Session Date</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={form.sessionDate}
                    onChange={(e) =>
                      setForm({ ...form, sessionDate: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {sessionDates
                      .filter((s) => s.active)
                      .map((s) => (
                        <option key={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <Label>Track</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={form.track}
                    onChange={(e) =>
                      setForm({ ...form, track: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {tracks
                      .filter((t) => t.active)
                      .map((t) => (
                        <option key={t.id}>{t.name}</option>
                      ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <Label>Status</Label>
                  <Switch
                    checked={form.active}
                    onCheckedChange={(val) => setForm({ ...form, active: val })}
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DELETE POPUP */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <motion.div className="bg-white p-6 rounded-xl w-[300px]">
              <h2 className="font-semibold mb-2">Delete Session?</h2>
              <p className="text-sm text-gray-500 mb-4">Are you sure?</p>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-500 text-white"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

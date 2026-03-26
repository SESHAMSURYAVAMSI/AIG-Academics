"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/* ================= TYPES ================= */

type Track = {
  id: number;
  name: string;
  color: string;
  sessionDate: string;
  active: boolean;
};

type SessionDate = {
  id: number;
  name: string;
  color: string;
  active: boolean;
};

export default function TrackPage() {
  const params = useParams();
  const id = params?.id as string;

  const trackKey = `tracks_${id}`;
  const sessionKey = `sessionDates_${id}`;

  const [tracks, setTracks] = useState<Track[]>([]);
  const [sessionDates, setSessionDates] = useState<SessionDate[]>([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    color: "#6366f1",
    sessionDate: "",
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTracks(JSON.parse(localStorage.getItem(trackKey) || "[]"));
    setSessionDates(JSON.parse(localStorage.getItem(sessionKey) || "[]"));
  }, [id]);

  const saveData = (data: Track[]) => {
    setTracks(data);
    localStorage.setItem(trackKey, JSON.stringify(data));
  };

  const handleSubmit = () => {
    if (!form.name || !form.sessionDate) return;

    if (editingId) {
      saveData(
        tracks.map((t) =>
          t.id === editingId ? { ...t, ...form } : t
        )
      );
    } else {
      saveData([...tracks, { id: Date.now(), ...form }]);
    }

    setForm({
      name: "",
      color: "#6366f1",
      sessionDate: "",
      active: true,
    });

    setEditingId(null);
    setOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    saveData(tracks.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  const handleEdit = (t: Track) => {
    setForm({
      name: t.name,
      color: t.color,
      sessionDate: t.sessionDate,
      active: t.active,
    });
    setEditingId(t.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tracks</h1>
        <Button onClick={() => setOpen(true)}>+ Add Track</Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Track Name</th>
              <th className="p-4 text-left">Color</th>
              <th className="p-4 text-left">Session Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tracks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400">
                  No tracks added
                </td>
              </tr>
            ) : (
              tracks.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50 group">

                  <td className="p-4 font-medium">{t.name}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: t.color }}
                      />
                      {t.color}
                    </div>
                  </td>

                  <td className="p-4">{t.sessionDate}</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      t.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {t.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ✅ PREMIUM ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-4">

                      <button
                        onClick={() => handleEdit(t)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                        hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 
                        transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(t.id)}
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
              className="fixed top-0 right-0 w-[400px] h-full bg-white p-6 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? "Edit Track" : "Add Track"}
              </h2>

              <div className="space-y-5">

                <div>
                  <Label>Track Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Track Color</Label>
                  <Input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
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
                    <option value="">Select Date</option>
                    {sessionDates
                      .filter((s) => s.active)
                      .map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <Label>Status</Label>
                  <Switch
                    checked={form.active}
                    onCheckedChange={(val) =>
                      setForm({ ...form, active: val })
                    }
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
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div className="bg-white p-6 rounded-xl shadow-lg w-[300px]">
              <h2 className="text-lg font-semibold mb-3">
                Delete Track?
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                Are you sure you want to delete this?
              </p>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>

                <Button className="bg-red-500 text-white" onClick={confirmDelete}>
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
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/* ================= TYPES ================= */

type SessionDate = {
  id: number;
  name: string;
  color: string;
  active: boolean;
};

export default function SessionDatePage() {
  const params = useParams();
  const id = params?.id as string;

  const storageKey = `sessionDates_${id}`;

  const [data, setData] = useState<SessionDate[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    color: "#6366f1",
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(stored ? JSON.parse(stored) : []);
  }, [id]);

  const saveData = (updated: SessionDate[]) => {
    setData(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (!form.name) return;

    if (editingId) {
      saveData(
        data.map((d) => (d.id === editingId ? { ...d, ...form } : d))
      );
    } else {
      saveData([...data, { id: Date.now(), ...form }]);
    }

    setForm({ name: "", color: "#6366f1", active: true });
    setEditingId(null);
    setOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    saveData(data.filter((d) => d.id !== deleteId));
    setDeleteId(null);
  };

  const handleEdit = (d: SessionDate) => {
    setForm({
      name: d.name,
      color: d.color,
      active: d.active,
    });
    setEditingId(d.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Session Dates</h1>

        <Button onClick={() => setOpen(true)}>
          + Add Session Date
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Color</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-400">
                  No session dates added
                </td>
              </tr>
            ) : (
              data.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50 group transition">

                  <td className="p-4 font-medium">{d.name}</td>

                  {/* COLOR */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.color}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        d.active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {d.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ✅ PREMIUM ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-4">

                      {/* EDIT */}
                      <button
                        onClick={() => handleEdit(d)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                        hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 
                        transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => setDeleteId(d.id)}
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
                {editingId ? "Edit Session Date" : "Add Session Date"}
              </h2>

              <div className="space-y-5">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                  />
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

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div className="bg-white p-6 rounded-xl shadow-lg w-[300px]">
              <h2 className="text-lg font-semibold mb-3">
                Delete Session Date?
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                Are you sure you want to delete this?
              </p>

              <div className="flex justify-end gap-3">
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
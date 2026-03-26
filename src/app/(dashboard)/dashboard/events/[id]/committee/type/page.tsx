"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Type = {
  id: number;
  name: string;
  active: boolean;
};

export default function CommitteeType() {
  const params = useParams();
  const id = params?.id as string;

  const storageKey = `committeeTypes_${id}`;

  const [types, setTypes] = useState<Type[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTypes(JSON.parse(stored));
    } else {
      setTypes([]);
    }
  }, [id]);

  /* SAVE */
  const saveToStorage = (data: Type[]) => {
    setTypes(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const handleSubmit = () => {
    if (!form.name) return;

    if (editingId) {
      const updated = types.map((t) =>
        t.id === editingId ? { ...t, ...form } : t,
      );
      saveToStorage(updated);
    } else {
      saveToStorage([...types, { id: Date.now(), ...form }]);
    }

    setForm({ name: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  /* DELETE */
  const confirmDelete = () => {
    if (deleteId === null) return;

    const updated = types.filter((t) => t.id !== deleteId);
    saveToStorage(updated);
    setDeleteId(null);
  };

  const handleEdit = (t: Type) => {
    setForm({ name: t.name, active: t.active });
    setEditingId(t.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Committee Types</h1>

        <Button onClick={() => setOpen(true)}>+ Add Type</Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Type Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {types.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-400">
                  No types added
                </td>
              </tr>
            ) : (
              types.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{t.name}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        t.active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {t.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ✅ UPDATED ACTIONS */}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 w-[400px] h-full bg-white p-6 shadow-xl z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? "Edit Type" : "Add Type"}
              </h2>

              <div className="space-y-5">
                <div>
                  <Label>Committee Type</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between">
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

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId !== null && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
            />

            <motion.div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.85, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, y: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-[360px] p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold">
                  Are you sure to delete?
                </h2>

                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setDeleteId(null)}>
                    Cancel
                  </Button>

                  <Button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

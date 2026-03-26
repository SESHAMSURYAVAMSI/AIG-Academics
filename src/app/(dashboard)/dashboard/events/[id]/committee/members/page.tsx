"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Member = {
  id: number;
  name: string;
  type: string;
  active: boolean;
};

type Type = {
  id: number;
  name: string;
  active: boolean;
};

export default function CommitteeMembers() {
  const params = useParams();
  const id = params?.id as string;

  const memberKey = `members_${id}`;
  const typeKey = `committeeTypes_${id}`;

  const [members, setMembers] = useState<Member[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;

    const storedMembers = localStorage.getItem(memberKey);
    const storedTypes = localStorage.getItem(typeKey);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMembers(storedMembers ? JSON.parse(storedMembers) : []);
    setTypes(storedTypes ? JSON.parse(storedTypes) : []);
  }, [id]);

  const saveMembers = (data: Member[]) => {
    setMembers(data);
    localStorage.setItem(memberKey, JSON.stringify(data));
  };

  /* ADD / UPDATE */
  const handleSubmit = () => {
    if (!form.name || !form.type) return;

    if (editingId) {
      const updated = members.map((m) =>
        m.id === editingId ? { ...m, ...form } : m,
      );
      saveMembers(updated);
    } else {
      saveMembers([...members, { id: Date.now(), ...form }]);
    }

    setForm({ name: "", type: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    saveMembers(members.filter((m) => m.id !== id));
  };

  const handleEdit = (m: Member) => {
    setForm({
      name: m.name,
      type: m.type,
      active: m.active,
    });
    setEditingId(m.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Committee Members</h1>

        <Button onClick={() => setOpen(true)}>+ Add Member</Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          {/* ✅ FIXED HEADER */}
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-400">
                  No members added
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{m.name}</td>
                  <td className="p-4">{m.type}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        m.active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {m.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ✅ FIXED ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => handleEdit(m)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                        hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 
                        transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(m.id)}
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
                {editingId ? "Edit Member" : "Add Member"}
              </h2>

              <div className="space-y-5">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Committee Type</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    {types
                      .filter((t) => t.active)
                      .map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                  </select>
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
    </div>
  );
}

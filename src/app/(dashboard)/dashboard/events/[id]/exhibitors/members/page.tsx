"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MoreVertical } from "lucide-react";

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

export default function ExhibitorMembers() {
  const params = useParams();
  const id = params?.id as string;

  const memberKey = `exhibitorMembers_${id}`;
  const typeKey = `exhibitorTypes_${id}`;

  const [members, setMembers] = useState<Member[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    active: true,
  });

  // LOAD
  useEffect(() => {
    if (!id) return;

    const storedMembers = localStorage.getItem(memberKey);
    const storedTypes = localStorage.getItem(typeKey);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedMembers) setMembers(JSON.parse(storedMembers));
    else setMembers([]);
    
    if (storedTypes) setTypes(JSON.parse(storedTypes));
    else setTypes([]);
  }, [id]);

  const saveData = (data: Member[]) => {
    setMembers(data);
    localStorage.setItem(memberKey, JSON.stringify(data));
  };

  const handleSubmit = () => {
    if (!form.name || !form.type) return;

    if (editingId) {
      const updated = members.map((m) =>
        m.id === editingId ? { ...m, ...form } : m
      );
      saveData(updated);
    } else {
      saveData([
        ...members,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({ name: "", type: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    saveData(members.filter((m) => m.id !== id));
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
        <h1 className="text-2xl font-semibold">Exhibitor Members</h1>

        <Button onClick={() => setOpen(true)}>
          + Add Member
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
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

                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(m)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(m.id)}
                          className="text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                {editingId ? "Edit Member" : "Add Member"}
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
                  <Label>Type</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
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
    </div>
  );
}
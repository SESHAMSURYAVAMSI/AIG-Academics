"use client";

import { useState, useEffect } from "react";
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

type Type = {
  id: number;
  name: string;
  active: boolean;
};

export default function ExhibitorType() {
  const [types, setTypes] = useState<Type[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    active: true,
  });

  // LOAD
  useEffect(() => {
    const stored = localStorage.getItem("exhibitorTypes_${id}");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setTypes(JSON.parse(stored));
  }, []);

  const saveData = (data: Type[]) => {
    setTypes(data);
    localStorage.setItem("exhibitorTypes_${id}", JSON.stringify(data));
  };

  // ADD / UPDATE
  const handleSubmit = () => {
    if (!form.name) return;

    if (editingId) {
      const updated = types.map((t) =>
        t.id === editingId ? { ...t, ...form } : t
      );
      saveData(updated);
    } else {
      const newType: Type = {
        id: Date.now(),
        ...form,
      };
      saveData([...types, newType]);
    }

    setForm({ name: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  // DELETE
  const handleDelete = (id: number) => {
    saveData(types.filter((t) => t.id !== id));
  };

  // EDIT
  const handleEdit = (t: Type) => {
    setForm({ name: t.name, active: t.active });
    setEditingId(t.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Exhibitor Types</h1>
        <Button onClick={() => setOpen(true)}>+ Add Type</Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Type Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
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
                <tr key={t.id} className="border-t hover:bg-gray-50">
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

                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(t)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(t.id)}
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
                {editingId ? "Edit Type" : "Add Type"}
              </h2>

              <div className="space-y-5">
                <div>
                  <Label>Exhibitor Type</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
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
    </div>
  );
}
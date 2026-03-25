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

type Speaker = {
  id: number;
  name: string;
  type: string;
  location: string;
  active: boolean;
};

export default function SpeakerPage() {
  const params = useParams();
  const id = params?.id as string; // ✅ event id

  const storageKey = `speakers_${id}`; // ✅ UNIQUE KEY PER EVENT

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    active: true,
  });

  // ✅ LOAD DATA (PER EVENT)
  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem(storageKey);

    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSpeakers(JSON.parse(stored));
    } else {
      setSpeakers([]); // 🔥 prevent data leakage
    }
  }, [id]);

  // ✅ SAVE DATA (PER EVENT)
  const saveData = (data: Speaker[]) => {
    setSpeakers(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  // ADD / UPDATE
  const handleSubmit = () => {
    if (!form.name || !form.type) return;

    if (editingId) {
      const updated = speakers.map((s) =>
        s.id === editingId ? { ...s, ...form } : s
      );
      saveData(updated);
    } else {
      const newSpeaker: Speaker = {
        id: Date.now(),
        ...form,
      };
      saveData([...speakers, newSpeaker]);
    }

    setForm({ name: "", type: "", location: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  // DELETE
  const handleDelete = (id: number) => {
    const updated = speakers.filter((s) => s.id !== id);
    saveData(updated);
  };

  // EDIT
  const handleEdit = (speaker: Speaker) => {
    setForm({
      name: speaker.name,
      type: speaker.type,
      location: speaker.location,
      active: speaker.active,
    });
    setEditingId(speaker.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Speakers</h1>

        <Button onClick={() => setOpen(true)}>
          + Add Speaker
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {speakers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400">
                  No speakers added
                </td>
              </tr>
            ) : (
              speakers.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4">{s.type}</td>
                  <td className="p-4">{s.location}</td>

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

                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleEdit(s)}
                        >
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(s.id)}
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
                {editingId ? "Edit Speaker" : "Add Speaker"}
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
                  <Label>Speaker Type</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="National">National</option>
                    <option value="International">International</option>
                  </select>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
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
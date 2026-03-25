"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";

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
import { MoreVertical, Upload } from "lucide-react";

type Delegate = {
  id: number;
  name: string;
  designation: string;
  email: string;
  active: boolean;
};

export default function DelegatePage() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    email: "",
    active: true,
  });

  // LOAD
  useEffect(() => {
    const stored = localStorage.getItem("delegates");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setDelegates(JSON.parse(stored));
  }, []);

  const saveData = (data: Delegate[]) => {
    setDelegates(data);
    localStorage.setItem("delegates", JSON.stringify(data));
  };

  // ADD / UPDATE
  const handleSubmit = () => {
    if (!form.name || !form.email) return;

    if (editingId) {
      const updated = delegates.map((d) =>
        d.id === editingId ? { ...d, ...form } : d,
      );
      saveData(updated);
    } else {
      const newDelegate: Delegate = {
        id: Date.now(),
        ...form,
      };
      saveData([...delegates, newDelegate]);
    }

    setForm({ name: "", designation: "", email: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  // DELETE
  const handleDelete = (id: number) => {
    const updated = delegates.filter((d) => d.id !== id);
    saveData(updated);
  };

  // EDIT
  const handleEdit = (d: Delegate) => {
    setForm({
      name: d.name,
      designation: d.designation,
      email: d.email,
      active: d.active,
    });
    setEditingId(d.id);
    setOpen(true);
  };

  // 📂 CSV UPLOAD
  const handleCSVUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const parsedData = results.data.map((row: any) => ({
          id: Date.now() + Math.random(),
          name: row.name || "",
          designation: row.designation || "",
          email: row.email || "",
          active: true,
        }));

        const updated = [...delegates, ...parsedData];
        saveData(updated);
      },
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Delegates</h1>

        <div className="flex gap-3">
          <Button onClick={() => setOpen(true)}>+ Add Delegate</Button>
          {/* 🔥 ADD THIS */}
          {/* <Button
    variant="destructive"
    onClick={() => {
      localStorage.removeItem("delegates");
      setDelegates([]);
    }}
  >
    Clear All
  </Button> */}

          <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-md bg-white hover:bg-gray-100">
            <Upload size={16} />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleCSVUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Designation</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {delegates.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400">
                  No delegates added
                </td>
              </tr>
            ) : (
              delegates.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{d.name}</td>
                  <td className="p-4">{d.designation}</td>
                  <td className="p-4">{d.email}</td>

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

                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(d)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(d.id)}
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
                {editingId ? "Edit Delegate" : "Add Delegate"}
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
                  <Label>Designation</Label>
                  <Input
                    value={form.designation}
                    onChange={(e) =>
                      setForm({ ...form, designation: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
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
    </div>
  );
}

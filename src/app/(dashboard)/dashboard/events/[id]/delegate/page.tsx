"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import DelegateForm from "@/components/forms/DelegateForm";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Upload } from "lucide-react";

/* ================= TYPES ================= */

type Delegate = {
  id: number;
  name: string;
  designation: string;
  email: string;
  active: boolean;
};

type CSVRow = {
  name?: string;
  designation?: string;
  email?: string;
};

/* ================= COMPONENT ================= */

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

  /* ================= LOAD ================= */

  useEffect(() => {
    const stored = localStorage.getItem("delegates_${id}");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDelegates(JSON.parse(stored) as Delegate[]);
    }
  }, []);

  const saveData = (data: Delegate[]) => {
    setDelegates(data);
    localStorage.setItem("delegates_${id}", JSON.stringify(data));
  };

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = () => {
    if (!form.name || !form.email) return;

    if (editingId) {
      const updated = delegates.map((d) =>
        d.id === editingId ? { ...d, ...form } : d
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

  /* ================= DELETE ================= */

  const handleDelete = (id: number) => {
    const updated = delegates.filter((d) => d.id !== id);
    saveData(updated);
  };

  /* ================= EDIT ================= */

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

  /* ================= CSV UPLOAD ================= */

  const handleCSVUpload = (file: File) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: Delegate[] = results.data.map((row) => ({
          id: Date.now() + Math.random(),
          name: row.name || "",
          designation: row.designation || "",
          email: row.email || "",
          active: true,
        }));

        saveData([...delegates, ...parsedData]);
      },
    });
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Delegates</h1>

        <div className="flex gap-3">
          <Button onClick={() => setOpen(true)}>+ Add Delegate</Button>

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

      {/* FORM */}
      <DelegateForm
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />
    </div>
  );
}
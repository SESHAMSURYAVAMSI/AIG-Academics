"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import DelegateForm from "@/components/forms/DelegateForm";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

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
  const params = useParams();
  const id = params?.id as string;

  const storageKey = `delegates_${id}`;

  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    email: "",
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDelegates(stored ? JSON.parse(stored) : []);
  }, [id]);

  /* SAVE */
  const saveData = (data: Delegate[]) => {
    setDelegates(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  /* ADD / UPDATE */
  const handleSubmit = () => {
    if (!form.name || !form.email) return;

    if (editingId) {
      const updated = delegates.map((d) =>
        d.id === editingId ? { ...d, ...form } : d,
      );
      saveData(updated);
    } else {
      saveData([...delegates, { id: Date.now(), ...form }]);
    }

    setForm({ name: "", designation: "", email: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  /* DELETE */
  const handleDelete = (id: number) => {
    const updated = delegates.filter((d) => d.id !== id);
    saveData(updated);
  };

  /* EDIT */
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

  /* CSV */
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
          {/* ✅ FIXED HEADER */}
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Designation</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
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

                  {/* ✅ FIXED ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => handleEdit(d)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                        hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 
                        transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(d.id)}
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

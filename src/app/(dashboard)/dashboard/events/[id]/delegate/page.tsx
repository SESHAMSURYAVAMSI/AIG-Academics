"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Papa from "papaparse";

import DelegateForm from "@/components/forms/delegate/DelegateForm";
import DelegateTable from "@/components/forms/delegate/DelegateTable";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

import { Delegate } from "@/types/delegate";

type CSVRow = {
  name?: string;
  designation?: string;
  email?: string;
};

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
    image: "", // ✅ FIXED
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(storageKey);
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
        d.id === editingId ? { ...d, ...form } : d
      );
      saveData(updated);
    } else {
      saveData([
        ...delegates,
        // eslint-disable-next-line react-hooks/purity
        { id: Date.now(), ...form },
      ]);
    }

    resetForm();
  };

  /* RESET */
  const resetForm = () => {
    setForm({
      name: "",
      designation: "",
      email: "",
      image: "",
      active: true,
    });
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
      image: d.image || "", // ✅ FIX
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
          image: "", // ✅ IMPORTANT
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
          <Button onClick={() => setOpen(true)}>
            + Add Delegate
          </Button>

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
      <DelegateTable
        delegates={delegates}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }} // ✅ FIXED
      />

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
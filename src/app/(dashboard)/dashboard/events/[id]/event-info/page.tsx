"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import EventInfoTable from "@/components/forms/event-form/EventInfoTable";
import EventInfoForm from "@/components/forms/event-form/EventInfoForm";


import { Button } from "@/components/ui/button";
import { EventInfo } from "@/types/eventInfo";

export default function EventInfoPage() {
  const params = useParams();
  const id = params?.id as string;

  const storageKey = `eventInfo_${id}`;

  /* ================= STATE ================= */

  const [items, setItems] = useState<EventInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    active: true,
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(stored ? JSON.parse(stored) : []);
  }, [id]);

  /* ================= SAVE ================= */

  const saveItems = (data: EventInfo[]) => {
    setItems(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  /* ================= IMAGE ================= */

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      setForm((prev) => ({ ...prev, image: result }));
      setPreview(result);
    };

    reader.readAsDataURL(file);
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      image: "",
      active: true,
    });
    setPreview(null);
    setEditingId(null);
    setOpen(false);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    if (editingId) {
      const updated = items.map((i) =>
        i.id === editingId ? { ...i, ...form } : i
      );
      saveItems(updated);
    } else {
      const newItem: EventInfo = {
        id: Date.now(),
        ...form,
      };
      saveItems([...items, newItem]);
    }

    resetForm();
  };

  /* ================= EDIT (✅ FIXED) ================= */

  const handleEdit = (item: EventInfo) => {
    setForm({
      title: item.title,
      description: item.description,
      image: item.image || "", // ✅ FIX
      active: item.active,
    });

    setPreview(item.image || null);
    setEditingId(item.id);
    setOpen(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    const updated = items.filter((i) => i.id !== deleteId);
    saveItems(updated);
    setDeleteId(null);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Event Info</h1>
        <Button onClick={() => setOpen(true)}>+ Add Event Info</Button>
      </div>

      {/* TABLE */}
      <EventInfoTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* FORM */}
      <EventInfoForm
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editingId={editingId}
        preview={preview}
        setPreview={setPreview}
        handleImageUpload={handleImageUpload}
      />

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[320px]">
            <h2 className="text-lg font-semibold mb-3">
              Delete Event Info?
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>

              <Button
                onClick={confirmDelete}
                className="bg-red-500 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
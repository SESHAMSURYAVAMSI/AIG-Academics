"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import SpeakerForm from "@/components/forms/speaker/SpeakerForm";
import SpeakerTable from "@/components/forms/speaker/SpeakerTable";

import { Button } from "@/components/ui/button";

import { Speaker } from "@/types/speaker";

export default function SpeakerPage() {
  const params = useParams();
  const id = params?.id as string;

  const storageKey = `speakers_${id}`;

  /* ================= STATE ================= */

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    description: "",
    active: true,
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem(storageKey);
    setSpeakers(stored ? JSON.parse(stored) : []);
  }, [id]);

  /* ================= SAVE ================= */

  const saveData = (data: Speaker[]) => {
    setSpeakers(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  /* ================= CREATE / UPDATE ================= */

  const handleSubmit = () => {
    if (!form.name.trim() || !form.type.trim()) return;

    if (editingId) {
      const updated = speakers.map((s) =>
        s.id === editingId ? { ...s, ...form } : s
      );
      saveData(updated);
    } else {
      const newSpeaker: Speaker = {
        // eslint-disable-next-line react-hooks/purity
        id: Date.now(),
        ...form,
      };
      saveData([...speakers, newSpeaker]);
    }

    resetForm();
  };

  /* ================= DELETE ================= */

  const handleDelete = (id: number) => {
    const updated = speakers.filter((s) => s.id !== id);
    saveData(updated);
  };

  /* ================= EDIT ================= */

  const handleEdit = (speaker: Speaker) => {
    setForm({
      name: speaker.name,
      type: speaker.type,
      location: speaker.location,
      description: speaker.description || "",
      active: speaker.active,
    });

    setEditingId(speaker.id);
    setOpen(true);
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setForm({
      name: "",
      type: "",
      location: "",
      description: "",
      active: true,
    });

    setEditingId(null);
    setOpen(false);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Speakers</h1>

        <Button onClick={() => setOpen(true)}>+ Add Speaker</Button>
      </div>

      {/* TABLE */}
      <SpeakerTable
        speakers={speakers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* FORM DRAWER */}
      <SpeakerForm
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
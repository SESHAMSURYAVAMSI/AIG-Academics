"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SpeakerForm from "@/components/forms/SpeakerForm";

import { Button } from "@/components/ui/button";

type Speaker = {
  id: number;
  name: string;
  type: string;
  location: string;
  description: string;
  active: boolean;
};

export default function SpeakerPage() {
  const params = useParams();
  const id = params?.id as string;

  const storageKey = `speakers_${id}`;

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    description: "", // ✅ IMPORTANT
    active: true,
  });

  /* LOAD */
  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeakers(stored ? JSON.parse(stored) : []);
  }, [id]);

  /* SAVE */
  const saveData = (data: Speaker[]) => {
    setSpeakers(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  /* SUBMIT */
  const handleSubmit = () => {
    if (!form.name || !form.type) return;

    if (editingId) {
      const updated = speakers.map((s) =>
        s.id === editingId ? { ...s, ...form } : s,
      );
      saveData(updated);
    } else {
      saveData([...speakers, { id: Date.now(), ...form }]);
    }

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

  /* DELETE */
  const handleDelete = (id: number) => {
    saveData(speakers.filter((s) => s.id !== id));
  };

  /* EDIT */
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Speakers</h1>

        <Button onClick={() => setOpen(true)}>+ Add Speaker</Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {speakers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-400">
                  No speakers added
                </td>
              </tr>
            ) : (
              speakers.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4">{s.type}</td>
                  <td className="p-4">{s.location}</td>

                  <td className="p-4 text-gray-600 max-w-[200px] truncate">
                    {s.description}
                  </td>

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

                  <td className="p-4">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                        hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 
                        transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
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

      {/* ✅ USE YOUR FORM COMPONENT */}
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

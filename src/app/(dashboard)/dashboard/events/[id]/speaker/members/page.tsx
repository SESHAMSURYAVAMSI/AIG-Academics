"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import SpeakerMemberTable from "@/components/forms/speaker/SpeakerMemberTable";
import SpeakerMemberForm from "@/components/forms/speaker/SpeakerMemberForm";

import {
  SpeakerMember,
  SpeakerMemberFormType,
  SpeakerType,
} from "@/types/speakerMember";

export default function Page() {
  const { id } = useParams();

  const key = `speakerMembers_${id}`;
  const typeKey = `speakerTypes_${id}`;

  const [data, setData] = useState<SpeakerMember[]>([]);
  const [types, setTypes] = useState<SpeakerType[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<SpeakerMemberFormType>({
    name: "",
    designation: "",
    description: "",
    image: "",
    type: "",
    active: true,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(JSON.parse(localStorage.getItem(key) || "[]"));
    setTypes(JSON.parse(localStorage.getItem(typeKey) || "[]"));
  }, []);

  const save = (d: SpeakerMember[]) => {
    setData(d);
    localStorage.setItem(key, JSON.stringify(d));
  };

  const handleSubmit = () => {
    if (!form.name || !form.type) return;

    if (editingId) {
      save(data.map((d) => (d.id === editingId ? { ...d, ...form } : d)));
    } else {
      save([...data, { id: Date.now(), ...form }]);
    }

    setForm({
      name: "",
      designation: "",
      description: "",
      image: "",
      type: "",
      active: true,
    });

    setEditingId(null);
    setOpen(false);
  };

  return (
    <div className="p-6">
      <SpeakerMemberTable
        data={data}
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
        onEdit={(m) => {
          setForm({
            name: m.name,
            designation: m.designation,
            description: m.description,
            image: m.image || "",
            type: m.type,
            active: m.active,
          });
          setEditingId(m.id);
          setOpen(true);
        }}
        onDelete={(id) => {
          const updated = data.filter((d) => d.id !== id);
          setData(updated);
          localStorage.setItem(key, JSON.stringify(updated));
        }}
      />

      <SpeakerMemberForm
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        types={types}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />
    </div>
  );
}

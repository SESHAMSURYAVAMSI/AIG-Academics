"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import MemberTable from "@/components/forms/exhibitor/MemberTable";
import MemberForm from "@/components/forms/exhibitor/MemberForm";

import {
  ExhibitorMember,
  ExhibitorMemberForm,
  ExhibitorType,
} from "@/types/exhibitor";

export default function Page() {
  const { id } = useParams();

  const memberKey = `exhibitorMembers_${id}`;
  const typeKey = `exhibitorTypes_${id}`;

  const [members, setMembers] = useState<ExhibitorMember[]>([]);
  const [types, setTypes] = useState<ExhibitorType[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<ExhibitorMemberForm>({
    name: "",
    stall: "",
    hall: "",
    image: "",
    description: "",
    type: "",
    active: true,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMembers(JSON.parse(localStorage.getItem(memberKey) || "[]"));
    setTypes(JSON.parse(localStorage.getItem(typeKey) || "[]"));
  }, []);

  const save = (data: ExhibitorMember[]) => {
    setMembers(data);
    localStorage.setItem(memberKey, JSON.stringify(data));
  };

  const handleSubmit = () => {
    if (!form.name || !form.type) return;

    if (editingId) {
      save(members.map((m) => (m.id === editingId ? { ...m, ...form } : m)));
    } else {
      save([...members, { id: Date.now(), ...form }]);
    }

    setOpen(false);
    setEditingId(null);
  };

  const handleEdit = (m: ExhibitorMember) => {
    setForm({
      name: m.name,
      stall: m.stall,
      hall: m.hall,
      image: m.image,
      description: m.description,
      type: m.type,
      active: m.active,
    });

    setEditingId(m.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <MemberTable
        members={members}
        onEdit={handleEdit}
        onDelete={(id) => save(members.filter((m) => m.id !== id))}
        onAdd={() => setOpen(true)} // ✅ IMPORTANT
      />

      <MemberForm
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

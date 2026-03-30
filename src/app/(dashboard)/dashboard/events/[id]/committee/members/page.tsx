"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import CommitteeTable from "@/components/forms/committee/CommitteeTable";
import CommitteeForm from "@/components/forms/committee/CommitteeForm";

import {
  CommitteeMember,
  CommitteeMemberForm,
  CommitteeType,
} from "@/types/committee";

export default function Page() {
  const { id } = useParams();

  const memberKey = `members_${id}`;
  const typeKey = `committeeTypes_${id}`;

  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [types, setTypes] = useState<CommitteeType[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<CommitteeMemberForm>({
    name: "",
    designation: "",
    image: "",
    type: "",
    active: true,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMembers(JSON.parse(localStorage.getItem(memberKey) || "[]"));
    setTypes(JSON.parse(localStorage.getItem(typeKey) || "[]"));
  }, []);

  const save = (data: CommitteeMember[]) => {
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

  return (
    <div className="p-6">
      <CommitteeTable
        members={members}
        onEdit={(m) => {
          setForm(m);
          setEditingId(m.id);
          setOpen(true);
        }}
        onDelete={(id) => save(members.filter((m) => m.id !== id))}
        onAdd={() => setOpen(true)}
      />

      <CommitteeForm
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

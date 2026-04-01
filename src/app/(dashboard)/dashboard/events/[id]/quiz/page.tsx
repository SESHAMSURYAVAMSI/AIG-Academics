"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import QuizTable from "@/components/forms/quiz/QuizTable";
import QuizForm from "@/components/forms/quiz/QuizForm";

import { Quiz, QuizFormType } from "@/types/quiz";

export default function QuizPage() {
  const params = useParams();
  const id = params?.id as string;

  const key = `quiz_${id}`;

  const [data, setData] = useState<Quiz[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState<QuizFormType>({
    question: "",
    options: ["", "", "", ""],
    active: true,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(JSON.parse(localStorage.getItem(key) || "[]"));
  }, [id]);

  const save = (d: Quiz[]) => {
    setData(d);
    localStorage.setItem(key, JSON.stringify(d));
  };

  const handleSubmit = () => {
    if (!form.question) return;

    if (editingId) {
      save(
        data.map((d) =>
          d.id === editingId ? { ...d, ...form } : d
        )
      );
    } else {
      save([...data, { id: Date.now(), ...form }]);
    }

    setForm({
      question: "",
      options: ["", "", "", ""],
      active: true,
    });

    setEditingId(null);
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      <QuizTable
        data={data}
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
        onEdit={(q) => {
          setForm(q);
          setEditingId(q.id);
          setOpen(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      <QuizForm
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* DELETE */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl">
            <p>Are you sure?</p>

            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setDeleteId(null)}>Cancel</button>

              <button
                onClick={() => {
                  save(data.filter((d) => d.id !== deleteId));
                  setDeleteId(null);
                }}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
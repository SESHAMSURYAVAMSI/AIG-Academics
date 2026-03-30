"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import QuicklinkTable from "@/components/forms/quicklinks/QuicklinkTable";
import QuicklinkForm from "@/components/forms/quicklinks/QuicklinkForm";
import { Quicklink, QuicklinkFormType } from "@/types/quicklink";


export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const key = `quicklinks_${id}`;

  const [data, setData] = useState<Quicklink[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState<QuicklinkFormType>({
  title: "",
  link: "",
  active: true,
});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(JSON.parse(localStorage.getItem(key) || "[]"));
  }, [id]);

  const save = (d: Quicklink[]) => {
    setData(d);
    localStorage.setItem(key, JSON.stringify(d));
  };

  const handleSubmit = () => {
    if (!form.title || !form.link) return;

    if (editingId) {
      save(
        data.map((d) =>
          d.id === editingId ? { ...d, ...form } : d
        )
      );
    } else {
      save([...data, { id: Date.now(), ...form }]);
    }

    setForm({ title: "", link: "", active: true });
    setEditingId(null);
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      <QuicklinkTable
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

      <QuicklinkForm
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl">
            <p>Are you sure to delete?</p>

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
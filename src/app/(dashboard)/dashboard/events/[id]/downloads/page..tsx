"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Upload, FileText } from "lucide-react";

/* ================= TYPES ================= */

type DownloadItem = {
  id: number;
  title: string;
  file?: string; // base64
  fileName?: string;
  active: boolean;
};

/* ================= COMPONENT ================= */

export default function DownloadsPage() {
  const params = useParams();
  const id = params?.id as string;

  const storageKey = `downloads_${id}`;

  const [data, setData] = useState<DownloadItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    file: "",
    fileName: "",
    active: true,
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setData(JSON.parse(stored));
  }, [id]);

  /* ================= SAVE ================= */

  const saveData = (updated: DownloadItem[]) => {
    setData(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  /* ================= FILE UPLOAD ================= */

  const handleFile = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        file: reader.result as string,
        fileName: file.name,
      });
    };

    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!form.title) return;

    if (editingId) {
      saveData(
        data.map((d) =>
          d.id === editingId ? { ...d, ...form } : d
        )
      );
    } else {
      saveData([
        ...data,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({
      title: "",
      file: "",
      fileName: "",
      active: true,
    });

    setEditingId(null);
    setOpen(false);
  };

  /* ================= DELETE ================= */

  const confirmDelete = () => {
    if (!deleteId) return;

    saveData(data.filter((d) => d.id !== deleteId));
    setDeleteId(null);
  };

  /* ================= EDIT ================= */

  const handleEdit = (d: DownloadItem) => {
    setForm({
      title: d.title,
      file: d.file || "",
      fileName: d.fileName || "",
      active: d.active,
    });
    setEditingId(d.id);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Downloads</h1>

        <Button onClick={() => setOpen(true)}>
          + Add Download
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">File</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-400">
                  No downloads added
                </td>
              </tr>
            ) : (
              data.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{d.title}</td>

                  {/* FILE */}
                  <td className="p-4">
                    {d.file ? (
                      <a
                        href={d.file}
                        download={d.fileName}
                        className="flex items-center gap-2 text-blue-600"
                      >
                        <FileText size={16} />
                        {d.fileName}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        d.active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200"
                      }`}
                    >
                      {d.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(d)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setDeleteId(d.id)}
                          className="text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed right-0 top-0 w-[400px] h-full bg-white p-6 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }
              }
              exit={{ x: "100%" }}
            >
              <h2 className="text-xl mb-4">
                {editingId ? "Edit" : "Add"} Download
              </h2>

              <div className="space-y-4">

                {/* TITLE */}
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                {/* FILE UPLOAD */}
                <div>
                  <Label>Upload File</Label>

                  <div className="mt-2 border-2 border-dashed rounded-xl p-5 text-center relative cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      className="absolute inset-0 opacity-0"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />

                    <Upload className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload PDF / DOC / Image
                    </p>

                    {form.fileName && (
                      <p className="mt-2 text-xs text-green-600">
                        {form.fileName}
                      </p>
                    )}
                  </div>
                </div>

                {/* STATUS */}
                <div className="flex justify-between items-center">
                  <Label>Status</Label>
                  <Switch
                    checked={form.active}
                    onCheckedChange={(val) =>
                      setForm({ ...form, active: val })
                    }
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Save
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DELETE POPUP */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl">
            <p>Are you sure to delete this file?</p>

            <div className="flex gap-3 mt-4 justify-end">
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
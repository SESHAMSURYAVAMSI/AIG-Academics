"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

import { DownloadFormType } from "@/types/download";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: DownloadFormType;
  setForm: (v: DownloadFormType) => void;
  handleSubmit: () => void;
  editingId: number | null;
};

export default function DownloadForm({
  open,
  setOpen,
  form,
  setForm,
  handleSubmit,
  editingId,
}: Props) {
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

  return (
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
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl mb-4">
              {editingId ? "Edit" : "Add"} Download
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* FILE */}
              <div>
                <Label>Upload File</Label>

                <div className="mt-2 border-2 border-dashed rounded-xl p-5 text-center relative cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />

                  <Upload className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload file</p>

                  {form.fileName && (
                    <p className="text-xs text-green-600 mt-2">
                      {form.fileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Label>Status</Label>
                <Switch
                  checked={form.active}
                  onCheckedChange={(val) => setForm({ ...form, active: val })}
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
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

import { EventInfoFormType } from "@/types/eventInfo";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  form: EventInfoFormType;
  setForm: (val: EventInfoFormType) => void;
  handleSubmit: () => void;
  editingId: number | null;
  preview: string | null;
  setPreview: (val: string | null) => void;
  handleImageUpload: (file: File) => void;
};

export default function EventInfoForm({
  open,
  setOpen,
  form,
  setForm,
  handleSubmit,
  editingId,
  preview,
  setPreview,
  handleImageUpload,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <motion.div
            className="fixed right-0 top-0 w-[420px] h-screen bg-white shadow-xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            {/* HEADER (sticky) */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Event Info" : "Add Event Info"}
              </h2>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-24">
              {/* TITLE */}
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={6}
                  className="resize-none"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* IMAGE */}
              <div>
                <Label>Image</Label>

                <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />

                  {!preview ? (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} />
                      <p className="text-sm">Upload image</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={preview}
                        className="w-full h-40 object-cover rounded"
                      />

                      <button
                        onClick={() => {
                          setPreview(null);
                          setForm({ ...form, image: "" });
                        }}
                        className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* STATUS */}
              <div className="flex justify-between items-center">
                <Label>Status</Label>
                <Switch
                  checked={form.active}
                  onCheckedChange={(val) => setForm({ ...form, active: val })}
                />
              </div>
            </div>

            {/* FOOTER (fixed button) */}
            <div className="p-6 border-t bg-white">
              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

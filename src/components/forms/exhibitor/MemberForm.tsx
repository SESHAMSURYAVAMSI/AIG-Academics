"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { ExhibitorMemberForm, ExhibitorType } from "@/types/exhibitor";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: ExhibitorMemberForm;
  setForm: (v: ExhibitorMemberForm) => void;
  types: ExhibitorType[];
  handleSubmit: () => void;
  editingId: number | null;
};

export default function MemberForm({
  open,
  setOpen,
  form,
  setForm,
  types,
  handleSubmit,
  editingId,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          <motion.div
            className="fixed right-0 top-0 w-[420px] h-full bg-white p-6 shadow-xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Exhibitor" : "Add Exhibitor"}
            </h2>

            <div className="space-y-5">
              {/* NAME */}
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* STALL */}
              <div>
                <Label>Stall</Label>
                <Input
                  value={form.stall}
                  onChange={(e) => setForm({ ...form, stall: e.target.value })}
                />
              </div>

              {/* HALL */}
              <div>
                <Label>Hall</Label>
                <Input
                  value={form.hall}
                  onChange={(e) => setForm({ ...form, hall: e.target.value })}
                />
              </div>

              {/* TYPE */}
              <div>
                <Label>Exhibitor Type</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Select Type</option>
                  {types
                    .filter((t) => t.active)
                    .map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>
              {/* IMAGE UPLOAD */}
              <div>
                <Label>Image</Label>

                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center relative hover:border-indigo-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();

                      reader.onloadend = () => {
                        const result = reader.result as string;
                        setForm({ ...form, image: result });
                      };

                      reader.readAsDataURL(file);
                    }}
                  />

                  {!form.image ? (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-gray-500">
                        Click to upload image
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={form.image}
                        className="w-full h-40 object-cover rounded"
                      />

                      <button
                        onClick={() => setForm({ ...form, image: "" })}
                        className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* STATUS */}
              <div className="flex justify-between items-center">
                <Label>Status</Label>
                <Switch
                  checked={form.active}
                  onCheckedChange={(val) => setForm({ ...form, active: val })}
                />
              </div>

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

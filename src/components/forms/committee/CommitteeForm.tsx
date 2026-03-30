"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { CommitteeMemberForm, CommitteeType } from "@/types/committee";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: CommitteeMemberForm;
  setForm: (v: CommitteeMemberForm) => void;
  types: CommitteeType[];
  handleSubmit: () => void;
  editingId: number | null;
};

export default function CommitteeForm({
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
              {editingId ? "Edit Member" : "Add Member"}
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

              {/* DESIGNATION */}
              <div>
                <Label>Designation</Label>
                <Input
                  value={form.designation}
                  onChange={(e) =>
                    setForm({ ...form, designation: e.target.value })
                  }
                />
              </div>

              {/* TYPE */}
              <div>
                <Label>Committee Type</Label>
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

                <div className="border-2 border-dashed p-6 text-center relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({
                          ...form,
                          image: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />

                  {!form.image ? (
                    <p>Click to upload image</p>
                  ) : (
                    <img
                      src={form.image}
                      className="h-40 w-full object-cover rounded"
                    />
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

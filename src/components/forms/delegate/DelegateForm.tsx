"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type FormType = {
  name: string;
  designation: string;
  email: string;
  image: string; // ✅ NEW
  active: boolean;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  form: FormType;
  setForm: (val: FormType) => void;
  handleSubmit: () => void;
  editingId: number | null;
};

export default function DelegateForm({
  open,
  setOpen,
  form,
  setForm,
  handleSubmit,
  editingId,
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
            className="fixed top-0 right-0 w-[420px] h-full bg-white p-6 shadow-xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Delegate" : "Add Delegate"}
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

              {/* EMAIL */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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

              {/* IMAGE UPLOAD */}
              <div>
                <Label>Image</Label>

                <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center relative hover:border-indigo-400 transition">
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
                    <p className="text-sm text-gray-500">
                      Click to upload image
                    </p>
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

              {/* STATUS */}
              <div className="flex justify-between items-center">
                <Label>Status</Label>
                <Switch
                  checked={form.active}
                  onCheckedChange={(val) => setForm({ ...form, active: val })}
                />
              </div>

              {/* SUBMIT */}
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

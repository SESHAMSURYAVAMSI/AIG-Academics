"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type FormType = {
  name: string;
  type: string;
  location: string;
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

export default function SpeakerForm({
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
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <motion.div
            className="fixed top-0 right-0 w-[400px] h-full bg-white p-6 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Speaker" : "Add Speaker"}
            </h2>

            <div className="space-y-5">
              {/* NAME */}
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              {/* TYPE */}
              <div>
                <Label>Speaker Type</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>

              {/* LOCATION */}
              <div>
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
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

              {/* BUTTON */}
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
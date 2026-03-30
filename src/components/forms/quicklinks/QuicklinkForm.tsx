"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QuicklinkFormType } from "@/types/quicklink";


type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: QuicklinkFormType;
  setForm: (v: QuicklinkFormType) => void;
  handleSubmit: () => void;
  editingId: number | null;
};

export default function QuicklinkForm({
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
          <motion.div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          <motion.div
            className="fixed right-0 top-0 w-[400px] h-screen bg-white p-6 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Quicklink" : "Add Quicklink"}
            </h2>

            <div className="space-y-5">

              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Link</Label>
                <Input
                  placeholder="https://example.com"
                  value={form.link}
                  onChange={(e) =>
                    setForm({ ...form, link: e.target.value })
                  }
                />
              </div>

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
                {editingId ? "Update" : "Create"}
              </Button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
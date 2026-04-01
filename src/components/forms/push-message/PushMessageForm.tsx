"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { PushMessageFormType } from "@/types/pushMessage";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: PushMessageFormType;
  setForm: (v: PushMessageFormType) => void;
  handleSubmit: () => void;
  editingId: number | null;
};

export default function PushMessageForm({
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
            className="fixed right-0 top-0 w-[420px] h-full bg-white p-6 shadow-xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl mb-4">
              {editingId ? "Edit" : "Add"} Message
            </h2>

            <div className="space-y-4">

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
                <Label>Message</Label>
                <Textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-between">
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
  );
}
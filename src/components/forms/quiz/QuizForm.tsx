"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";

import { QuizFormType } from "@/types/quiz";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: QuizFormType;
  setForm: (v: QuizFormType) => void;
  handleSubmit: () => void;
  editingId: number | null;
};

export default function QuizForm({
  open,
  setOpen,
  form,
  setForm,
  handleSubmit,
  editingId,
}: Props) {
  const handleOptionChange = (index: number, value: string) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const addOption = () => {
    if (form.options.length >= 6) return;
    setForm({ ...form, options: [...form.options, ""] });
  };

  const removeOption = (index: number) => {
    if (form.options.length <= 2) return;
    const updated = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: updated });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 w-[420px] h-full bg-white p-6 shadow-2xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Quiz" : "Create Quiz"}
            </h2>

            <div className="space-y-6">

              {/* Question */}
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  placeholder="Enter your question..."
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                />
              </div>

              {/* OPTIONS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addOption}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <AnimatePresence>
                  {form.options.map((opt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition group"
                    >
                      {/* Number */}
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {i + 1}
                      </div>

                      {/* Input */}
                      <Input
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(i, e.target.value)
                        }
                        className="flex-1 bg-white"
                      />

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <p className="text-xs text-gray-400">
                  Minimum 2, Maximum 6 options
                </p>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center border rounded-lg p-3">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-xs text-gray-500">
                    Toggle quiz visibility
                  </p>
                </div>

                <Switch
                  checked={form.active}
                  onCheckedChange={(val) =>
                    setForm({ ...form, active: val })
                  }
                />
              </div>

              {/* Submit */}
              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Update Quiz" : "Create Quiz"}
              </Button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
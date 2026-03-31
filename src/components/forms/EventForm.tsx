"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

/* ================= TYPES ================= */

type EventFormData = {
  name: string;
  location: string;
  active: boolean;
  image: string;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  form: EventFormData;
  setForm: (val: EventFormData) => void;
  startDate?: Date;
  setStartDate: (val?: Date) => void;
  endDate?: Date;
  setEndDate: (val?: Date) => void;
  handleSubmit: () => void;
};

/* ================= COMPONENT ================= */

export default function EventForm({
  open,
  setOpen,
  form,
  setForm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSubmit,
}: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ================= FIX: SYNC PREVIEW (EDIT MODE) ================= */
  useEffect(() => {
    if (form.image) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagePreview(form.image);
    }
  }, [form.image]);

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      setForm({
        ...form,
        image: result,
      });

      setImagePreview(result); // ✅ FIXED
    };

    reader.readAsDataURL(file);
  };

  /* ================= REMOVE IMAGE ================= */

  const removeImage = () => {
    setForm({ ...form, image: "" });
    setImagePreview(null);
  };

  /* ================= UI ================= */

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <motion.div
            className="fixed top-0 right-0 w-[420px] h-screen bg-white z-50 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            {/* HEADER */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Add Event</h2>
            </div>

            {/* SCROLL CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-24">
              {/* EVENT NAME */}
              <div>
                <Label>Event Name</Label>
                <Input
                  className="mt-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* LOCATION */}
              <div>
                <Label>Location</Label>
                <Input
                  className="mt-2"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              {/* IMAGE */}
              <div>
                <Label>Event Image</Label>

                <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-center hover:bg-gray-50 transition relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />

                  {!imagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Click to upload image
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 w-full h-40 object-cover rounded-lg"
                      />

                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* START DATE */}
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full mt-2 flex items-center justify-between rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50">
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                      <CalendarIcon size={16} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-lg border">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* END DATE */}
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full mt-2 flex items-center justify-between rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50">
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                      <CalendarIcon size={16} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-lg border">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* STATUS */}
              <div className="flex items-center justify-between">
                <Label>Status</Label>
                <Switch
                  checked={form.active}
                  onCheckedChange={(value) =>
                    setForm({ ...form, active: value })
                  }
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t bg-white">
              <Button onClick={handleSubmit} className="w-full rounded-xl">
                Create Event
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

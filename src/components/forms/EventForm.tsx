"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  image?: string
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

  /* ================= HANDLERS ================= */

const handleImageUpload = (file: File) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    setForm({
      ...form,
      image: reader.result as string, // ✅ base64
    });
  };

  reader.readAsDataURL(file);
};

  /* ================= UI ================= */

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-[420px] h-full bg-white z-50 p-6 shadow-2xl rounded-l-2xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl font-semibold mb-6">Add Event</h2>

            <div className="space-y-5">
              {/* Event Name */}
              <div>
                <Label>Event Name</Label>
                <Input
                  className="mt-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Location */}
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

              {/* Image Upload */}
              <div>
                <Label>Event Image</Label>

                <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-center hover:bg-gray-50 transition">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Click to upload image
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 w-full h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Start Date */}
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

              {/* End Date */}
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

              {/* Status */}
              <div className="flex items-center justify-between">
                <Label>Status</Label>
                <Switch
                  checked={form.active}
                  onCheckedChange={(value) =>
                    setForm({ ...form, active: value })
                  }
                />
              </div>

              {/* Submit */}
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

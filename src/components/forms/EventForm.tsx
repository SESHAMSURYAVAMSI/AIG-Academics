"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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

type FormType = {
  name: string;
  location: string;
  active: boolean;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  form: FormType;
  setForm: (val: FormType) => void;
  startDate: Date | undefined;
  setStartDate: (val: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (val: Date | undefined) => void;
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
            className="fixed top-0 right-0 w-[420px] h-full bg-white z-50 p-6 shadow-2xl rounded-l-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-xl font-semibold mb-6">
              Add Event
            </h2>

            <div className="space-y-5">
              
              {/* NAME */}
              <div>
                <Label>Event Name</Label>
                <Input
                  className="mt-2"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
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

              {/* START DATE */}
              <div>
                <Label>Start Date</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full mt-2 flex items-center justify-between rounded-lg border px-3 py-2 text-sm bg-white hover:bg-gray-50">
                      {startDate
                        ? format(startDate, "PPP")
                        : "Pick start date"}
                      <CalendarIcon size={16} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-auto p-0 rounded-xl shadow-lg border z-50"
                  >
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
                      {endDate
                        ? format(endDate, "PPP")
                        : "Pick end date"}
                      <CalendarIcon size={16} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-auto p-0 rounded-xl shadow-lg border z-50"
                  >
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
                  onCheckedChange={(val) =>
                    setForm({ ...form, active: val })
                  }
                />
              </div>

              {/* BUTTON */}
              <Button
                onClick={handleSubmit}
                className="w-full rounded-xl"
              >
                Create Event
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  form: {
    name: string;
    location: string;
    active: boolean;
  };
  setForm: (val: {
    name: string;
    location: string;
    active: boolean;
  }) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  handleSubmit: () => void;
};

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
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <motion.div
            className="fixed top-0 right-0 w-[420px] h-full bg-white p-6 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <h2 className="text-2xl font-semibold mb-6">
              Add Event
            </h2>

            <div className="space-y-5">
              {/* NAME */}
              <div>
                <Label>Event Name</Label>
                <Input
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
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              {/* START */}
              <div className="space-y-2">
                <Label>Start Date & Time</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, "PPP p")
                        : "Pick start date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-4 space-y-3">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                    />

                    <Input
                      type="time"
                      onChange={(e) => {
                        if (!startDate) return;
                        const [h, m] = e.target.value.split(":");
                        const newDate = new Date(startDate);
                        newDate.setHours(Number(h));
                        newDate.setMinutes(Number(m));
                        setStartDate(newDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* END */}
              <div className="space-y-2">
                <Label>End Date & Time</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate
                        ? format(endDate, "PPP p")
                        : "Pick end date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-4 space-y-3">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                    />

                    <Input
                      type="time"
                      onChange={(e) => {
                        if (!endDate) return;
                        const [h, m] = e.target.value.split(":");
                        const newDate = new Date(endDate);
                        newDate.setHours(Number(h));
                        newDate.setMinutes(Number(m));
                        setEndDate(newDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
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

              <Button onClick={handleSubmit} className="w-full">
                Create Event
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
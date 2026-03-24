"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Event = {
  id: number;
  name: string;
  location: string;
  start: string;
  end: string;
  active: boolean;
};

export default function Dashboard() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    active: true,
  });

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // ✅ LOAD EVENTS FROM LOCALSTORAGE
  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  // ✅ ADD EVENT
  const handleAddEvent = () => {
    const newEvent: Event = {
      id: Date.now(),
      name: form.name,
      location: form.location,
      start: startDate?.toISOString() || "",
      end: endDate?.toISOString() || "",
      active: form.active,
    };

    const updatedEvents = [...events, newEvent];

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents)); // 🔥 SAVE

    // reset form
    setForm({ name: "", location: "", active: true });
    setStartDate(undefined);
    setEndDate(undefined);

    setOpen(false);
  };

  // ✅ DELETE EVENT
  const handleDelete = (id: number) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated)); // 🔥 UPDATE
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Events</h1>

        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
        >
          + Add Event
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-4">Event Name</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Start</th>
              <th className="text-left p-4">End</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-400">
                  No events created yet
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{event.name}</td>
                  <td className="p-4">{event.location}</td>

                  <td className="p-4">
                    {event.start
                      ? format(new Date(event.start), "PPP p")
                      : "-"}
                  </td>

                  <td className="p-4">
                    {event.end
                      ? format(new Date(event.end), "PPP p")
                      : "-"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        event.active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {event.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/events/${event.id}`)
                          }
                        >
                          Manage Event
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(event.id)}
                          className="text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed top-0 right-0 w-[420px] h-full bg-white p-6 shadow-xl z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4 }}
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

                {/* START DATE */}
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

                {/* END DATE */}
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
                  onClick={handleAddEvent}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Create Event
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
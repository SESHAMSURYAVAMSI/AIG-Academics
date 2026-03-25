"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import EventForm from "@/components/forms/EventForm";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type EventType = {
  id: number;
  name: string;
  location: string;
  start: string;
  end: string;
  active: boolean;
};

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const router = useRouter();

  /* LOAD DATA (NO useEffect ⚡) */
  const [events, setEvents] = useState<EventType[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("events");
    return stored ? (JSON.parse(stored) as EventType[]) : [];
  });

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    active: true,
  });

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const saveData = (data: EventType[]) => {
    setEvents(data);
    localStorage.setItem("events", JSON.stringify(data));
  };

  /* ADD EVENT */
  const handleAddEvent = () => {
    const newEvent: EventType = {
      id: Date.now(),
      name: form.name,
      location: form.location,
      start: startDate?.toISOString() || "",
      end: endDate?.toISOString() || "",
      active: form.active,
    };

    saveData([...events, newEvent]);

    setForm({ name: "", location: "", active: true });
    setStartDate(undefined);
    setEndDate(undefined);
    setOpen(false);
  };

  /* DELETE */
  const confirmDelete = () => {
    if (deleteId === null) return;
    const updated = events.filter((e) => e.id !== deleteId);
    saveData(updated);
    setDeleteId(null);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Events Dashboard
        </h1>

        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition"
        >
          + Add Event
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Event Name</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Start</th>
              <th className="p-4 text-left">End</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-400">
                  No events created yet
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t hover:bg-gray-50 transition"
                >
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
                          onClick={() => setDeleteId(event.id)}
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

      {/* FORM */}
      <EventForm
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleSubmit={handleAddEvent}
      />

      {/* 🔥 PREMIUM DELETE MODAL */}
      <AnimatePresence>
        {deleteId !== null && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
            />

            {/* MODAL */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.85, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-[380px] p-6 space-y-5"
              >
                <div>
                  <h2 className="text-xl font-semibold">
                    Are you sure to Delete Event?
                  </h2>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteId(null)}
                    className="hover:scale-105 transition"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition"
                  >
                    Yes, Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
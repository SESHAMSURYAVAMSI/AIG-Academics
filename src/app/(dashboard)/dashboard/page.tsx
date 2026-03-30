"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import EventForm from "@/components/forms/EventForm";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type EventType = {
  id: number;
  name: string;
  location: string;
  start: string; // ✅ yyyy-MM-dd
  end: string;   // ✅ yyyy-MM-dd
  active: boolean;
  image: string; // ✅ added
};

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const router = useRouter();

  const [events, setEvents] = useState<EventType[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("events");
    return stored ? JSON.parse(stored) : [];
  });

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    image: "", // ✅ added
    active: true,
  });

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  /* ================= SAVE ================= */

  const saveData = (data: EventType[]) => {
    setEvents(data);
    localStorage.setItem("events", JSON.stringify(data));
  };

  /* ================= ADD EVENT ================= */

  const handleAddEvent = () => {
    if (!form.name) return;

    // ✅ FIXED DATE FORMAT
    const formattedStart = startDate
      ? startDate.toISOString().split("T")[0]
      : "";

    const formattedEnd = endDate
      ? endDate.toISOString().split("T")[0]
      : "";

    const newEvent: EventType = {
      id: Date.now(),
      name: form.name,
      location: form.location,
      start: formattedStart,
      end: formattedEnd,
      image: form.image, // ✅ added
      active: form.active,
    };

    saveData([...events, newEvent]);

    // RESET
    setForm({
      name: "",
      location: "",
      image: "",
      active: true,
    });

    setStartDate(undefined);
    setEndDate(undefined);
    setOpen(false);
  };

  /* ================= DELETE ================= */

  const confirmDelete = () => {
    if (deleteId === null) return;
    saveData(events.filter((e) => e.id !== deleteId));
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

        <Button onClick={() => setOpen(true)}>
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
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-400">
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

                  {/* ✅ CLEAN DATE */}
                  <td className="p-4">
                    {event.start
                      ? format(new Date(event.start), "PPP")
                      : "-"}
                  </td>

                  <td className="p-4">
                    {event.end
                      ? format(new Date(event.end), "PPP")
                      : "-"}
                  </td>

                  {/* ✅ IMAGE */}
                  <td className="p-4">
                    {event.image ? (
                      <img
                        src={event.image}
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        No Image
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
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
                  <td className="p-4">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          router.push(`/dashboard/events/${event.id}`)
                        }
                        className="px-3 py-1.5 text-xs rounded-lg border
                        hover:bg-indigo-50 hover:text-indigo-600
                        transition-all duration-200 hover:scale-105"
                      >
                        Manage
                      </button>

                      <button
                        onClick={() => setDeleteId(event.id)}
                        className="px-3 py-1.5 text-xs rounded-lg border
                        hover:bg-red-50 hover:text-red-600
                        transition-all duration-200 hover:scale-105"
                      >
                        Delete
                      </button>

                    </div>
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

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId !== null && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setDeleteId(null)}
            />

            <motion.div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div className="bg-white rounded-2xl shadow-2xl w-[360px] p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                  Delete Event?
                </h2>

                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setDeleteId(null)}>
                    Cancel
                  </Button>

                  <Button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white"
                  >
                    Delete
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
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const [events, setEvents] = useState<EventType[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    active: true,
  });

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  /* LOAD */
useEffect(() => {
  const stored = localStorage.getItem("events");
  if (stored) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvents(JSON.parse(stored) as EventType[]);
  }
}, []);

  const saveData = (data: EventType[]) => {
    setEvents(data);
    localStorage.setItem("events", JSON.stringify(data));
  };

  /* ADD */
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
  const handleDelete = (id: number) => {
    const updated = events.filter((e) => e.id !== id);
    saveData(updated);
  };

  /* UI */
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Events</h1>

        <Button onClick={() => setOpen(true)}>
          + Add Event
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
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
    </div>
  );
}
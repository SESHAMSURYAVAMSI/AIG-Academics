"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/* ================= TYPES ================= */

type EventType = {
  id: number;
  name: string;
  location: string;
  start: string;
  end: string;
  active: boolean;
  image?: string; // ✅ FIXED (string instead of File)
};

/* ================= COMPONENT ================= */

export default function EventPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [event, setEvent] = useState<EventType | null>(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (!stored) return;

    const events: EventType[] = JSON.parse(stored);
    const found = events.find((e) => e.id === id);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setEvent(found);
  }, [id]);

  /* ================= UPDATE ================= */

  const handleChange = <K extends keyof EventType>(
    key: K,
    value: EventType[K]
  ) => {
    setEvent((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    if (!event) return;

    const stored = localStorage.getItem("events");
    if (!stored) return;

    const events: EventType[] = JSON.parse(stored);

    const updated = events.map((e) =>
      e.id === event.id ? event : e
    );

    localStorage.setItem("events", JSON.stringify(updated));

    alert("Event updated successfully ✅");
  };

  /* ================= LOADING ================= */

  if (!event) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading event...</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm p-6 space-y-6">

        <h1 className="text-2xl font-semibold">
          Event Details
        </h1>

        {/* 🔥 IMAGE PREVIEW */}
        {event.image && (
          <div>
            <Label>Event Image</Label>
            <img
              src={event.image}
              alt="Event"
              className="mt-2 w-full h-52 object-cover rounded-xl border"
            />
          </div>
        )}

        {/* NAME */}
        <div>
          <Label>Event Name</Label>
          <Input
            value={event.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
          />
        </div>

        {/* LOCATION */}
        <div>
          <Label>Location</Label>
          <Input
            value={event.location}
            onChange={(e) =>
              handleChange("location", e.target.value)
            }
          />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={event.start}
              onChange={(e) =>
                handleChange("start", e.target.value)
              }
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={event.end}
              onChange={(e) =>
                handleChange("end", e.target.value)
              }
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="flex items-center justify-between">
          <Label>Status</Label>

          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium ${
                event.active
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {event.active ? "Active" : "Inactive"}
            </span>

            <Switch
              checked={event.active}
              onCheckedChange={(val) =>
                handleChange("active", val)
              }
            />
          </div>
        </div>

        {/* SAVE */}
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
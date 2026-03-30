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
  start: string; // yyyy-MM-dd
  end: string;   // yyyy-MM-dd
  active: boolean;
  image?: string;
};

/* ================= COMPONENT ================= */

export default function EventPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [event, setEvent] = useState<EventType | null>(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("events");
      if (!stored) return;

      const events: EventType[] = JSON.parse(stored);
      const found = events.find((e) => e.id === id);

      if (found) setEvent(found);
    };

    load();

    // 🔥 sync when other pages update
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [id]);

  /* ================= CHANGE ================= */

  const handleChange = <K extends keyof EventType>(
    key: K,
    value: EventType[K]
  ) => {
    setEvent((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  /* ================= IMAGE ================= */

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      setEvent((prev) =>
        prev ? { ...prev, image: result } : prev
      );
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setEvent((prev) =>
      prev ? { ...prev, image: "" } : prev
    );
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    if (!event) return;

    const stored = localStorage.getItem("events");
    if (!stored) return;

    const events: EventType[] = JSON.parse(stored);

    const updated = events.map((e) =>
      e.id === event.id
        ? {
            ...event,
            start: event.start || "",
            end: event.end || "",
          }
        : e
    );

    localStorage.setItem("events", JSON.stringify(updated));

    setEvent({ ...event }); // 🔥 force UI refresh

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
    <div className="p-6 flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm p-6 space-y-6">

        <h1 className="text-2xl font-semibold">Event Details</h1>

        {/* IMAGE */}
        <div>
          <Label>Event Image</Label>

          <div className="mt-2 border-2 border-dashed rounded-xl p-4 relative text-center">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />

            {!event.image ? (
              <p className="text-sm text-gray-500">
                Click to upload image
              </p>
            ) : (
              <div className="relative">
                <img
                  src={event.image}
                  className="w-full h-52 object-cover rounded-xl border"
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
              value={event.start || ""}
              onChange={(e) =>
                handleChange("start", e.target.value)
              }
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={event.end || ""}
              onChange={(e) =>
                handleChange("end", e.target.value)
              }
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="flex justify-between items-center">
          <Label>Status</Label>
          <Switch
            checked={event.active}
            onCheckedChange={(val) =>
              handleChange("active", val)
            }
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
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
};

/* ================= COMPONENT ================= */

export default function EventInfoPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [event, setEvent] = useState<EventType | null>(null);

  /* LOAD EVENT */
  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (!stored) return;

    const events: EventType[] = JSON.parse(stored);
    const found = events.find((e) => e.id === Number(id));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setEvent(found);
  }, [id]);

  /* UPDATE FIELD (NO ANY ✅) */
  const handleChange = <K extends keyof EventType>(
    key: K,
    value: EventType[K]
  ) => {
    setEvent((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  /* SAVE */
  const handleSave = () => {
    const stored = localStorage.getItem("events");
    if (!stored || !event) return;

    const events: EventType[] = JSON.parse(stored);

    const updated = events.map((e) =>
      e.id === event.id ? event : e
    );

    localStorage.setItem("events", JSON.stringify(updated));

    alert("Event updated ✅");
  };

  /* LOADING */
  if (!event) {
    return <p>Loading...</p>;
  }

  /* UI */
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Event Info</h1>

      {/* NAME */}
      <div>
        <Label>Event Name</Label>
        <Input
          value={event.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* LOCATION */}
      <div>
        <Label>Location</Label>
        <Input
          value={event.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>

      {/* START */}
      <div>
        <Label>Start</Label>
        <Input
          value={event.start}
          onChange={(e) => handleChange("start", e.target.value)}
        />
      </div>

      {/* END */}
      <div>
        <Label>End</Label>
        <Input
          value={event.end}
          onChange={(e) => handleChange("end", e.target.value)}
        />
      </div>

      {/* STATUS */}
      <div className="flex items-center justify-between">
        <Label>Status</Label>

        <div className="flex items-center gap-3">
          <span
            className={`text-sm ${
              event.active ? "text-green-600" : "text-gray-500"
            }`}
          >
            {event.active ? "Active" : "Inactive"}
          </span>

          <Switch
            checked={event.active}
            onCheckedChange={(val) => handleChange("active", val)}
          />
        </div>
      </div>

      {/* SAVE */}
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
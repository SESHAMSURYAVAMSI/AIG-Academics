"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Event = {
  id: number;
  name: string;
  location: string;
  start: string;
  end: string;
  active: boolean;
};

export default function EventInfoPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  // LOAD EVENT
  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (!stored) return;

    const events: Event[] = JSON.parse(stored);
    const found = events.find((e) => e.id === Number(id));

    if (found) setEvent(found);
  }, [id]);

  // UPDATE FIELD
  const handleChange = (key: keyof Event, value: any) => {
    if (!event) return;
    setEvent({ ...event, [key]: value });
  };

  // SAVE UPDATE
  const handleSave = () => {
    const stored = localStorage.getItem("events");
    if (!stored || !event) return;

    let events: Event[] = JSON.parse(stored);

    events = events.map((e) => (e.id === event.id ? event : e));

    localStorage.setItem("events", JSON.stringify(events));

    alert("Event updated ✅");
  };

  if (!event) {
    return <p>Loading...</p>;
  }

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

      {/* 🔥 STATUS TOGGLE */}
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

      {/* SAVE BUTTON */}
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}

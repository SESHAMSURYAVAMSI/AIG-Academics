"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

const menuItems = [
  { name: "Event Info", path: "" },
  { name: "Committee", path: "committee" },
  { name: "Speaker", path: "speaker" },
  { name: "Agenda", path: "agenda" },
  { name: "Delegate", path: "delegate" },
  { name: "Download", path: "download" },
  { name: "Quicklink", path: "quicklink" },
  { name: "Quiz", path: "quiz" },
  { name: "Polls", path: "polls" },
  { name: "Exhibitors", path: "exhibitors" },
  { name: "Push Message", path: "push-message" },
  { name: "Contact", path: "contact" },
];

export default function EventLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-semibold mb-6">
          Manage Event
        </h2>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const fullPath = `/dashboard/events/${id}/${item.path}`;
            const active =
              pathname === fullPath ||
              (item.path === "" &&
                pathname === `/dashboard/events/${id}`);

            return (
              <div
                key={item.name}
                onClick={() => router.push(fullPath)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  active
                    ? "bg-indigo-100 text-indigo-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
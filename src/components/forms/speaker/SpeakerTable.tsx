"use client";

import { Speaker } from "@/types/speaker";

type Props = {
  speakers: Speaker[];
  onEdit: (speaker: Speaker) => void;
  onDelete: (id: number) => void;
};

export default function SpeakerTable({
  speakers,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {speakers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-6 text-gray-400">
                No speakers added
              </td>
            </tr>
          ) : (
            speakers.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4">{s.type}</td>
                <td className="p-4">{s.location}</td>

                <td className="p-4 text-gray-600 max-w-[200px] truncate">
                  {s.description}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      s.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onEdit(s)}
                      className="px-3 py-1.5 text-xs rounded-lg border hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(s.id)}
                      className="px-3 py-1.5 text-xs rounded-lg border hover:bg-red-50 hover:text-red-600"
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
  );
}
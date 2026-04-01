"use client";

import { PushMessage } from "@/types/pushMessage";
import { Button } from "@/components/ui/button";

type Props = {
  data: PushMessage[];
  onAdd: () => void;
  onEdit: (m: PushMessage) => void;
  onDelete: (id: number) => void;
};

export default function PushMessageTable({
  data,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Push Messages</h2>

        <Button onClick={onAdd}>
          + Add Message
        </Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Message</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-400">
                No messages added
              </td>
            </tr>
          ) : (
            data.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">

                <td className="p-4">{m.title}</td>

                <td className="p-4 max-w-xs truncate text-gray-600">
                  {m.message}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      m.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {m.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(m)}
                      className="px-3 py-1.5 text-xs border rounded-lg
                      hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(m.id)}
                      className="px-3 py-1.5 text-xs border rounded-lg
                      hover:bg-red-50 hover:text-red-600"
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
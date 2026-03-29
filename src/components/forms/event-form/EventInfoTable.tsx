"use client";

import { EventInfo } from "@/types/eventInfo";

type Props = {
  items: EventInfo[];
  onEdit: (item: EventInfo) => void;
  onDelete: (id: number) => void;
};

export default function EventInfoTable({
  items,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-400">
                No event info added
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{item.title}</td>

                <td className="p-4">
                  {item.image && (
                    <img
                      src={item.image}
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      item.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1.5 text-xs rounded-lg border hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
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
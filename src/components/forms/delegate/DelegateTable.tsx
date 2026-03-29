"use client";

import { Delegate } from "@/types/delegate";

type Props = {
  delegates: Delegate[];
  onEdit: (delegate: Delegate) => void;
  onDelete: (id: number) => void;
};

export default function DelegateTable({
  delegates,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Designation</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {delegates.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-6 text-gray-400">
                No delegates added
              </td>
            </tr>
          ) : (
            delegates.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{d.name}</td>
                <td className="p-4">{d.designation}</td>
                <td className="p-4">{d.email}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      d.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onEdit(d)}
                      className="px-3 py-1.5 text-xs rounded-lg border hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(d.id)}
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
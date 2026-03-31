"use client";

import { Delegate } from "@/types/delegate";
import { Button } from "@/components/ui/button";

type Props = {
  delegates: Delegate[];
  onEdit: (delegate: Delegate) => void;
  onDelete: (id: number) => void;
  onAdd: () => void; // ✅ ADD THIS
};

export default function DelegateTable({
  delegates,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      {/* HEADER */}
      {/* <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Delegates
        </h2>

        <Button
          onClick={onAdd}
          className="bg-black text-white hover:bg-gray-800"
        >
          + Add Delegate
        </Button>
      </div> */}

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Image</th> {/* ✅ NEW */}
            <th className="p-4 text-left">Designation</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {delegates.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-6 text-gray-400">
                No delegates added
              </td>
            </tr>
          ) : (
            delegates.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50 transition">
                {/* NAME */}
                <td className="p-4 font-medium text-gray-800">{d.name}</td>

                {/* IMAGE */}
                <td className="p-4">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-14 h-10 object-cover rounded-md border"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </td>

                {/* DESIGNATION */}
                <td className="p-4 text-gray-600">{d.designation}</td>

                {/* EMAIL */}
                <td className="p-4 text-gray-600">{d.email}</td>

                {/* STATUS */}
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

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    {/* EDIT */}
                    <button
                      onClick={() => onEdit(d)}
                      className="
                        px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white
                        transition-all duration-200
                        hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
                        hover:scale-105 hover:shadow-sm
                        active:scale-95
                      "
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => onDelete(d.id)}
                      className="
                        px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white
                        transition-all duration-200
                        hover:bg-red-50 hover:text-red-600 hover:border-red-200
                        hover:scale-105 hover:shadow-sm
                        active:scale-95
                      "
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

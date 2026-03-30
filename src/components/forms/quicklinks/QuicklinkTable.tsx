"use client";

import { Button } from "@/components/ui/button";
import { Quicklink } from "@/types/quicklink";


type Props = {
  data: Quicklink[];
  onAdd: () => void;
  onEdit: (q: Quicklink) => void;
  onDelete: (id: number) => void;
};

export default function QuicklinkTable({
  data,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Quicklinks</h2>

        <Button onClick={onAdd} className="bg-black text-white">
          + Add Quicklink
        </Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Link</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-400">
                No quicklinks added
              </td>
            </tr>
          ) : (
            data.map((q) => (
              <tr key={q.id} className="border-t hover:bg-gray-50">

                <td className="p-4 font-medium">{q.title}</td>

                <td className="p-4 text-blue-600 underline">
                  <a href={q.link} target="_blank">
                    {q.link}
                  </a>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      q.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {q.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(q)}
                      className="px-3 py-1.5 text-xs rounded-lg border
                      hover:bg-indigo-50 hover:text-indigo-600
                      transition-all hover:scale-105"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(q.id)}
                      className="px-3 py-1.5 text-xs rounded-lg border
                      hover:bg-red-50 hover:text-red-600
                      transition-all hover:scale-105"
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
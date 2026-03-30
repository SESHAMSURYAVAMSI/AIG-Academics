"use client";

import { DownloadItem } from "@/types/download";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type Props = {
  data: DownloadItem[];
  onAdd: () => void;
  onEdit: (d: DownloadItem) => void;
  onDelete: (id: number) => void;
};

export default function DownloadTable({
  data,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Downloads</h2>

        <Button onClick={onAdd}>
          + Add Download
        </Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">File</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-400">
                No downloads added
              </td>
            </tr>
          ) : (
            data.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">

                <td className="p-4">{d.title}</td>

                <td className="p-4">
                  {d.file ? (
                    <a
                      href={d.file}
                      download={d.fileName}
                      className="flex items-center gap-2 text-blue-600"
                    >
                      <FileText size={16} />
                      {d.fileName}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

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
                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(d)}
                      className="px-3 py-1.5 text-xs border rounded-lg
                      hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(d.id)}
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
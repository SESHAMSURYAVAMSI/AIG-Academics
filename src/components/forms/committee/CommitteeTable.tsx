"use client";

import { CommitteeMember } from "@/types/committee";
import { Button } from "@/components/ui/button";

type Props = {
  members: CommitteeMember[];
  onEdit: (m: CommitteeMember) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
};

export default function CommitteeTable({
  members,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      {/* ✅ HEADER (MATCH IMAGE 2) */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Committee Members
        </h2>

        <Button
          onClick={onAdd}
          className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2"
        >
          + Add Member
        </Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Designation</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-6 text-gray-400">
                No members added
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50 transition">
                {/* NAME */}
                <td className="p-4 font-medium text-gray-800">{m.name}</td>

                {/* DESIGNATION */}
                <td className="p-4 text-gray-600">{m.designation}</td>

                {/* TYPE */}
                <td className="p-4 text-gray-600">{m.type}</td>

                {/* IMAGE */}
                <td className="p-4">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-16 h-12 object-cover rounded-md border"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </td>

                {/* STATUS */}
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

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(m)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                      hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 
                      transition-all duration-200 transform hover:scale-105"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(m.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white 
                      hover:bg-red-50 hover:border-red-200 hover:text-red-600 
                      transition-all duration-200 transform hover:scale-105"
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

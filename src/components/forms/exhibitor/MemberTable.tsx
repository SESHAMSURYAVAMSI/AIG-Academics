"use client";

import { ExhibitorMember } from "@/types/exhibitor";
import { Button } from "@/components/ui/button";

type Props = {
  members: ExhibitorMember[];
  onEdit: (member: ExhibitorMember) => void;
  onDelete: (id: number) => void;
  onAdd: () => void; // ✅ NEW PROP
};

export default function MemberTable({
  members,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* ✅ HEADER BAR */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Exhibitor Members</h2>

        <Button onClick={onAdd}>+ Add Member</Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Stall</th>
            <th className="p-4 text-left">Hall</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-6 text-gray-400">
                No exhibitors added
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{m.name}</td>
                <td className="p-4">{m.stall}</td>
                <td className="p-4">{m.hall}</td>
                <td className="p-4">{m.type}</td>

                <td className="p-4">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </td>

                <td className="p-4 max-w-[200px] truncate text-gray-600">
                  {m.description || "-"}
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
                      className="px-3 py-1.5 text-xs rounded-lg border bg-white 
                      hover:bg-indigo-50 hover:text-indigo-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(m.id)}
                      className="px-3 py-1.5 text-xs rounded-lg border bg-white 
                      hover:bg-red-50 hover:text-red-600 transition"
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

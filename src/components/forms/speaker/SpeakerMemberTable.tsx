"use client";

import { SpeakerMember } from "@/types/speakerMember";
import { Button } from "@/components/ui/button";

type Props = {
  data: SpeakerMember[];
  onAdd: () => void;
  onEdit: (m: SpeakerMember) => void;
  onDelete: (id: number) => void;
};

export default function SpeakerMemberTable({
  data,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Speaker Members</h2>
        <Button onClick={onAdd} className="bg-black text-white">
          + Add Member
        </Button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Designation</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-6 text-gray-400">
                No speakers added
              </td>
            </tr>
          ) : (
            data.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{d.name}</td>
                <td className="p-4">{d.designation}</td>
                <td className="p-4">{d.type}</td>

                <td className="p-4">
                  {d.image && (
                    <img
                      src={d.image}
                      className="w-16 h-12 rounded object-cover"
                    />
                  )}
                </td>

                <td className="p-4 max-w-[200px] truncate">{d.description}</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      d.active ? "bg-green-100 text-green-600" : "bg-gray-200"
                    }`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4 ">
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

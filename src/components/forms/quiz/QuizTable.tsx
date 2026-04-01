"use client";

import { Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";

type Props = {
  data: Quiz[];
  onAdd: () => void;
  onEdit: (q: Quiz) => void;
  onDelete: (id: number) => void;
};

export default function QuizTable({
  data,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Quiz</h2>

        <Button onClick={onAdd}>
          + Add Quiz
        </Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Question</th>
            <th className="p-4 text-left">Options</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-400">
                No quiz added
              </td>
            </tr>
          ) : (
            data.map((q) => (
              <tr key={q.id} className="border-t hover:bg-gray-50">

                <td className="p-4">{q.question}</td>

                <td className="p-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className="text-xs text-gray-600">
                      • {opt}
                    </div>
                  ))}
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
                      className="px-3 py-1.5 text-xs border rounded-lg
                      hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(q.id)}
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
"use client";

import { Item } from "@/types";

interface ItemCardProps {
  item: Item;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  return (
    <li
      className={`rounded-lg p-5 mb-4 flex justify-between items-center transition-all hover:translate-x-1 hover:shadow-md ${
        item.completed
          ? "bg-green-50 border-l-4 border-green-500"
          : "bg-gray-50"
      }`}
    >
      <div className="flex-1">
        <div className="text-lg font-semibold text-gray-700">{item.name}</div>
        <div className="text-gray-500 text-sm">
          {item.description || "No description"}
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${
            item.completed
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.completed ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item.id)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

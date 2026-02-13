"use client";

import { useState, useEffect } from "react";
import { Item } from "@/types";

interface ItemFormProps {
  editingItem: Item | null;
  onSubmit: (data: {
    name: string;
    description: string;
    completed: boolean;
  }) => void;
  onCancel: () => void;
}

export default function ItemForm({
  editingItem,
  onSubmit,
  onCancel,
}: ItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description || "");
      setCompleted(editingItem.completed);
    } else {
      setName("");
      setDescription("");
      setCompleted(false);
    }
  }, [editingItem]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name: name.trim(), description: description.trim(), completed });
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-5 shadow-2xl">
      <h2 className="text-xl font-bold text-gray-700 mb-5">
        {editingItem ? "Edit Item" : "New Item"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block mb-1 font-semibold text-gray-700"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            required
            maxLength={100}
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 font-semibold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            maxLength={500}
            placeholder="Enter item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors resize-y min-h-[80px] focus:outline-none focus:border-[#667eea]"
          />
        </div>
        <div className="mb-4 flex items-center gap-2.5">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <label htmlFor="completed" className="font-semibold text-gray-700">
            Completed
          </label>
        </div>
        <div className="mt-5 flex gap-2.5">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            {editingItem ? "Update Item" : "Add Item"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-lg text-base font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

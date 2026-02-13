"use client";

import { useState, useCallback } from "react";
import { Item } from "@/types";
import { api } from "@/lib/api";
import ItemCard from "./ItemCard";

interface ItemListProps {
  items: Item[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onMessage: (text: string, type: "success" | "error") => void;
}

export default function ItemList({
  items,
  onEdit,
  onDelete,
  onMessage,
}: ItemListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [csvExporting, setCsvExporting] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "completed"
          ? item.completed
          : !item.completed;
    return matchesSearch && matchesStatus;
  });

  function resetFilter() {
    setSearchQuery("");
    setStatusFilter("all");
  }

  const pollCsvStatus = useCallback(
    (filename: string) => {
      const interval = setInterval(async () => {
        try {
          const data = await api.items.csvStatus(filename);
          if (data.status === "COMPLETED") {
            clearInterval(interval);
            onMessage("CSV ready! Downloading...", "success");
            try {
              await api.items.downloadCsv(filename);
              onMessage("CSV downloaded!", "success");
            } catch {
              onMessage("CSV download failed", "error");
            }
            setCsvExporting(false);
          } else if (data.status === "FAILED") {
            clearInterval(interval);
            onMessage("CSV generation failed", "error");
            setCsvExporting(false);
          }
        } catch {
          clearInterval(interval);
          onMessage("Status check failed", "error");
          setCsvExporting(false);
        }
      }, 1000);
    },
    [onMessage]
  );

  async function handleExportCsv() {
    setCsvExporting(true);
    try {
      const data = await api.items.exportCsv();
      onMessage("CSV generating...", "success");
      pollCsvStatus(data.filename);
    } catch {
      onMessage("CSV export failed", "error");
      setCsvExporting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-gray-700 mb-5">Item List</h2>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "pending" | "completed")
          }
          className="p-3 border-2 border-gray-200 rounded-lg text-base bg-white cursor-pointer min-w-[140px] focus:outline-none focus:border-[#667eea]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={resetFilter}
          className="px-6 py-3 rounded-lg text-base font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleExportCsv}
          disabled={csvExporting}
          className="px-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-br from-[#f093fb] to-[#f5576c] hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {csvExporting ? "Exporting..." : "CSV Export"}
        </button>
      </div>

      <ul className="list-none">
        {filteredItems.length === 0 ? (
          <li className="text-center py-10 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-20 h-20 mx-auto mb-5 opacity-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p>No items found.</p>
          </li>
        ) : (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </ul>
    </div>
  );
}

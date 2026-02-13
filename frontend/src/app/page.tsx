"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { api, UnauthorizedError } from "@/lib/api";
import { Item } from "@/types";
import UserInfo from "@/components/UserInfo";
import Message from "@/components/Message";
import ItemForm from "@/components/ItemForm";
import ItemList from "@/components/ItemList";

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const loadItems = useCallback(async () => {
    try {
      const data = await api.items.getAll();
      setItems(data);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.replace("/login");
      } else {
        showMessage("Failed to load items", "error");
      }
    }
  }, [router]);

  useEffect(() => {
    if (authChecked) {
      loadItems();
    }
  }, [authChecked, loadItems]);

  function showMessage(text: string, type: "success" | "error") {
    setMessage({ text, type });
  }

  async function handleSubmit(data: {
    name: string;
    description: string;
    completed: boolean;
  }) {
    try {
      if (editingItem) {
        await api.items.update(editingItem.id, data);
        showMessage("Item updated successfully!", "success");
      } else {
        await api.items.create(data);
        showMessage("Item added successfully!", "success");
      }
      setEditingItem(null);
      loadItems();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.replace("/login");
      } else {
        showMessage(
          error instanceof Error ? error.message : "Operation failed",
          "error"
        );
      }
    }
  }

  async function handleEdit(id: number) {
    try {
      const item = await api.items.getById(id);
      setEditingItem(item);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.replace("/login");
      } else {
        showMessage("Failed to load item", "error");
      }
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.items.delete(id);
      showMessage("Item deleted successfully!", "success");
      if (editingItem?.id === id) setEditingItem(null);
      loadItems();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.replace("/login");
      } else {
        showMessage("Failed to delete item", "error");
      }
    }
  }

  if (!authChecked) return null;

  return (
    <div className="max-w-[900px] mx-auto p-5">
      <h1 className="text-center text-white text-3xl font-bold mb-8 drop-shadow-md">
        Item Management
      </h1>

      <UserInfo />

      {message && (
        <Message
          text={message.text}
          type={message.type}
          onDismiss={() => setMessage(null)}
        />
      )}

      <ItemForm
        editingItem={editingItem}
        onSubmit={handleSubmit}
        onCancel={() => setEditingItem(null)}
      />

      <ItemList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMessage={showMessage}
      />
    </div>
  );
}

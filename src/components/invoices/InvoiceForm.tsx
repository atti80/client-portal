"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/lib/actions/invoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

type Project = { id: string; name: string };
type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
};

function newItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unit_price: 0,
  };
}

export function NewInvoiceForm({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState<LineItem[]>([newItem()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  function updateItem(
    id: string,
    field: keyof LineItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function removeItem(id: string) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    for (const item of items) {
      if (!item.description.trim()) {
        setError("All line items need a description.");
        return;
      }
    }
    formData.set(
      "items",
      JSON.stringify(
        items.map(({ description, quantity, unit_price }) => ({
          description,
          quantity,
          unit_price,
        }))
      )
    );
    setLoading(true);
    const result = await createInvoice(formData);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-stone-700 text-sm">
            Project{" "}
            <span className="text-stone-400 font-normal ml-1">(optional)</span>
          </Label>
          <Select name="project_id">
            <SelectTrigger className="bg-white border-stone-200">
              <SelectValue placeholder="No project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_date" className="text-stone-700 text-sm">
            Due date{" "}
            <span className="text-stone-400 font-normal ml-1">(optional)</span>
          </Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            max="2099-12-31"
            className="bg-white border-stone-200"
          />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-12 gap-2 px-1 mb-2">
          <p className="col-span-6 text-xs text-stone-400">Description</p>
          <p className="col-span-2 text-xs text-stone-400">Qty</p>
          <p className="col-span-3 text-xs text-stone-400">Unit price</p>
          <p className="col-span-1" />
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <Input
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, "description", e.target.value)
                }
                placeholder="Design work"
                className="col-span-6 bg-white border-stone-200 text-sm"
              />
              <Input
                type="number"
                value={item.quantity}
                min={0.01}
                step={0.01}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "quantity",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="col-span-2 bg-white border-stone-200 text-sm"
              />
              <Input
                type="number"
                value={item.unit_price}
                min={0}
                step={0.01}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "unit_price",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
                className="col-span-3 bg-white border-stone-200 text-sm"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
                className="col-span-1 text-stone-300 hover:text-red-500 transition-colors disabled:opacity-0 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, newItem()])}
          className="mt-3 text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          + Add line item
        </button>
      </div>

      <div className="flex justify-end border-t border-stone-100 pt-4">
        <div className="text-right">
          <p className="text-xs text-stone-500">Total</p>
          <p className="text-xl font-semibold text-stone-900">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {loading ? "Creating..." : "Create invoice"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-stone-200 text-stone-700"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

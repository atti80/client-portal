"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Project = {
  id: string;
  name: string;
  description: string | null;
  due_date: string | null;
  status: string;
};

export function EditProjectForm({ project }: { project: Project }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await updateProject(project.id, formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      toast.success("Project updated.");
      router.push(`/projects/${project.id}`);
      router.refresh();
    }
  }

  // Format date for input default value — needs YYYY-MM-DD
  const defaultDate = project.due_date ? project.due_date.split("T")[0] : "";

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-stone-700 text-sm">
          Project name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={project.name}
          required
          autoFocus
          className="bg-white border-stone-200"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-stone-700 text-sm">
          Description
          <span className="text-stone-400 font-normal ml-1">(optional)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project.description ?? ""}
          rows={3}
          className="bg-white border-stone-200 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="due_date" className="text-stone-700 text-sm">
          Due date
          <span className="text-stone-400 font-normal ml-1">(optional)</span>
        </Label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          defaultValue={defaultDate}
          min={new Date().toISOString().split("T")[0]}
          max="2599-12-31"
          className="bg-white border-stone-200"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          disabled={loading}
          className="bg-stone-900 hover:bg-stone-700 text-white"
        >
          {loading ? "Saving..." : "Save changes"}
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

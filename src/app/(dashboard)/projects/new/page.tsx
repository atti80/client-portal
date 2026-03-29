import { NewProjectForm } from "./form";

export default function NewProjectPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-stone-900 mb-6">New project</h1>
      <NewProjectForm />
    </div>
  );
}

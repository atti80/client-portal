export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <h1>Dashboard layout</h1>
      {children}
    </div>
  );
}

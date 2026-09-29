export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 invert">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10">
        {children}
      </div>
    </div>
  );
}

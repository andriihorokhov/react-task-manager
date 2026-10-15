'use client';
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Oops! {error.message}</h1>
      <p className="text-sm text-gray-500">Something went wrong.</p>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}

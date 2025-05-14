export default function ErrorBanner({ message }) {
  return (
    <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
      {message}
    </div>
  );
}

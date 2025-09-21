export default function NotFound(){
  return (
    <div className="max-w-xl mx-auto text-center space-y-3">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p>Try the navigation above, or go back to the home page.</p>
      <a href="/" className="inline-block px-4 py-2 rounded bg-[var(--bt-blue)] text-white">Back home</a>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-default-200 mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-default-500 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        href="/"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

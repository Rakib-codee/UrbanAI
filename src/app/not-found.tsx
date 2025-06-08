import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">page not found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist or has been removed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
          >
            Go to Home Page
          </Link>
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 
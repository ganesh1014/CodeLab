import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

function NotFound() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-base-content mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-base-content mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-base-content/60 text-lg max-w-xl mx-auto mb-8">
          The page you’re looking for doesn’t exist, may have been moved,
          or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl px-6"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn btn-outline rounded-xl px-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Decorative Card */}
        <div className="mt-12 bg-base-100 border border-base-200 rounded-2xl p-6 shadow-sm">
          <p className="text-base-content/70">
            Lost while solving problems? Don’t worry — even the best developers
            hit a 404 sometimes 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
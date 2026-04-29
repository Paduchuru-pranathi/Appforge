import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-indigo-900">
      <div className="text-center text-white">
        <Zap className="w-12 h-12 text-primary-300 mx-auto mb-4" />
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-primary-300 mb-8">Page not found</p>
        <Link href="/dashboard" className="btn-primary mx-auto bg-white text-primary-900 hover:bg-primary-50">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

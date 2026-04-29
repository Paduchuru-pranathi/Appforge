'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed. Try again.');
      router.push('/login');
      return;
    }

    if (token) {
      localStorage.setItem('appforge_token', token);
      authAPI.me().then((res) => {
        setAuth(token, res.data);
        toast.success(`Welcome, ${res.data.name}! 🎉`);
        router.push('/dashboard');
      }).catch(() => {
        toast.error('Authentication failed');
        router.push('/login');
      });
    } else {
      router.push('/login');
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <Zap className="w-12 h-12 text-primary-300 mx-auto mb-4 animate-pulse" />
        <p className="text-xl font-medium">Completing sign in...</p>
        <p className="text-primary-300 mt-2">Just a moment</p>
      </div>
    </div>
  );
}

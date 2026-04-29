'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Zap, LayoutDashboard, Plus, Bell, LogOut, Menu, X, User, CheckCheck, Home } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { notificationsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, [isAuthenticated, router]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsAPI.list().then(r => r.data),
    refetchInterval: 30000,
    enabled: isAuthenticated(),
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All read');
      setNotifOpen(false);
    },
  });

  const unreadCount = notifData?.unreadCount || 0;

  const navItems = [
    { href: '/dashboard', label: 'My Apps', icon: LayoutDashboard },
    { href: '/dashboard/apps/new', label: 'New App', icon: Plus },
  ];

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 flex flex-col
        transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Zap className="w-6 h-6 text-primary-600" />
            AppForge
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                : <User className="w-4 h-4 text-primary-600" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <Link href="/dashboard" className="flex items-center gap-1.5 font-bold text-gray-900 lg:hidden">
            <Zap className="w-5 h-5 text-primary-600" />
            AppForge
          </Link>

          <div className="hidden lg:block" />

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Notifications bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 animate-slide-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={() => markAllRead.mutate()} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                            <CheckCheck className="w-3 h-3" /> Mark all read
                          </button>
                        )}
                        <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {!notifData?.notifications?.length ? (
                        <div className="py-10 text-center">
                          <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifData.notifications.map((n: any) => (
                          <div key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-primary-50/40' : ''}`}>
                            <div className="flex items-start gap-2">
                              {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1 flex-shrink-0" />}
                              <div className={!n.read ? '' : 'ml-4'}>
                                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                                {n.message && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto pb-safe">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-10 pb-safe">
          {[
            { href: '/dashboard', label: 'Apps', icon: Home },
            { href: '/dashboard/apps/new', label: 'New App', icon: Plus },
          ].map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${active ? 'text-primary-600' : 'text-gray-500'}`}>
                <Icon className="w-5 h-5 mb-0.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

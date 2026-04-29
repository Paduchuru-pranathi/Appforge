'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Layers, Trash2, ExternalLink, Edit, Globe, Lock, Zap } from 'lucide-react';
import { appsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data: apps, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: () => appsAPI.list().then(r => r.data),
  });

  const deleteApp = useMutation({
    mutationFn: (id: string) => appsAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['apps'] });
      toast.success('App deleted');
      setDeleting(null);
    },
    onError: () => toast.error('Failed to delete app'),
  });

  const togglePublish = useMutation({
    mutationFn: (id: string) => appsAPI.publish(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['apps'] });
      toast.success(res.data.published ? 'App published! 🚀' : 'App unpublished');
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Apps</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your config-driven applications</p>
        </div>
        <Link href="/dashboard/apps/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          New App
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : apps?.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No apps yet</h3>
          <p className="text-gray-500 mb-6">Create your first app from a JSON config</p>
          <Link href="/dashboard/apps/new" className="btn-primary mx-auto w-fit">
            <Plus className="w-4 h-4" /> Create Your First App
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps?.map((app: any) => (
            <div key={app.id} className="card p-6 hover:border-primary-200 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Layers className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{app.name}</h3>
                    <p className="text-xs text-gray-400">{app.config?.components?.length || 0} components</p>
                  </div>
                </div>
                <span className={`badge ${app.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {app.published ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                  {app.published ? 'Live' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}
              </p>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/apps/${app.id}`}
                  className="flex-1 btn-secondary text-xs py-1.5 justify-center"
                >
                  <ExternalLink className="w-3 h-3" /> Open
                </Link>
                <Link
                  href={`/dashboard/apps/${app.id}/edit`}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  <Edit className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => togglePublish.mutate(app.id)}
                  className="btn-secondary text-xs py-1.5 px-3"
                  title={app.published ? 'Unpublish' : 'Publish'}
                >
                  {app.published ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                </button>
                {deleting === app.id ? (
                  <button
                    onClick={() => deleteApp.mutate(app.id)}
                    className="text-xs py-1.5 px-3 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    Sure?
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleting(app.id)}
                    className="btn-secondary text-xs py-1.5 px-3 hover:border-red-200 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

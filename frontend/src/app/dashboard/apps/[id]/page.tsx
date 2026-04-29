'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Globe, Lock, Loader2, Upload, Play } from 'lucide-react';
import { appsAPI } from '@/lib/api';
import AppRuntime from '@/components/app/AppRuntime';
import CSVImport from '@/components/app/CSVImport';
import toast from 'react-hot-toast';

export default function AppViewPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'app' | 'csv'>('app');

  const { data: app, isLoading, isError } = useQuery({
    queryKey: ['app', id],
    queryFn: () => appsAPI.get(id).then(r => r.data),
  });

  const togglePublish = useMutation({
    mutationFn: () => appsAPI.publish(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['app', id] });
      qc.invalidateQueries({ queryKey: ['apps'] });
      toast.success(res.data.published ? 'App is now live! 🚀' : 'App unpublished');
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
    </div>
  );

  if (isError || !app) return (
    <div className="p-6 text-center text-red-500">
      <p>App not found or failed to load.</p>
      <Link href="/dashboard" className="text-primary-600 underline mt-2 inline-block">Back to Dashboard</Link>
    </div>
  );

  // Get first collection from config for CSV import
  const firstCollection = app.config?.components?.[0]?.collection || 'default';

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{app.name}</h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`badge text-xs ${app.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {app.published ? <Globe className="w-3 h-3 mr-1 inline" /> : <Lock className="w-3 h-3 mr-1 inline" />}
                {app.published ? 'Live' : 'Draft'}
              </span>
              <span className="text-xs text-gray-400">{app.config?.components?.length || 0} components</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => togglePublish.mutate()}
            disabled={togglePublish.isPending}
            className="btn-secondary text-sm"
          >
            {app.published ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {app.published ? 'Unpublish' : 'Publish'}
          </button>
          <Link href={`/dashboard/apps/${id}/edit`} className="btn-secondary text-sm">
            <Edit className="w-4 h-4" /> Edit Config
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        <button
          onClick={() => setTab('app')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'app' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Play className="w-3.5 h-3.5" /> Run App
        </button>
        <button
          onClick={() => setTab('csv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'csv' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Upload className="w-3.5 h-3.5" /> Import CSV
        </button>
      </div>

      {/* Content */}
      {tab === 'app' ? (
        <AppRuntime appId={id} config={app.config} />
      ) : (
        <div className="card p-6 max-w-xl">
          <h2 className="font-semibold text-gray-900 mb-1">Import CSV Data</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload a CSV file to bulk-import records into <span className="font-medium text-primary-600">{firstCollection}</span>
          </p>
          <CSVImport
            appId={id}
            collection={firstCollection}
            onSuccess={() => setTab('app')}
          />
        </div>
      )}
    </div>
  );
}

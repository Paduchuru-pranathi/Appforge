'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Loader2, AlertTriangle } from 'lucide-react';
import { appsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AppEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);

  const { data: app, isLoading } = useQuery({
    queryKey: ['app', id],
    queryFn: () => appsAPI.get(id).then(r => r.data),
  });

  useEffect(() => {
    if (app?.config) {
      setJsonText(JSON.stringify(app.config, null, 2));
    }
  }, [app]);

  const updateApp = useMutation({
    mutationFn: (config: any) => appsAPI.update(id, config),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['app', id] });
      qc.invalidateQueries({ queryKey: ['apps'] });
      const w = res.data.warnings || [];
      setWarnings(w);
      if (w.length > 0) {
        toast.success(`Saved! ${w.length} field(s) were auto-corrected.`);
      } else {
        toast.success('Config saved!');
      }
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Save failed'),
  });

  const handleSave = () => {
    try {
      const config = JSON.parse(jsonText);
      setJsonError('');
      updateApp.mutate(config);
    } catch {
      setJsonError('Invalid JSON — fix syntax errors before saving');
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/apps/${id}`} className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Config</h1>
            <p className="text-sm text-gray-500">{app?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/apps/${id}`} className="btn-secondary text-sm">
            <Eye className="w-4 h-4" /> Preview
          </Link>
          <button onClick={handleSave} disabled={updateApp.isPending} className="btn-primary text-sm">
            {updateApp.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="card p-4 border-amber-200 bg-amber-50 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Auto-corrections applied:</p>
              <ul className="text-xs text-amber-700 mt-1 space-y-0.5">
                {warnings.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">config.json</span>
          {jsonError && <span className="text-xs text-red-400">{jsonError}</span>}
        </div>
        <textarea
          value={jsonText}
          onChange={e => { setJsonText(e.target.value); setJsonError(''); setWarnings([]); }}
          className="w-full h-[calc(100vh-280px)] min-h-96 font-mono text-sm p-4 bg-gray-900 text-green-300 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          spellCheck={false}
        />
      </div>

      <p className="text-xs text-gray-400 mt-3">
        💡 Tip: Invalid or missing fields are auto-corrected when you save. The system never breaks on bad config.
      </p>
    </div>
  );
}

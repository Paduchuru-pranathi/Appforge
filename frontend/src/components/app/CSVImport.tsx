'use client';
import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle, X, FileText } from 'lucide-react';
import { dataAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface CSVImportProps {
  appId: string;
  collection: string;
  onSuccess?: () => void;
}

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').replace(/\s+/g, '_').toLowerCase());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { if (h) row[h] = values[i] || ''; });
    return row;
  }).filter(row => Object.values(row).some(v => v !== ''));

  return { headers, rows };
}

export default function CSVImport({ appId, collection, onSuccess }: CSVImportProps) {
  const [preview, setPreview] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { toast.error('Please upload a .csv file'); return; }
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.headers.length === 0) { toast.error('CSV appears empty or invalid'); return; }
      setPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    let success = 0, failed = 0;
    for (const row of preview.rows) {
      try {
        await dataAPI.create(appId, collection, row);
        success++;
      } catch { failed++; }
    }
    setImporting(false);
    setResult({ success, failed });
    if (success > 0) {
      toast.success(`Imported ${success} records!`);
      onSuccess?.();
    }
    if (failed > 0) toast.error(`${failed} records failed`);
  };

  const reset = () => { setPreview(null); setResult(null); setFileName(''); if (fileRef.current) fileRef.current.value = ''; };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      {!preview && !result && (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">Click to upload CSV file</p>
          <p className="text-xs text-gray-400 mt-1">First row must be column headers</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>
      )}

      {/* File selected - preview */}
      {preview && !result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FileText className="w-4 h-4 text-primary-500" />
              <span className="font-medium">{fileName}</span>
              <span className="text-gray-400">— {preview.rows.length} rows, {preview.headers.length} columns</span>
            </div>
            <button onClick={reset} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>

          {/* Preview table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-48">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    {preview.headers.map(h => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      {preview.headers.map(h => (
                        <td key={h} className="px-3 py-2 text-gray-600 max-w-24 truncate">{row[h] || '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.rows.length > 5 && (
              <p className="text-xs text-gray-400 px-3 py-2 bg-gray-50 border-t">
                ... and {preview.rows.length - 5} more rows
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={handleImport} disabled={importing} className="btn-primary text-sm">
              {importing ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Importing {preview.rows.length} rows...
                </span>
              ) : (
                <><Upload className="w-4 h-4" /> Import {preview.rows.length} Records</>
              )}
            </button>
            <button onClick={reset} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-4 rounded-xl ${result.failed === 0 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            {result.failed === 0
              ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              : <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            }
            <div>
              <p className="text-sm font-medium text-gray-900">Import Complete</p>
              <p className="text-xs text-gray-600 mt-0.5">
                {result.success} records imported successfully{result.failed > 0 ? `, ${result.failed} failed` : ''}
              </p>
            </div>
          </div>
          <button onClick={reset} className="btn-secondary text-sm">Import Another File</button>
        </div>
      )}
    </div>
  );
}

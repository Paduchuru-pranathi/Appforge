'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit2, Plus, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { dataAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import DynamicForm from './DynamicForm';
import { formatDistanceToNow } from 'date-fns';

interface Column {
  key: string;
  label: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

interface DynamicTableProps {
  appId: string;
  collection: string;
  columns?: Column[];
  fields?: FieldConfig[];
  title?: string;
  actions?: string[];
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  const str = String(value);
  if (str.length > 50) return str.slice(0, 50) + '...';
  return str;
}

export default function DynamicTable({ appId, collection, columns, fields, title, actions = ['create', 'edit', 'delete'] }: DynamicTableProps) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editRecord, setEditRecord] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['data', appId, collection, page, search],
    queryFn: () => dataAPI.list(appId, collection, { page, limit: 20, search: search || undefined }).then(r => r.data),
    placeholderData: (prev) => prev,
  });

  const createRecord = useMutation({
    mutationFn: (record: any) => dataAPI.create(appId, collection, record),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['data', appId, collection] });
      toast.success('Record created');
      setShowCreate(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed to create'),
  });

  const updateRecord = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => dataAPI.update(appId, collection, id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['data', appId, collection] });
      toast.success('Record updated');
      setEditRecord(null);
    },
    onError: () => toast.error('Failed to update'),
  });

  const deleteRecord = useMutation({
    mutationFn: (id: string) => dataAPI.delete(appId, collection, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['data', appId, collection] });
      toast.success('Record deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });

  // Auto-derive columns from first record if none provided
  const records: any[] = data?.data || [];
  const derivedColumns: Column[] = columns && columns.length > 0
    ? columns
    : records.length > 0
      ? Object.keys(records[0])
          .filter(k => !k.startsWith('_') && k !== 'id')
          .slice(0, 6)
          .map(k => ({ key: k, label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }))
      : fields?.map(f => ({ key: f.name, label: f.label })) || [];

  const canCreate = actions.includes('create');
  const canEdit = actions.includes('edit');
  const canDelete = actions.includes('delete');

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
            placeholder="Search records..."
            className="input pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {search && (
            <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="btn-secondary text-sm py-1.5">
              Clear
            </button>
          )}
          {canCreate && (
            <button onClick={() => setShowCreate(!showCreate)} className="btn-primary text-sm">
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          )}
        </div>
      </div>

      {/* Create form */}
      {showCreate && fields && fields.length > 0 && (
        <div className="card p-5 border-primary-200 bg-primary-50/30">
          <h4 className="font-medium text-gray-900 mb-4">New Record</h4>
          <DynamicForm
            fields={fields}
            onSubmit={async (d) => { await createRecord.mutateAsync(d); }}
            onCancel={() => setShowCreate(false)}
            submitLabel="Create Record"
          />
        </div>
      )}

      {/* Edit form */}
      {editRecord && fields && fields.length > 0 && (
        <div className="card p-5 border-amber-200 bg-amber-50/30">
          <h4 className="font-medium text-gray-900 mb-4">Edit Record</h4>
          <DynamicForm
            fields={fields}
            initialData={editRecord}
            onSubmit={async (d) => { await updateRecord.mutateAsync({ id: editRecord.id, data: d }); }}
            onCancel={() => setEditRecord(null)}
            submitLabel="Update Record"
          />
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            <p>Failed to load data. Please try again.</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">{search ? 'No records match your search' : 'No records yet'}</p>
            {!search && canCreate && (
              <button onClick={() => setShowCreate(true)} className="text-primary-600 text-sm mt-2 hover:underline">
                Add the first record
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {derivedColumns.map(col => (
                    <th key={col.key} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                  {(canEdit || canDelete) && (
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    {derivedColumns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-gray-700 max-w-xs truncate">
                        {formatValue(record[col.key])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {record._createdAt ? formatDistanceToNow(new Date(record._createdAt), { addSuffix: true }) : '—'}
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          {canEdit && (
                            <button
                              onClick={() => setEditRecord(record)}
                              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => { if (confirm('Delete this record?')) deleteRecord.mutate(record.id); }}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {data.pagination.total} total records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600">{page} / {data.pagination.pages}</span>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                disabled={page >= data.pagination.pages}
                className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

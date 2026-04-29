'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Zap, Code2, Wand2, ChevronRight } from 'lucide-react';

const TEMPLATES = [
  {
    name: 'CRM App',
    description: 'Customer relationship management with contacts and deals',
    config: {
      name: 'Customer CRM',
      description: 'Manage your customers and deals',
      theme: { primaryColor: '#6366f1' },
      components: [
        {
          id: 'add-customer',
          type: 'form',
          title: 'Add Customer',
          collection: 'customers',
          fields: [
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel' },
            { name: 'company', label: 'Company', type: 'text' },
            { name: 'status', label: 'Status', type: 'select', options: ['Lead', 'Prospect', 'Active', 'Churned'] },
          ],
        },
        {
          id: 'customers-table',
          type: 'table',
          title: 'All Customers',
          collection: 'customers',
          actions: ['create', 'edit', 'delete'],
        },
      ],
    },
  },
  {
    name: 'Task Manager',
    description: 'Simple task and project tracking',
    config: {
      name: 'Task Manager',
      description: 'Track tasks and projects',
      components: [
        {
          id: 'add-task',
          type: 'form',
          title: 'New Task',
          collection: 'tasks',
          fields: [
            { name: 'title', label: 'Task Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
            { name: 'due_date', label: 'Due Date', type: 'date' },
            { name: 'status', label: 'Status', type: 'select', options: ['Todo', 'In Progress', 'Review', 'Done'] },
          ],
        },
        { id: 'tasks-table', type: 'table', title: 'All Tasks', collection: 'tasks' },
      ],
    },
  },
  {
    name: 'Inventory',
    description: 'Track products and stock levels',
    config: {
      name: 'Inventory Manager',
      components: [
        {
          id: 'add-product',
          type: 'form',
          title: 'Add Product',
          collection: 'products',
          fields: [
            { name: 'name', label: 'Product Name', type: 'text', required: true },
            { name: 'sku', label: 'SKU', type: 'text' },
            { name: 'quantity', label: 'Quantity', type: 'number', required: true },
            { name: 'price', label: 'Price ($)', type: 'number' },
            { name: 'category', label: 'Category', type: 'select', options: ['Electronics', 'Clothing', 'Food', 'Other'] },
          ],
        },
        { id: 'products-table', type: 'table', title: 'Products', collection: 'products' },
      ],
    },
  },
  {
    name: 'Blank App',
    description: 'Start from scratch with your own config',
    config: {
      name: 'My App',
      components: [],
    },
  },
];

export default function NewAppPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'templates' | 'json'>('templates');
  const [jsonInput, setJsonInput] = useState('{\n  "name": "My App",\n  "components": []\n}');
  const [jsonError, setJsonError] = useState('');

  const createApp = useMutation({
    mutationFn: (config: any) => appsAPI.create(config),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['apps'] });
      const warnings = res.data.warnings;
      if (warnings?.length) {
        toast.success(`App created with ${warnings.length} warning(s) — config was auto-fixed`);
      } else {
        toast.success('App created! 🎉');
      }
      router.push(`/dashboard/apps/${res.data.app.id}`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to create app'),
  });

  const handleTemplate = (config: any) => {
    createApp.mutate(config);
  };

  const handleJSONCreate = () => {
    try {
      const config = JSON.parse(jsonInput);
      setJsonError('');
      createApp.mutate(config);
    } catch {
      setJsonError('Invalid JSON — please fix the syntax errors');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New App</h1>
        <p className="text-gray-500 mt-1">Choose a template or paste your own JSON config</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-8">
        {[
          { id: 'templates', label: 'Templates', icon: Wand2 },
          { id: 'json', label: 'JSON Config', icon: Code2 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'templates' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => handleTemplate(template.config)}
              disabled={createApp.isPending}
              className="card p-6 text-left hover:border-primary-300 hover:shadow-md transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-3">
              Paste your JSON config below. Missing or invalid fields will be auto-fixed.
            </p>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError('');
              }}
              className="w-full h-80 font-mono text-sm p-4 bg-gray-900 text-green-300 rounded-lg border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              spellCheck={false}
            />
            {jsonError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                ⚠️ {jsonError}
              </p>
            )}
          </div>

          <button
            onClick={handleJSONCreate}
            disabled={createApp.isPending}
            className="btn-primary"
          >
            {createApp.isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              <><Zap className="w-4 h-4" /> Create App from JSON</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

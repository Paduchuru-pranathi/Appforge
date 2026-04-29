'use client';
import { useState } from 'react';
import { AlertTriangle, Layers } from 'lucide-react';
import DynamicForm from './DynamicForm';
import DynamicTable from './DynamicTable';
import { dataAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface ComponentConfig {
  id: string;
  type: string;
  title?: string;
  collection?: string;
  fields?: any[];
  columns?: any[];
  actions?: string[];
}

interface AppConfig {
  name: string;
  description?: string;
  theme?: { primaryColor?: string };
  components: ComponentConfig[];
}

interface AppRuntimeProps {
  appId: string;
  config: AppConfig;
}

function UnknownComponent({ comp }: { comp: ComponentConfig }) {
  return (
    <div className="card p-6 border-amber-200 bg-amber-50/30">
      <div className="flex items-center gap-2 text-amber-600">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">Unknown component type: "{comp.type}"</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">This component type is not supported yet.</p>
    </div>
  );
}

function ComponentRenderer({ appId, comp, activeTab, setActiveTab, index }: {
  appId: string;
  comp: ComponentConfig;
  activeTab: string;
  setActiveTab: (id: string) => void;
  index: number;
}) {
  if (!comp || !comp.id) {
    return (
      <div className="card p-4 border-red-200 bg-red-50/30 text-red-600 text-sm">
        ⚠️ Invalid component at position {index}
      </div>
    );
  }

  switch (comp.type) {
    case 'form':
      return (
        <div className="card p-6">
          {comp.title && <h2 className="font-semibold text-gray-900 mb-4 text-lg">{comp.title}</h2>}
          {(!comp.fields || comp.fields.length === 0) ? (
            <p className="text-gray-400 text-sm">No fields configured for this form.</p>
          ) : (
            <DynamicForm
              fields={comp.fields}
              title={comp.title}
              onSubmit={async (data) => {
                await dataAPI.create(appId, comp.collection || 'default', data);
                toast.success('Record saved!');
              }}
            />
          )}
        </div>
      );

    case 'table':
      return (
        <div>
          {comp.title && <h2 className="font-semibold text-gray-900 mb-4 text-lg">{comp.title}</h2>}
          <DynamicTable
            appId={appId}
            collection={comp.collection || 'default'}
            columns={comp.columns}
            fields={comp.fields}
            title={comp.title}
            actions={comp.actions}
          />
        </div>
      );

    case 'dashboard':
      return (
        <div className="card p-6">
          {comp.title && <h2 className="font-semibold text-gray-900 mb-4 text-lg">{comp.title}</h2>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(comp.fields || []).map((field: any, i: number) => (
              <div key={i} className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary-700">—</p>
                <p className="text-sm text-gray-600 mt-1">{field.label || field.name}</p>
              </div>
            ))}
          </div>
          {(!comp.fields || comp.fields.length === 0) && (
            <p className="text-gray-400 text-sm">Dashboard with no metrics defined.</p>
          )}
        </div>
      );

    case 'card':
      return (
        <div className="card p-6">
          {comp.title && <h2 className="font-semibold text-gray-900 mb-4 text-lg">{comp.title}</h2>}
          <DynamicForm
            fields={comp.fields || []}
            onSubmit={async (data) => {
              await dataAPI.create(appId, comp.collection || 'default', data);
              toast.success('Saved!');
            }}
          />
        </div>
      );

    default:
      return <UnknownComponent comp={comp} />;
  }
}

export default function AppRuntime({ appId, config }: AppRuntimeProps) {
  const [activeTab, setActiveTab] = useState(config.components?.[0]?.id || '');

  if (!config) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No configuration found</p>
      </div>
    );
  }

  const components = Array.isArray(config.components) ? config.components : [];

  if (components.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No components</h3>
        <p className="text-gray-500 text-sm">This app has no components defined in its config.</p>
      </div>
    );
  }

  // Single component: no tabs
  if (components.length === 1) {
    return (
      <ComponentRenderer
        appId={appId}
        comp={components[0]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        index={0}
      />
    );
  }

  // Multiple: tab layout
  const activeComp = components.find(c => c.id === activeTab) || components[0];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {components.map((comp, i) => (
          <button
            key={comp.id || i}
            onClick={() => setActiveTab(comp.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              (activeTab === comp.id || (!activeTab && i === 0))
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {comp.title || comp.type || `Component ${i + 1}`}
          </button>
        ))}
      </div>

      {/* Active component */}
      <ComponentRenderer
        appId={appId}
        comp={activeComp}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        index={components.indexOf(activeComp)}
      />
    </div>
  );
}

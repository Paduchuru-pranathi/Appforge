'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Loader2, X } from 'lucide-react';

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  validation?: { min?: number; max?: number; pattern?: string };
}

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  initialData?: Record<string, any>;
  title?: string;
  submitLabel?: string;
}

export default function DynamicForm({ fields, onSubmit, onCancel, initialData, submitLabel = 'Save' }: DynamicFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {},
  });

  const submit = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      // Convert number fields
      const processed: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        const field = fields.find(f => f.name === key);
        if (field?.type === 'number' && value !== '' && value != null) {
          processed[key] = Number(value);
        } else if (field?.type === 'checkbox') {
          processed[key] = Boolean(value);
        } else {
          processed[key] = value;
        }
      }
      await onSubmit(processed);
      if (!initialData) reset();
    } finally {
      setLoading(false);
    }
  };

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No fields defined for this form</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      {fields.map((field) => {
        const fieldError = errors[field.name];
        const baseProps = {
          ...register(field.name, {
            required: field.required ? `${field.label} is required` : false,
            min: field.validation?.min !== undefined ? { value: field.validation.min, message: `Min value is ${field.validation.min}` } : undefined,
            max: field.validation?.max !== undefined ? { value: field.validation.max, message: `Max value is ${field.validation.max}` } : undefined,
            pattern: field.validation?.pattern ? { value: new RegExp(field.validation.pattern), message: 'Invalid format' } : undefined,
          }),
        };

        return (
          <div key={field.name}>
            <label className="label">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                {...baseProps}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                rows={3}
                className={`input resize-none ${fieldError ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
            ) : field.type === 'select' ? (
              <select {...baseProps} className={`input ${fieldError ? 'border-red-400' : ''}`}>
                <option value="">Select {field.label}</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <input
                  {...baseProps}
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{field.label}</span>
              </div>
            ) : (
              <input
                {...baseProps}
                type={field.type}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                className={`input ${fieldError ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
            )}

            {fieldError && (
              <p className="text-red-500 text-xs mt-1">{fieldError.message as string}</p>
            )}
          </div>
        );
      })}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// Validates and normalizes app configs — handles missing, inconsistent, or wrong fields

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date' | 'url' | 'tel';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ComponentConfig {
  id: string;
  type: 'form' | 'table' | 'dashboard' | 'card' | 'unknown';
  title?: string;
  collection?: string;
  fields?: FieldConfig[];
  columns?: { key: string; label: string }[];
  actions?: string[];
}

export interface APIConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  collection: string;
  action: 'list' | 'get' | 'create' | 'update' | 'delete';
}

export interface AuthConfig {
  methods: ('email' | 'google')[];
  userFields?: FieldConfig[];
}

export interface AppConfig {
  name: string;
  description?: string;
  theme?: {
    primaryColor?: string;
    fontFamily?: string;
    darkMode?: boolean;
  };
  components: ComponentConfig[];
  apis?: APIConfig[];
  auth?: AuthConfig;
  i18n?: {
    defaultLocale?: string;
    locales?: string[];
  };
}

const VALID_FIELD_TYPES: readonly string[] = ['text', 'email', 'number', 'select', 'textarea', 'checkbox', 'date', 'url', 'tel'];
const VALID_COMPONENT_TYPES: readonly string[] = ['form', 'table', 'dashboard', 'card'];
const VALID_METHODS: readonly string[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

function normalizeField(field: any, index: number): FieldConfig {
  if (!field || typeof field !== 'object') {
    return { name: `field_${index}`, label: `Field ${index}`, type: 'text' };
  }

  const name =
    typeof field.name === 'string' && field.name.trim()
      ? field.name.trim().replace(/\s+/g, '_').toLowerCase()
      : `field_${index}`;

  const label =
    typeof field.label === 'string' && field.label.trim()
      ? field.label.trim()
      : name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  const type = VALID_FIELD_TYPES.includes(field.type) ? field.type : 'text';

  const normalized: FieldConfig = { name, label, type };

  if (field.required === true) normalized.required = true;
  if (field.placeholder) normalized.placeholder = String(field.placeholder);

  // ✅ FIXED SAFELY
  if (type === 'select') {
    const opts = Array.isArray(field.options)
      ? field.options.filter((o: any) => o != null).map(String)
      : [];

    normalized.options = opts.length > 0 ? opts : ['Option 1', 'Option 2'];
  }

  if (field.validation && typeof field.validation === 'object') {
    normalized.validation = {};
    if (typeof field.validation.min === 'number') normalized.validation.min = field.validation.min;
    if (typeof field.validation.max === 'number') normalized.validation.max = field.validation.max;
    if (typeof field.validation.pattern === 'string') normalized.validation.pattern = field.validation.pattern;
  }

  return normalized;
}

function normalizeComponent(comp: any, index: number): ComponentConfig {
  if (!comp || typeof comp !== 'object') {
    return { id: `component_${index}`, type: 'unknown', title: `Component ${index}` };
  }

  const id =
    typeof comp.id === 'string' && comp.id.trim()
      ? comp.id.trim()
      : `component_${index}`;

  const type = VALID_COMPONENT_TYPES.includes(comp.type) ? comp.type : 'unknown';

  const title =
    typeof comp.title === 'string'
      ? comp.title.trim()
      : `${type} ${index + 1}`;

  const collection =
    typeof comp.collection === 'string'
      ? comp.collection.trim().replace(/\s+/g, '_').toLowerCase()
      : `collection_${index}`;

  const normalized: ComponentConfig = { id, type, title, collection };

  normalized.fields = Array.isArray(comp.fields)
    ? comp.fields.map((f: any, i: number) => normalizeField(f, i))
    : [];

  if (Array.isArray(comp.columns)) {
    normalized.columns = comp.columns
      .filter((c: any) => c && typeof c === 'object')
      .map((c: any, i: number) => ({
        key: typeof c.key === 'string' ? c.key : `col_${i}`,
        label: typeof c.label === 'string' ? c.label : `Column ${i + 1}`,
      }));
  }

  normalized.actions = Array.isArray(comp.actions)
    ? comp.actions.filter((a: any) => typeof a === 'string')
    : ['create', 'edit', 'delete'];

  return normalized;
}

function normalizeAPI(api: any, index: number): APIConfig {
  const path = typeof api?.path === 'string' ? api.path : `/api/data/collection_${index}`;
  const method = VALID_METHODS.includes(api?.method?.toUpperCase?.())
    ? api.method.toUpperCase()
    : 'GET';
  const collection = typeof api?.collection === 'string' ? api.collection : `collection_${index}`;
  const action = ['list', 'get', 'create', 'update', 'delete'].includes(api?.action)
    ? api.action
    : 'list';

  return { path, method, collection, action };
}

export function validateAndNormalizeConfig(rawConfig: any): { config: AppConfig; warnings: string[] } {
  const warnings: string[] = [];

  if (!rawConfig || typeof rawConfig !== 'object') {
    warnings.push('Config is not an object, using defaults');
    return {
      config: { name: 'Untitled App', components: [] },
      warnings,
    };
  }

  const name =
    typeof rawConfig.name === 'string' && rawConfig.name.trim()
      ? rawConfig.name.trim()
      : 'Untitled App';

  if (!rawConfig.name) warnings.push('Missing app name, defaulting to "Untitled App"');

  const components: ComponentConfig[] = Array.isArray(rawConfig.components)
    ? rawConfig.components.map((c: any, i: number) => {
        if (!c || typeof c !== 'object') {
          warnings.push(`Component at index ${i} is invalid, fixing`);
          return normalizeComponent(null, i);
        }
        return normalizeComponent(c, i);
      })
    : [];

  if (!Array.isArray(rawConfig.components)) {
    warnings.push('No components array found, using empty list');
  }

  const apis: APIConfig[] = Array.isArray(rawConfig.apis)
    ? rawConfig.apis.map((a: any, i: number) => normalizeAPI(a, i))
    : [];

  const auth: AuthConfig = {
    methods: ['email'],
  };

  if (rawConfig.auth && typeof rawConfig.auth === 'object') {
    if (Array.isArray(rawConfig.auth.methods)) {
      auth.methods = rawConfig.auth.methods.filter((m: any) =>
        ['email', 'google'].includes(m)
      );
      if (auth.methods.length === 0) {
        auth.methods = ['email'];
        warnings.push('No valid auth methods found, defaulting to email');
      }
    }
  }

  const theme =
    rawConfig.theme && typeof rawConfig.theme === 'object'
      ? {
          primaryColor: typeof rawConfig.theme.primaryColor === 'string' ? rawConfig.theme.primaryColor : '#6366f1',
          fontFamily: typeof rawConfig.theme.fontFamily === 'string' ? rawConfig.theme.fontFamily : 'Inter',
          darkMode: rawConfig.theme.darkMode === true,
        }
      : { primaryColor: '#6366f1', fontFamily: 'Inter', darkMode: false };

  const config: AppConfig = {
    name,
    description: typeof rawConfig.description === 'string' ? rawConfig.description : '',
    theme,
    components,
    apis,
    auth,
  };

  if (rawConfig.i18n && typeof rawConfig.i18n === 'object') {
    config.i18n = {
      defaultLocale: rawConfig.i18n.defaultLocale || 'en',
      locales: Array.isArray(rawConfig.i18n.locales) ? rawConfig.i18n.locales : ['en'],
    };
  }

  return { config, warnings };
}
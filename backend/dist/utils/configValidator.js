"use strict";
// Validates and normalizes app configs — handles missing, inconsistent, or wrong fields
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndNormalizeConfig = validateAndNormalizeConfig;
const VALID_FIELD_TYPES = ['text', 'email', 'number', 'select', 'textarea', 'checkbox', 'date', 'url', 'tel'];
const VALID_COMPONENT_TYPES = ['form', 'table', 'dashboard', 'card'];
const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
function normalizeField(field, index) {
    if (!field || typeof field !== 'object') {
        return { name: `field_${index}`, label: `Field ${index}`, type: 'text' };
    }
    const name = typeof field.name === 'string' && field.name.trim()
        ? field.name.trim().replace(/\s+/g, '_').toLowerCase()
        : `field_${index}`;
    const label = typeof field.label === 'string' && field.label.trim()
        ? field.label.trim()
        : name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const type = VALID_FIELD_TYPES.includes(field.type) ? field.type : 'text';
    const normalized = { name, label, type };
    if (field.required === true)
        normalized.required = true;
    if (field.placeholder)
        normalized.placeholder = String(field.placeholder);
    // ✅ FIXED SAFELY
    if (type === 'select') {
        const opts = Array.isArray(field.options)
            ? field.options.filter((o) => o != null).map(String)
            : [];
        normalized.options = opts.length > 0 ? opts : ['Option 1', 'Option 2'];
    }
    if (field.validation && typeof field.validation === 'object') {
        normalized.validation = {};
        if (typeof field.validation.min === 'number')
            normalized.validation.min = field.validation.min;
        if (typeof field.validation.max === 'number')
            normalized.validation.max = field.validation.max;
        if (typeof field.validation.pattern === 'string')
            normalized.validation.pattern = field.validation.pattern;
    }
    return normalized;
}
function normalizeComponent(comp, index) {
    if (!comp || typeof comp !== 'object') {
        return { id: `component_${index}`, type: 'unknown', title: `Component ${index}` };
    }
    const id = typeof comp.id === 'string' && comp.id.trim()
        ? comp.id.trim()
        : `component_${index}`;
    const type = VALID_COMPONENT_TYPES.includes(comp.type) ? comp.type : 'unknown';
    const title = typeof comp.title === 'string'
        ? comp.title.trim()
        : `${type} ${index + 1}`;
    const collection = typeof comp.collection === 'string'
        ? comp.collection.trim().replace(/\s+/g, '_').toLowerCase()
        : `collection_${index}`;
    const normalized = { id, type, title, collection };
    normalized.fields = Array.isArray(comp.fields)
        ? comp.fields.map((f, i) => normalizeField(f, i))
        : [];
    if (Array.isArray(comp.columns)) {
        normalized.columns = comp.columns
            .filter((c) => c && typeof c === 'object')
            .map((c, i) => ({
            key: typeof c.key === 'string' ? c.key : `col_${i}`,
            label: typeof c.label === 'string' ? c.label : `Column ${i + 1}`,
        }));
    }
    normalized.actions = Array.isArray(comp.actions)
        ? comp.actions.filter((a) => typeof a === 'string')
        : ['create', 'edit', 'delete'];
    return normalized;
}
function normalizeAPI(api, index) {
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
function validateAndNormalizeConfig(rawConfig) {
    const warnings = [];
    if (!rawConfig || typeof rawConfig !== 'object') {
        warnings.push('Config is not an object, using defaults');
        return {
            config: { name: 'Untitled App', components: [] },
            warnings,
        };
    }
    const name = typeof rawConfig.name === 'string' && rawConfig.name.trim()
        ? rawConfig.name.trim()
        : 'Untitled App';
    if (!rawConfig.name)
        warnings.push('Missing app name, defaulting to "Untitled App"');
    const components = Array.isArray(rawConfig.components)
        ? rawConfig.components.map((c, i) => {
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
    const apis = Array.isArray(rawConfig.apis)
        ? rawConfig.apis.map((a, i) => normalizeAPI(a, i))
        : [];
    const auth = {
        methods: ['email'],
    };
    if (rawConfig.auth && typeof rawConfig.auth === 'object') {
        if (Array.isArray(rawConfig.auth.methods)) {
            auth.methods = rawConfig.auth.methods.filter((m) => ['email', 'google'].includes(m));
            if (auth.methods.length === 0) {
                auth.methods = ['email'];
                warnings.push('No valid auth methods found, defaulting to email');
            }
        }
    }
    const theme = rawConfig.theme && typeof rawConfig.theme === 'object'
        ? {
            primaryColor: typeof rawConfig.theme.primaryColor === 'string' ? rawConfig.theme.primaryColor : '#6366f1',
            fontFamily: typeof rawConfig.theme.fontFamily === 'string' ? rawConfig.theme.fontFamily : 'Inter',
            darkMode: rawConfig.theme.darkMode === true,
        }
        : { primaryColor: '#6366f1', fontFamily: 'Inter', darkMode: false };
    const config = {
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
//# sourceMappingURL=configValidator.js.map
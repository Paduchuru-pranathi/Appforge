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
    columns?: {
        key: string;
        label: string;
    }[];
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
export declare function validateAndNormalizeConfig(rawConfig: any): {
    config: AppConfig;
    warnings: string[];
};
//# sourceMappingURL=configValidator.d.ts.map
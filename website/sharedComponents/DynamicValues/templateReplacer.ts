import { ObservableMap } from 'mobx';

const KeyRegex = /{{(?<key>[^}]+)}}/g;

export const templateReplacer = (code?: string, dynamicValues?: ObservableMap<string, string>) => {
    if (!code) {
        return '';
    }
    return code.replace(KeyRegex, (_, key) => dynamicValues?.get(key) || `<${key}>`);
};

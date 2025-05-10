import { Config } from '@docusaurus/types';

export type ConfigTransformer<T, U> = (current: T) => U;

export interface ConfigTransformers {
    [key: string]: ConfigTransformer<any, any>;
}

const splitKey = (key: string): string[] => {
    return key.split('.').map((k) => k.trim());
};

const isPlainObject = (value: any): boolean => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const getValueAt = <T>(config: any, key: string, keyPath?: string[]): T | undefined => {
    keyPath = keyPath === undefined ? splitKey(key) : [...keyPath];
    const currentKeySegment = keyPath.shift();

    if (currentKeySegment === undefined) {
        throw new Error(
            `An unexpected error occurred while traversing the key path '${key}'. The key path is empty in getValueAt.`
        );
    }

    const currentValue = config[currentKeySegment];

    // End of key path reached. Add the key with value undefined, if it doesn't exist.
    if (keyPath.length === 0) {
        if (currentValue === undefined) {
            config[currentKeySegment] = undefined;
        }
        return config[currentKeySegment];
    }

    // If the current value is a plain object, continue traversing.
    if (isPlainObject(currentValue)) {
        return getValueAt(currentValue, key, keyPath);
    }

    // If the current value is undefined, create an empty object and continue traversing.
    if (currentValue === undefined) {
        config[currentKeySegment] = {};
        return getValueAt(config[currentKeySegment], key, keyPath);
    }

    // If the current value is neither a plain object nor undefined, we can't continue traversing. Throw an error.
    throw new Error(
        `Transformer failed for key '${key}' at '${currentKeySegment}': Can't append children to a non-object value '${currentValue}'.`
    );
};

const setValueAt = <T>(config: any, key: string, value: T, keyPath?: string[]): void => {
    keyPath = keyPath === undefined ? splitKey(key) : [...keyPath];
    const currentKeySegment = keyPath.shift();

    if (currentKeySegment === undefined) {
        throw new Error(
            `An unexpected error occurred while traversing the key path '${key}'. The key path is empty in setValueAt.`
        );
    }

    // End of key path reached. Set the value.
    if (keyPath.length === 0) {
        config[currentKeySegment] = value;
        return;
    }

    // Continue traversing the key path.
    const currentValue = config[currentKeySegment];
    if (!isPlainObject(currentValue)) {
        throw new Error(
            `An unexpected error occurred while trying to set the value for key '${key}': Value at '${currentKeySegment}' is not an object. This should have been handled before.`
        );
    }
    setValueAt(currentValue, key, value, keyPath);
};

export const applyTransformers: (docusaurusConfig: Config, transformers: ConfigTransformers) => Config = (
    docusaurusConfig,
    transformers
) => {
    Object.keys(transformers).forEach((key: string) => {
        const currentValue = getValueAt(docusaurusConfig, key);
        const transformedValue = transformers[key](currentValue);
        setValueAt(docusaurusConfig, key, transformedValue);
    });

    return docusaurusConfig;
};

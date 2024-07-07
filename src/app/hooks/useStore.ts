// Source: https://github.com/GBSL-Informatik/teaching-dev/blob/main/src/hooks/useStore.ts
import React from 'react';
import { rootStore, storesContext } from '../stores/rootStore';

export const useStores = () => React.useContext(storesContext);

export const useStore = <T extends keyof typeof rootStore>(store: T): (typeof rootStore)[T] => {
    return React.useContext(storesContext)[store];
};

// Source: https://github.com/GBSL-Informatik/teaching-dev/blob/main/src/stores/rootStore.ts, https://github.com/lebalz/ofi-blog/blob/main/src/stores/ViewStore.ts
import React from 'react';
import {ToolStore} from "@site/src/app/stores/ToolStore";


export class RootStore {

    toolStore: ToolStore

    constructor() {
        this.toolStore = new ToolStore(this);
    }
}

export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;

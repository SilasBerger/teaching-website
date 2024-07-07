// Source: https://github.com/GBSL-Informatik/teaching-dev/blob/main/src/stores/rootStore.ts, https://github.com/lebalz/ofi-blog/blob/main/src/stores/ViewStore.ts
import React from 'react';
import {ToolsStore} from "@site/src/app/stores/ToolsStore";


export class RootStore {

    toolStore: ToolsStore

    constructor() {
        this.toolStore = new ToolsStore(this);
    }
}

export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext<RootStore>(rootStore);
export const StoresProvider = storesContext.Provider;

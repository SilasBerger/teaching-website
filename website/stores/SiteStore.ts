import { RootStore } from '@tdev-stores/rootStore';
import { ToolsStore } from './ToolsStore';

export default class SiteStore {
    toolsStore: ToolsStore;

    constructor(root: RootStore) {
        this.toolsStore = new ToolsStore(root);
    }
}

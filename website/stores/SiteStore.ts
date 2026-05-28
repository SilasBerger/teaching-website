import { RootStore } from '@tdev-stores/rootStore';
import { ToolsStore } from './ToolsStore';
import { ScavengerHuntStore } from './ScavengerHuntStore';

export default class SiteStore {
    toolsStore: ToolsStore;
    scavengerHuntStore: ScavengerHuntStore;

    constructor(root: RootStore) {
        this.toolsStore = new ToolsStore(root);
        this.scavengerHuntStore = new ScavengerHuntStore(root);
    }
}
